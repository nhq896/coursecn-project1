import { Request, Response, NextFunction } from "express";
import { catchAsyncErrors } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

// middleware check xác thực user
export const isAuthenticated = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;

    // nếu không có access token thì báo lỗi
    if (!access_token) {
      return next(new ErrorHandler("Vui lòng đăng nhập để tiếp tục!", 400));
    }

    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("Access token không hợp lệ!", 400));
    }

    // tìm session trong redis
    const user = await redis.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler("Vui lòng đăng nhập để tiếp tục!", 400));
    }

    // gắn user info vào req
    req.user = JSON.parse(user);

    next();
  }
);

// validate user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(new ErrorHandler(`Bạn không có quyền truy cập!`, 400));
    }

    next();
  };
};
