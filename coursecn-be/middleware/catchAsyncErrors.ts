import { NextFunction, Request, Response } from "express";

// Middleware bắt lỗi khi xử lý các hàm bất đồng bộ
export const CatchAsyncError =
  (theFunc: any) => (req: Request, res: Response, next: NextFunction) => {
    // Nếu có lỗi xảy ra, chuyển đến middleware xử lý lỗi tiếp theo
    Promise.resolve(theFunc(req, res, next)).catch(next);
  };
