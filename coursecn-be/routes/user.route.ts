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

// Route lấy thông tin người dùng hiện tại (yêu cầu đăng nhập)
userRouter.get("/me", isAutheticated, getUserInfo);

// Route đăng nhập bằng social
userRouter.post("/social-auth", socialAuth);

// Route cập nhật thông tin người dùng (yêu cầu đăng nhập)
userRouter.put("/update-user-info", isAutheticated, updateUserInfo);

// Route cập nhật mật khẩu (yêu cầu đăng nhập)
userRouter.put("/update-user-password", isAutheticated, updatePassword);

// Route cập nhật avatar (yêu cầu đăng nhập)
userRouter.put("/update-user-avatar", isAutheticated, updateProfilePicture);

// Route lấy danh sách người dùng (chỉ dành cho admin)
userRouter.get("/get-users", isAutheticated, authorizeRoles("admin"), getAllUsers);

// Route cập nhật role người dùng (chỉ dành cho admin)
userRouter.put("/update-user", isAutheticated, authorizeRoles("admin"), updateUserRole);

// Route xóa người dùng (chỉ dành cho admin)
userRouter.delete("/delete-user/:id", isAutheticated, authorizeRoles("admin"), deleteUser);

export default userRouter;
