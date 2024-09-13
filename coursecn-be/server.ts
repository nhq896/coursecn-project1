import http from "http";
import { app } from "./app";
import connectDB from "./utils/db";
import { v2 as cloudinary } from "cloudinary";
import { initSocketServer } from "./socketServer";

// Cấu hình cloudinary để xử lý upload ảnh
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// Khởi tạo socket io để xử lý realtime
const server = http.createServer(app);
initSocketServer(server);

// Tạo server và kết nối database
const port = process.env.SERVER_PORT || 8000;

server.listen(port, () => {
  console.log(`Server đang chạy trên cổng ${port}!!`);
  connectDB();
});
