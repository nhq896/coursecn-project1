import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { getNotifications, updateNotification } from "../controllers/notification.controller";

const notificationRoute = express.Router();

// Route lấy tất cả thông báo (chỉ dành cho admin)
notificationRoute.get(
  "/get-all-notifications",
  isAutheticated,
  authorizeRoles("admin"),
  getNotifications
);

// Route cập nhật thông báo theo id (chỉ dành cho admin)
notificationRoute.put(
  "/update-notification/:id",
  isAutheticated,
  authorizeRoles("admin"),
  updateNotification
);

export default notificationRoute;
