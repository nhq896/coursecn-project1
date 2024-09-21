import { NextFunction, Request, Response } from "express";

// bắt các lỗi khi xử lý các api route sử dụng hàm bất đồng bộ
export const catchAsyncErrors =
  (func: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };
