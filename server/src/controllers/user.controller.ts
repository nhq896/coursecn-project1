import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import userModel, { IUser } from "../models/user.models";
import ErrorHandler from "../utils/ErrorHandler";
import ejs from "ejs";
import path from "path";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { redis } from "../utils/redis";
import cloudinary from "cloudinary";
import {
  getUserById,
  getAllUsersService,
  updateUserRoleService,
} from "../services/user.service";
import sendMail from "../utils/sendMail";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";

// đăng ký
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registerUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      // check email đã tồn tại chưa
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Tài khoản email đã tồn tại!", 400));
      }

      // tạo user
      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      // tạo mã xác thực cho user
      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      // data để gửi mail xác thực
      const data = { user: { name: user.name }, activationCode };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-email.ejs"),
        data
      );

      // gửi mail xác thực
      try {
        await sendMail({
          email: user.email,
          subject: "Hoàn tất đăng ký tài khoản coursecn",
          template: "activation-email.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Vui lòng kiểm tra email của bạn để hoàn tất đăng ký tài khoản!`,
          activationToken: activationToken.token,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// tạo mã xác thực
interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (
  user: IRegistrationBody
): IActivationToken => {
  // tạo mã 4 chữ số ngẫu nhiên
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  // gắn JWT token chứa user data và mã xác thực
  // hết hạn trong 5 phút
  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "5m" }
  );

  return {
    token,
    activationCode,
  };
};

// xác thực người dùng
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      // check mã xác thực hợp lệ
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Mã xác thực không hợp lệ!", 400));
      }

      const { name, email, password } = newUser.user;

      // check xem người dùng đã tồn tại trong db chưa
      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler("Tài khoản email đã tồn tại!", 400));
      }

      // tạo mới user
      const user = await userModel.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// đăng nhập
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler("Vui lòng nhập email và mật khẩu!", 400));
      }

      // tìm user
      // +password là chọn thêm trường password vào vì đã set mặc định là không select passowrd khi query
      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Email hoặc mật khẩu không hợp lệ!", 400));
      }

      // so sánh mật khẩu
      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Email hoặc mật khẩu không hợp lệ!", 400));
      }

      sendToken(user, 200, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// đăng xuất, xóa cookies
export const logoutUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // xóa access token
      res.cookie("access_token", "", { maxAge: 1 });

      // xóa refresh token
      res.cookie("refresh_token", "", { maxAge: 1 });

      // xóa session trong redis
      const userId = (req.user?._id as string) || "";

      redis.del(userId);

      res.status(200).json({
        success: true,
        message: "Đăng xuất thành công!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// cập nhật access token
export const updateAccessToken = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // lấy ra refresh_token trong req
      const refresh_token = req.cookies.refresh_token as string;

      // validate refresh_token
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      // báo lỗi khi không thể refresh token
      const message = "Không thể làm mới token!";

      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }

      // lấy session trong redis theo user id
      const session = await redis.get(decoded.id as string);

      if (!session) {
        return next(new ErrorHandler("Vui lòng đăng nhập để tiếp tục!", 400));
      }

      // parse user info được lấy ra từ redis
      const user = JSON.parse(session);

      // tạo mới access token cho user
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        { expiresIn: "1d" } // hết hạn sau 1 ngày
      );

      // tạo mới refresh token cho user
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        { expiresIn: "3d" } // hết hạn sau 3 ngày
      );

      req.user = user;

      res.cookie("accessToken", accessToken, accessTokenOptions);
      res.cookie("refreshToken", refreshToken, refreshTokenOptions);

      await redis.set(user._id, JSON.stringify(user), "EX", 604800);

      res.status(200).json({
        status: "success",
        accessToken,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// lấy thông tin người dùng
export const getUserInfo = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      getUserById(userId as string, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// social auth
interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}

export const socialAuth = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;

      // check xem người dùng với email này đã tồn tại chưa
      const user = await userModel.findOne({ email });

      // tạo mới user nếu chưa tồn tại
      if (!user) {
        const newUser = await userModel.create({ email, name, avatar });
        // gửi token về cho user
        sendToken(newUser, 200, res);
      } else {
        // nếu user đã tồn tại thì chỉ gửi token về cho user
        sendToken(user, 200, res);
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// cập nhật thông tin người dùng
interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name } = req.body as IUpdateUserInfo;

      // lấy user id từ session
      const userId = req.user?._id as string;

      // tìm user với id trên
      const user = await userModel.findById(userId);

      if (email && user) {
        // check email đã tồn tại trong db chưa
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {
          return next(new ErrorHandler("Tài khoản email đã tồn tại!", 400));
        }
        // cập nhật email khi đã check nó là unique
        user.email = email;
      }

      // cập nhật họ tên
      if (name && user) {
        user.name = name;
      }

      // lưu thay đổi vào db
      await user?.save();

      // cập nhật thông tin session trong redis
      await redis.set(userId, JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// cập nhật mật khẩu
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Vui lòng nhập mật khẩu cũ!", 400));
      }

      const user = await userModel.findById(req.user?._id).select("+password");

      if (user?.password === undefined) {
        return next(new ErrorHandler("Người dùng không hợp lệ!", 400));
      }

      const isPasswordMatch = await user?.comparePassword(oldPassword);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Mật khẩu cũ không đúng!", 400));
      }

      user.password = newPassword;

      await user.save();

      await redis.set(req.user?._id as string, JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// cập nhật avatar
interface IUpdateAvatar {
  avatar: string;
}

export const updateAvatar = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateAvatar;

      const userId = req.user?._id;

      const user = await userModel.findById(userId);

      if (avatar && user) {
        // nếu đã có avatar cũ thì xóa nó khỏi Cloudinary
        if (user.avatar?.public_id) {
          await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        }

        // tải avatar lên Cloudinary
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars",
          width: 150,
        });

        // cập nhật thông tin avatar
        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };

        await user?.save();

        await redis.set(userId as string, JSON.stringify(user));

        res.status(200).json({
          success: true,
          user,
        });
      } else {
        return next(new ErrorHandler("Thông tin gửi về không hợp lệ!", 400));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// lấy tất cả danh sách user --- chỉ admin role
export const getAllUsers = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// cập nhật role người dùng --- chỉ admin role
export const updateUserRole = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, role } = req.body;

      updateUserRoleService(res, id, role);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// xóa user ---- chỉ admin role
export const deleteUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const user = await userModel.findById(id);

      if (!user) {
        return next(new ErrorHandler("Không tìm thấy người dùng!", 400));
      }

      await user.deleteOne({ id });

      await redis.del(id);

      res.status(200).json({
        success: true,
        message: "Xóa người dùng thành công!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
