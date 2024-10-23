import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import CourseModel, { IComment } from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.Model";
import axios from "axios";

// Upload khóa học
export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      if (thumbnail) {
        // Upload ảnh thumbnail lên cloudinary
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler("Lỗi khi tạo khóa học!", 500));
    }
  }
);

// Chỉnh sửa khóa học
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      const courseId = req.params.id;
      const courseData = (await CourseModel.findById(courseId)) as any;

      // Xử lý thumbnail mới
      if (thumbnail && !thumbnail.startsWith("https")) {
        // Xóa ảnh cũ trên cloudinary và upload ảnh mới
        await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      // Giữ nguyên thumbnail cũ nếu không có thay đổi
      if (thumbnail.startsWith("https")) {
        data.thumbnail = {
          public_id: courseData?.thumbnail.public_id,
          url: courseData?.thumbnail.url,
        };
      }

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );

      res.status(201).json({
        success: true,
        message: "Cập nhật khóa học thành công!",
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler("Lỗi khi cập nhật khóa học!", 500));
    }
  }
);

// Lấy ra thông tin khóa học --- khi chưa tham gia khóa học
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      // Kiểm tra cache Redis
      const isCacheExist = await redis.get(courseId);

      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );

        await redis.set(courseId, JSON.stringify(course), "EX", 604800);

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Lấy ra danh sách tất cả khóa học --- khi chưa tham gia khóa học
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Lấy ra nội dung khóa học --- chỉ dành cho người dùng đã tham gia khóa học
export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const courseExists = userCourseList?.find(
        (course: any) => course._id.toString() === courseId
      );

      if (!courseExists) {
        return next(new ErrorHandler("Bạn không có quyền truy cập khóa học này!", 404));
      }

      const course = await CourseModel.findById(courseId);

      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Thêm comment vào khóa học
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;
      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("ID nội dung không hợp lệ!", 400));
      }

      const couseContent = course?.courseData?.find((item: any) => item._id.equals(contentId));

      if (!couseContent) {
        return next(new ErrorHandler("ID nội dung không hợp lệ!", 400));
      }

      // Tạo một comment mới
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      // Thêm comment mới vào nội dung khóa học
      couseContent.questions.push(newQuestion);

      await NotificationModel.create({
        user: req.user?._id,
        title: "Có bình luận mới!",
        message: `Bạn có một bình luận mới trong khóa học ${couseContent.title}`,
      });

      // Lưu khóa học đã cập nhật
      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler("Lỗi khi thêm comment!", 500));
    }
  }
);

// Thêm câu trả lời vào comment trong khóa học
interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnwser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData = req.body;

      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("ID nội dung không hợp lệ!", 400));
      }

      const couseContent = course?.courseData?.find((item: any) => item._id.equals(contentId));

      if (!couseContent) {
        return next(new ErrorHandler("ID nội dung không hợp lệ!", 400));
      }

      const question = couseContent?.questions?.find((item: any) => item._id.equals(questionId));

      if (!question) {
        return next(new ErrorHandler("ID comment không hợp lệ!", 400));
      }

      // Tạo một câu trả lời mới
      const newAnswer: any = {
        user: req.user,
        answer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Thêm câu trả lời mới vào nội dung khóa học
      question.questionReplies.push(newAnswer);

      await course?.save();

      if (req.user?._id === question.user._id) {
        // tạo thông báo
        await NotificationModel.create({
          user: req.user?._id,
          title: "Có câu trả lời mới!",
          message: `Bạn có một câu trả lời mới trong khóa học ${couseContent.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: couseContent.title,
        };

        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "Bạn có câu trả lời mới!",
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Thêm đánh giá vào khóa học
interface IAddReviewData {
  review: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;

      const courseId = req.params.id;

      // check xem courseId có tồn tại trong userCourseList hay không
      const courseExists = userCourseList?.some(
        (course: any) => course._id.toString() === courseId.toString()
      );

      if (!courseExists) {
        return next(new ErrorHandler("Bạn không có quyền truy cập khóa học này!", 404));
      }

      const course = await CourseModel.findById(courseId);

      const { review, rating } = req.body as IAddReviewData;

      const reviewData: any = {
        user: req.user,
        rating,
        comment: review,
      };

      course?.reviews.push(reviewData);

      // Tính rating trung bình
      let avg = 0;

      course?.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });

      if (course) {
        course.ratings = avg / course.reviews.length;
      }

      await course?.save();

      await redis.set(courseId, JSON.stringify(course), "EX", 604800);

      // tạo thông báo
      await NotificationModel.create({
        user: req.user?._id,
        title: "Có đánh giá mới!",
        message: `${req.user?.name} đã đánh giá khóa học ${course?.name}`,
      });

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Thêm trả lời vào đánh giá trong khóa học
interface IAddReviewData {
  comment: string;
  courseId: string;
  reviewId: string;
}
export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewData;

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Khóa học không tồn tại!", 404));
      }

      const review = course?.reviews?.find((rev: any) => rev._id.toString() === reviewId);

      if (!review) {
        return next(new ErrorHandler("Đánh giá không tồn tại!", 404));
      }

      const replyData: any = {
        user: req.user,
        comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!review.commentReplies) {
        review.commentReplies = [];
      }

      review.commentReplies?.push(replyData);

      await course?.save();

      await redis.set(courseId, JSON.stringify(course), "EX", 604800);

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Lấy ra danh sách tất cả khóa học ở trang admin
export const getAdminAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Xóa khóa học -- chỉ dành cho admin
export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const course = await CourseModel.findById(id);

      if (!course) {
        return next(new ErrorHandler("Khóa học không tồn tại!", 404));
      }

      await course.deleteOne({ id });

      await redis.del(id);

      res.status(200).json({
        success: true,
        message: "Xóa khóa học thành công!",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Tạo link video
export const generateVideoUrl = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.body;
      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        { ttl: 300 },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          },
        }
      );
      res.json(response.data);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
