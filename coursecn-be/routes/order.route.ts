import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  createOrder,
  getAllOrders,
  newPayment,
  sendStripePublishableKey,
} from "../controllers/order.controller";

const orderRouter = express.Router();

// Route tạo order mới (yêu cầu đăng nhập)
orderRouter.post("/create-order", isAutheticated, createOrder);

// Route lấy tất cả order (chỉ dành cho admin)
orderRouter.get("/get-orders", isAutheticated, authorizeRoles("admin"), getAllOrders);

// Route lấy key của Stripe
orderRouter.get("/payment/stripepublishablekey", sendStripePublishableKey);

// Route xử lý thanh toán mới (yêu cầu đăng nhập)
orderRouter.post("/payment", isAutheticated, newPayment);

export default orderRouter;
