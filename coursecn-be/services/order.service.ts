import { Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import OrderModel from "../models/order.Model";

// Tạo order mới
export const newOrder = CatchAsyncError(async (data: any, res: Response) => {
  const order = await OrderModel.create(data);

  res.status(201).json({
    succcess: true,
    order,
  });
});

// Lấy danh sách tất cả orders và sort theo thời gian tạo
export const getAllOrdersService = async (res: Response) => {
  const orders = await OrderModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    orders,
  });
};
