import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  activateUser,
  deleteUser,
  getAllUsers,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updatePassword,
  updateProfilePicture,
  updateUserInfo,
  updateUserRole,
} from "../controllers/user.controller";

const userRouter = express.Router();

// Route đăng ký tài khoản mới
userRouter.post("/registration", registrationUser);

// Route kích hoạt tài khoản
userRouter.post("/activate-user", activateUser);

// Route đăng nhập
userRouter.post("/login", loginUser);

// Route đăng xuất (yêu cầu đăng nhập)
userRouter.get("/logout", isAutheticated, logoutUser);


export default userRouter;