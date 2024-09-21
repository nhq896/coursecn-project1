import mongoose, { Document, Model, Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Regex để xác thực định dạng email
const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // hashed password
  avatar?: {
    public_id: string;
    url: string;
  };
  role: string; // role của user, mặc định là "user"
  isVerified: boolean; // check email của người dùng đã được xác minh hay chưa
  courses?: Array<{ courseId: string }>; // các khóa học người dùng đã tham gia
  comparePassword: (password: string) => Promise<boolean>; // phương thức so sánh mật khẩu
  signAccessToken: () => string;
  signRefreshToken: () => string;
}

// Định nghĩa user
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập họ tên của bạn!"],
    },
    email: {
      type: String,
      required: [true, "Vui lòng nhập địa chỉ email của bạn!"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Vui lòng nhập một địa chỉ email hợp lệ!",
      },
      unique: true,
    },
    password: {
      type: String,
      // required: [true, "Vui lòng nhập mật khẩu!"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự!"],
      select: false, // Mặc định không trả về password khi query user
    },
    avatar: {
      public_id: { type: String },
      url: { type: String },
    },
    role: {
      type: String,
      default: "user", // set mặc định là "user"
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: { type: String },
      },
    ],
  },
  {
    timestamps: true, // thêm các trường createdAt, updatedAt vào model
  }
);

// hash mật khẩu trước khi lưu vào db
userSchema.pre<IUser>("save", async function (next) {
  // chỉ hash mật khẩu khi được chỉnh sửa hoặc tạo mới
  if (!this.isModified("password")) {
    return next();
  }

  // hash mật khẩu với bcryptjs
  this.password = await bcryptjs.hash(this.password, 10);

  next(); // thực hiện lưu user
});

// phương thức tạo access token khi người dùng đăng nhập
// token được gắn với user id và secret trong env file
userSchema.methods.signAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "1d",
  });
};

// phương thức tạo refresh token cho user
// để lấy access token mới mà không cần đăng nhập lại
userSchema.methods.signRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "3d",
  });
};

// phương thức để so sánh mật khẩu được người dùng nhập vào với mật khẩu trong db
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// tạo model User
const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
