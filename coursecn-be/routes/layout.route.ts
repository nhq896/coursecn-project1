import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { createLayout, editLayout, getLayoutByType } from "../controllers/layout.controller";

const layoutRouter = express.Router();

// Route tạo layout mới (chỉ dành cho admin)
layoutRouter.post("/create-layout", isAutheticated, authorizeRoles("admin"), createLayout);

// Route chỉnh sửa layout (chỉ dành cho admin)
layoutRouter.put("/edit-layout", isAutheticated, authorizeRoles("admin"), editLayout);

// Route lấy layout theo loại (Banner, FAQ, ...)
layoutRouter.get("/get-layout/:type", getLayoutByType);

export default layoutRouter;
