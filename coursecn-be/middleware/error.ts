import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Lỗi hệ thống!";

  // Xử lý lỗi ID MongoDB không hợp lệ
  if (err.name === "CastError") {
    const message = `Không tìm thấy tài nguyên. ID không hợp lệ: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Xử lý lỗi trùng lặp dữ liệu
  if (err.code === 11000) {
    const message = `${Object.keys(err.keyValue)} này đã tồn tại!`;
    err = new ErrorHandler(message, 400);
  }

  // Xử lý lỗi token JWT không hợp lệ
  if (err.name === "JsonWebTokenError") {
    const message = `Token không hợp lệ, vui lòng thử lại!`;
    err = new ErrorHandler(message, 400);
  }

  // Xử lý lỗi token JWT hết hạn
  if (err.name === "TokenExpiredError") {
    const message = `Token đã hết hạn, vui lòng thử lại!`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
