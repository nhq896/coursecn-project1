import mongoose from "mongoose";

const dbUrl: string = process.env.DATABASE_URL || "";

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl).then((data: any) => {
      console.log(`Kết nối db thành công!!`);
    });
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDB, 5000); // Kết nối lại sau 5s nếu lỗi
  }
};

export default connectDB;
