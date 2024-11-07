import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  addAnwser,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  generateVideoUrl,
  getAdminAllCourses,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";

const courseRouter = express.Router();

// Route tạo khóa học mới (chỉ dành cho admin)
courseRouter.post("/create-course", isAutheticated, authorizeRoles("admin"), uploadCourse);

// Route chỉnh sửa khóa học (chỉ dành cho admin)
courseRouter.put("/edit-course/:id", isAutheticated, authorizeRoles("admin"), editCourse);

// Route lấy thông tin một khóa học
courseRouter.get("/get-course/:id", getSingleCourse);

// Route lấy tất cả khóa học ở trang thường
courseRouter.get("/get-courses", getAllCourses);

// Route lấy tất cả khóa học ở trang admin
courseRouter.get("/get-admin-courses", isAutheticated, authorizeRoles("admin"), getAdminAllCourses);

// Route lấy nội dung khóa học cho người dùng đã đăng nhập
courseRouter.get("/get-course-content/:id", isAutheticated, getCourseByUser);

// Route thêm comment vào khóa học
courseRouter.put("/add-question", isAutheticated, addQuestion);

// Route thêm câu trả lời cho comment
courseRouter.put("/add-answer", isAutheticated, addAnwser);

// Route thêm review cho khóa học
courseRouter.put("/add-review/:id", isAutheticated, addReview);

// Route trả lời review (chỉ dành cho admin)
courseRouter.put("/add-reply", isAutheticated, authorizeRoles("admin"), addReplyToReview);

// Route lấy URL video từ VdoCipher
courseRouter.post("/getVdoCipherOTP", generateVideoUrl);

// Route xóa khóa học (chỉ dành cho admin)
courseRouter.delete("/delete-course/:id", isAutheticated, authorizeRoles("admin"), deleteCourse);

export default courseRouter;
