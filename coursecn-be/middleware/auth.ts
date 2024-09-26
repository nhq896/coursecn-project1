import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import { updateAccessToken } from "../controllers/user.controller";

// Xác thực người dùng
export const isAutheticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;

    if (!access_token) {
      return next(new ErrorHandler("Vui lòng đăng nhập để tiếp tục!", 400));
    }

    const decoded = jwt.decode(access_token) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("Token không hợp lệ, vui lòng thử lại!", 400));
    }

    // check xem access token có hết hạn không
    if (decoded.exp && decoded.exp <= Date.now() / 1000) {
      try {
        // Cập nhật token mới nếu hết hạn
        await updateAccessToken(req, res, next);
      } catch (error) {
        return next(error);
      }
    } else {
      // Lấy thông tin người dùng từ Redis
      const user = await redis.get(decoded.id);

      if (!user) {
        return next(new ErrorHandler("Vui lòng đăng nhập để tiếp tục!", 400));
      }

      // Lưu thông tin người dùng vào request
      req.user = JSON.parse(user);

      next();
    }
  }
);

// Kiểm tra role người dùng
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(new ErrorHandler(`Role: ${req.user?.role} không được phép truy cập!`, 403));
    }
    next();
  };
};
