import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ejs from "ejs";
import cloudinary from "cloudinary";
import ErrorHandler from "../utils/ErrorHandler";
import courseModel from "../models/course.model";
import { redis } from "../utils/redis";
import path from "path/posix";
import sendMail from "../utils/sendMail";
import { createCourse, getAllCoursesService } from "../services/course.service";

// upload khóa học
export const uploadCourse = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const thumbnail = data.thumbnail;

      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      createCourse(data, res, next);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// chỉnh sửa khóa học
export const editCourses = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const thumbnail = data.thumbnail;

      if (thumbnail) {
        await await cloudinary.v2.uploader.destroy(thumbnail.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      // lấy ra id khóa học
      const courseId = req.params.id;

      const course = await courseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// lấy ra khóa học  --- khi đã mua/đăng ký
export const getSingleCourse = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      const isCacheExist = await redis.get(courseId);

      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        // tìm khóa học
        const course = await courseModel
          .findById(req.params.id)
          .select(
            "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
          );

        await redis.set(courseId, JSON.stringify(course), "EX", 604800);

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// lấy ra danh sách khóa học khi chưa mua
export const getAllCourses = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExist = await redis.get("allCourses");

      if (isCacheExist) {
        const courses = JSON.parse(isCacheExist);

        res.status(200).json({
          success: true,
          courses,
        });
      } else {
        const courses = await courseModel
          .find()
          .select(
            "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
          );

        await redis.set("allCourses", JSON.stringify(courses));

        res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getCourseByUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;

      const courseId = req.params.id;

      // check người dùng đã đăng ký/mua khóa học chưa
      const courseExist = userCourseList?.find(
        (course: any) => course._id.toString() === courseId
      );

      if (!courseExist) {
        return new ErrorHandler(
          "Bạn không đủ điều kiện để truy cập khóa học này!",
          400
        );
      }

      const course = await courseModel.findById(courseId);

      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// thêm câu hỏi vào khóa học
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;

      const course = await courseModel.findById(contentId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("ID content không hợp lệ!", 400));
      }

      const courseContent = course?.courseData.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("ID content không hợp lệ!", 400));
      }

      // tạo câu hỏi
      const newQuestion: any = {
        user: req.user,
        content: question,
        replies: [],
      };

      // thêm câu hỏi vào list comment trong khóa học
      courseContent.questions.push(newQuestion);

      //   await NotificationModel.create({
      //     user: req.user?._id,
      //     title: "New Question",
      //     message: `You have a new question in ${course?.name}`,
      //   });

      // lưu thông tin
      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// thêm câu trả lời cho comment
interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;

      const course = await courseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("ID content không hợp lệ!", 400));
      }

      const courseContent = course?.courseData.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("ID content không hợp lệ!", 400));
      }

      const question = courseContent?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );

      if (!question) {
        return next(new ErrorHandler("Invalid question id", 400));
      }

      const newAnswer: any = {
        user: req.user,
        answer,
      };

      // thêm câu trả lời vào list replies của comment
      question.replies?.push(newAnswer);

      // lưu thông tin
      await course?.save();

      if (req.user?._id === question.user._id) {
        // create a notification
        // await NotificationModel.create({
        //   user: req.user?._id,
        //   title: "Phản hồi bình luận mới",
        //   message: `Bạn có một phản hồi bình luận mới tại ${course?.name}`,
        // });
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };

        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "Phản hồi bình luận của bạn tại coursecn",
            template: "question-reply.ejs",
            data,
          });
        } catch (error) {
          return next(new ErrorHandler(error.message, 500));
        }
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// thêm review vào khóa học
interface IAddReviewData {
  courseId: string;
  review: string;
  rating: number;
  userId: string;
}

export const addReview = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;

      const courseId = req.params.id;

      // check khóa học có tồn tại không
      const courseExist = userCourseList?.some(
        (course: any) => course._id.toString() === courseId.toString()
      );

      if (!courseExist) {
        return next(
          new ErrorHandler(
            "Bạn không đủ điều kiện để truy cập khóa học này!",
            500
          )
        );
      }

      const course = await courseModel.findById(courseId);

      const { review, rating }: IAddReviewData = req.body;

      const reviewData: any = {
        user: req.user,
        comment: review,
        rating,
      };

      course?.reviews.push(reviewData);

      let avg = 0;
      course?.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });

      if (course) {
        course.ratings = avg / course.reviews.length;
      }

      await course?.save();

      const notification = {
        title: "Đánh giá mới",
        message: `${req.user?.name} đã thêm đánh giá tại ${course?.name}`,
      };

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// thêm phản hồi đánh giá
interface IAddReviewReplyData {
  comment: string;
  courseId: string;
  reviewId: string;
}

export const addReplyToReview = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, reviewId, courseId }: IAddReviewReplyData = req.body;

      const course = await courseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Không tìm thấy khóa học!", 500));
      }

      const review = course?.reviews?.find(
        (rev: any) => rev._id.toString() === reviewId
      );

      if (!review) {
        return next(new ErrorHandler("Không tìm thấy đánh giá!", 500));
      }

      const replyData: any = {
        user: req.user,
        comment,
      };

      if (!review.replies) {
        review.replies = [];
      }

      review.replies?.push(replyData);

      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// lấy danh sách tất cả khóa học
export const getAllUsersCourses = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// xóa khóa học --- chỉ admin role
export const deleteCourse = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const course = await courseModel.findById(id);

      if (!course) {
        return next(new ErrorHandler("Không tìm thấy khóa học!", 400));
      }

      await course.deleteOne({ id });

      await redis.del(id);

      res.status(200).json({
        success: true,
        message: "Xóa khóa học thành công!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
