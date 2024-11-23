import { Server as SocketIOServer } from "socket.io";
import http from "http";

export const initSocketServer = (server: http.Server) => {
  // Khởi tạo server Socket.IO với HTTP server
  const io = new SocketIOServer(server);

  // Xử lý sự kiện khi client kết nối đến server
  io.on("connection", (socket) => {
    // console.log("user connected");

    // Lắng nghe sự kiện 'notification' từ frontend
    socket.on("notification", (data) => {
      // Gửi thông báo đến tất cả các client đang kết nối (admin dashboard)
      io.emit("newNotification", data);
    });

    // Xử lý sự kiện khi client ngắt kết nối
    socket.on("disconnect", () => {
      // console.log("user disconnected");
    });
  });
};
