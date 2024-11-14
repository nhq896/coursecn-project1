import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";

// Tạo layout mới
// export const createLayout = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { type } = req.body;

//       const isTypeExist = await LayoutModel.findOne({ type });
//       if (isTypeExist) {
//         return next(new ErrorHandler(`${type} đã tồn tại!`, 400));
//       }

//       // Xử lý tạo Banner
//       if (type === "Banner") {
//         const { image, title, subTitle } = req.body;
//         const myCloud = await cloudinary.v2.uploader.upload(image, {
//           folder: "layout",
//         });
//         const banner = {
//           type: "Banner",
//           banner: {
//             image: {
//               public_id: myCloud.public_id,
//               url: myCloud.secure_url,
//             },
//             title,
//             subTitle,
//           },
//         };
//         await LayoutModel.create(banner);
//       }

//       // Xử lý tạo FAQ
//       if (type === "FAQ") {
//         const { faq } = req.body;
//         const faqItems = await Promise.all(
//           faq.map(async (item: any) => {
//             return {
//               question: item.question,
//               answer: item.answer,
//             };
//           })
//         );
//         await LayoutModel.create({ type: "FAQ", faq: faqItems });
//       }

//       // Xử lý tạo Categories
//       if (type === "Categories") {
//         const { categories } = req.body;
//         const categoriesItems = await Promise.all(
//           categories.map(async (item: any) => {
//             return {
//               title: item.title,
//             };
//           })
//         );
//         await LayoutModel.create({
//           type: "Categories",
//           categories: categoriesItems,
//         });
//       }

//       res.status(200).json({
//         success: true,
//         message: "Tạo layout thành công!",
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );

// Chỉnh sửa layout
export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      // Xử lý chỉnh sửa Banner
      if (type === "Banner") {
        const bannerData: any = await LayoutModel.findOne({ type: "Banner" });

        const { image, title, subTitle } = req.body;

        const data = image.startsWith("https")
          ? bannerData
          : await cloudinary.v2.uploader.upload(image, {
              folder: "layout",
            });

        const banner = {
          type: "Banner",
          image: {
            public_id: image.startsWith("https")
              ? bannerData.banner.image.public_id
              : data?.public_id,
            url: image.startsWith("https") ? bannerData.banner.image.url : data?.secure_url,
          },
          title,
          subTitle,
        };

        await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
      }

      // Xử lý chỉnh sửa FAQ
      if (type === "FAQ") {
        const { faq } = req.body;
        const FaqItem = await LayoutModel.findOne({ type: "FAQ" });
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
        await LayoutModel.findByIdAndUpdate(FaqItem?._id, {
          type: "FAQ",
          faq: faqItems,
        });
      }

      // Xử lý chỉnh sửa Categories
      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesData = await LayoutModel.findOne({
          type: "Categories",
        });
        const categoriesItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          })
        );
        await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
          type: "Categories",
          categories: categoriesItems,
        });
      }

      res.status(200).json({
        success: true,
        message: "Cập nhật layout thành công!",
      });
    } catch (error: any) {
      return next(new ErrorHandler("Lỗi khi cập nhật layout!", 500));
    }
  }
);

// Lấy layout theo loại
export const getLayoutByType = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      const layout = await LayoutModel.findOne({ type });

      res.status(201).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
