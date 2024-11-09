import { Response } from "express";
import { redis } from "../utils/redis";
import userModel from "../models/user.model";

// Lấy thông tin người dùng theo ID
export const getUserById = async (id: string, res: Response) => {
  // Lấy thông tin người dùng từ Redis
  const userJson = await redis.get(id);

  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};

// Lấy danh sách tất cả người dùng
export const getAllUsersService = async (res: Response) => {
  // Lấy tất cả users và sort theo thời gian tạo
  const users = await userModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    users,
  });
};

// Cập nhật role người dùng
export const updateUserRoleService = async (res: Response, id: string, role: string) => {
  const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });

  res.status(201).json({
    success: true,
    user,
  });
};
