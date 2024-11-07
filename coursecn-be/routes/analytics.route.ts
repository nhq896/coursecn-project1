import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  getCoursesAnalytics,
  getOrderAnalytics,
  getUsersAnalytics,
} from "../controllers/analytics.controller";

const analyticsRouter = express.Router();

// Route thống kê người dùng (chỉ dành cho admin)
analyticsRouter.get(
  "/get-users-analytics",
  isAutheticated,
  authorizeRoles("admin"),
  getUsersAnalytics
);

// Route thống kê order (chỉ dành cho admin)
analyticsRouter.get(
  "/get-orders-analytics",
  isAutheticated,
  authorizeRoles("admin"),
  getOrderAnalytics
);

// Route thống kê khóa học (chỉ dành cho admin)
analyticsRouter.get(
  "/get-courses-analytics",
  isAutheticated,
  authorizeRoles("admin"),
  getCoursesAnalytics
);

export default analyticsRouter;
