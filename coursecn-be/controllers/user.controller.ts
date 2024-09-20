import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import { getAllUsersService, getUserById, updateUserRoleService } from "../services/user.service";
import cloudinary from "cloudinary";

// Đăng ký người dùng
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      // Kiểm tra email đã tồn tại chưa
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Tài khoản email này đã tồn tại!", 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      // Tạo mã kích hoạt
      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      // Tạo dữ liệu cho template email
      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), data);

      // Gửi email kích hoạt tới người dùng
      try {
        await sendMail({
          email: user.email,
          subject: "Hoàn tất đăng ký tài khoản",
          template: "activation-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Vui lòng kiểm tra email để kích hoạt tài khoản!`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Kích hoạt tài khoản
interface IActivationToken {
  token: string;
  activationCode: string;
}

// Tạo mã kích hoạt
export const createActivationToken = (user: any): IActivationToken => {
  // Tạo mã số ngẫu nhiên 4 chữ số
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  // Tạo token jwt chứa thông tin mã kích hoạt để có thể check mã kích hoạt
  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

// Xác thực mã kích hoạt và tạo tài khoản mới
export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } = req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Mã kích hoạt không hợp lệ!", 400));
      }

      const { name, email, password } = newUser.user;

      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("Tài khoản email này đã tồn tại!", 400));
      }
      const user = await userModel.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Đăng nhập người dùng
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log("loginuser");
      const { email, password } = req.body as ILoginRequest;

      // check request gửi lên có email và mật khẩu không
      if (!email || !password) {
        return next(new ErrorHandler("Vui lòng nhập email và mật khẩu!", 400));
      }

      // Tìm người dùng theo email và lấy ra cả mật khẩu
      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Tài khoản email hoặc mật khẩu không đúng!", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Tài khoản email hoặc mật khẩu không đúng!", 400));
      }

      // Tạo token và cookie đăng nhập ở client
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Đăng xuất người dùng
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Xóa cookie đăng nhập
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });

      // Xóa session trong Redis
      const userId = req.user?._id || "";

      redis.del(userId);

      res.status(200).json({
        success: true,
        message: "Đăng xuất thành công!",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Cập nhật access token
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Lấy refresh token từ cookie và xác nhận
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN as string) as JwtPayload;

      const message = "Không thể làm mới token!";
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }

      const session = await redis.get(decoded.id as string);

      if (!session) {
        return next(new ErrorHandler("Vui lòng đăng nhập để tiếp tục!", 400));
      }

      const user = JSON.parse(session);

      // Tạo access token mới
      const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN as string, {
        expiresIn: "1d",
      });

      const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN as string, {
        expiresIn: "3d",
      });

      req.user = user;

      // Cập nhật cookies
      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      await redis.set(user._id, JSON.stringify(user), "EX", 604800);

      return next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Lấy thông tin người dùng
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Đăng nhập bằng social
interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}

export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      const user = await userModel.findOne({ email });

      // Chưa có user trong db thì tạo mới
      if (!user) {
        const newUser = await userModel.create({ email, name, avatar });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Cập nhật thông tin người dùng
interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body as IUpdateUserInfo;

      const userId = req.user?._id;
      const user = await userModel.findById(userId);

      if (name && user) {
        user.name = name;
      }

      await user?.save();

      await redis.set(userId, JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Cập nhật mật khẩu người dùng
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Vui lòng nhập mật khẩu cũ và mật khẩu mới!", 400));
      }

      const user = await userModel.findById(req.user?._id).select("+password");

      if (user?.password === undefined) {
        return next(new ErrorHandler("Người dùng không tồn tại!", 400));
      }

      const isPasswordMatch = await user?.comparePassword(oldPassword);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Mật khẩu cũ không đúng!", 400));
      }

      user.password = newPassword;

      await user.save();

      await redis.set(req.user?._id, JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IUpdateProfilePicture {
  avatar: string;
}

// Cập nhật avatar người dùng
export const updateProfilePicture = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateProfilePicture;

      const userId = req.user?._id;

      const user = await userModel.findById(userId).select("+password");

      if (avatar && user) {
        // Nếu người dùng đã có avatar thì xóa avatar cũ
        if (user?.avatar?.public_id) {
          // Xóa ảnh cũ
          await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } else {
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }

      await user?.save();

      await redis.set(userId, JSON.stringify(user));

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Lấy danh sách tất cả người dùng --- chỉ dành cho admin
export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Cập nhật role người dùng --- chỉ dành cho admin
export const updateUserRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = req.body;
      const isUserExist = await userModel.findOne({ email });

      if (isUserExist) {
        const id = isUserExist._id;
        updateUserRoleService(res, id, role);
      } else {
        res.status(400).json({
          success: false,
          message: "Người dùng không tồn tại!",
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Xóa người dùng --- chỉ dành cho admin
export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const user = await userModel.findById(id);

      if (!user) {
        return next(new ErrorHandler("Người dùng không tồn tại!", 404));
      }

      await user.deleteOne({ id });

      await redis.del(id);

      res.status(200).json({
        success: true,
        message: "Xóa người dùng thành công!",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
