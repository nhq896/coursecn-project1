import express, { NextFunction, Request, Response } from "express";
import { ErrorMiddleware } from "./middleware/error";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";

export const app = express();

// Xử lý dữ liệu JSON với giới hạn 50mb
app.use(express.json({ limit: "50mb" }));

// Xử lý cookie
app.use(cookieParser());

// Cấu hình CORS
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN?.split(","),
    credentials: true,
  })
);

// Giới hạn số lượng request API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Tối đa 100 request trong 15 phút
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

// Cấu hình các routes
app.use(
  "/api/v1",
  userRouter,
  orderRouter,
  courseRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter
);

// test api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    succcess: true,
    message: "Hello World",
  });
});

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Không tìm thấy route ${req.originalUrl}`) as any;
  err.statusCode = 404;
  next(err);
});

// middleware
app.use(limiter);
app.use(ErrorMiddleware);
