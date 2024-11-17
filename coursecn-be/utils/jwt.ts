import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

// parse biến môi trường thành số nguyên
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "1", 10);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "3", 10);

// Cấu hình cho access token
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

// Cấu hình cho refresh token
export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

// Hàm gửi token cho người dùng
export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  // Tạo access token và refresh token
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // Lưu thông tin session vào Redis
  redis.set(user._id, JSON.stringify(user) as any);

  // Lưu vào cookie
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
