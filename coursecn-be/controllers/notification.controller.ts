import NotificationModel from "../models/notification.Model";
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cron from "node-cron";

// Lấy tất cả thông báo --- chỉ dành cho admin
export const getNotifications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler("Lỗi khi lấy thông báo!", 500));
    }
  }
);

// Cập nhật trạng thái thông báo --- chỉ dành cho admin
export const updateNotification = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await NotificationModel.findById(req.params.id);
      if (!notification) {
        return next(new ErrorHandler("Thông báo không tồn tại!", 404));
      } else {
        notification.status ? (notification.status = "read") : notification?.status;
      }

      await notification.save();

      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler("Lỗi khi cập nhật trạng thái thông báo!", 500));
    }
  }
);

// Lập lịch xóa thông báo đã đọc trong khoảng thời gian 30 ngày --- chỉ dành cho admin
cron.schedule("0 0 0 * * *", async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await NotificationModel.deleteMany({ status: "read", createdAt: { $lt: thirtyDaysAgo } });
});
