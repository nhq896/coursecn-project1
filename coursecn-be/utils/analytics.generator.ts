import { Document, Model } from "mongoose";

interface MonthData {
  month: string;
  count: number;
}

// Hàm tạo dữ liệu thống kê cho 12 tháng gần nhất
export async function generateLast12MothsData<T extends Document>(
  model: Model<T>
): Promise<{ last12Months: MonthData[] }> {
  const last12Months: MonthData[] = []; // Mảng lưu kết quả thống kê
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

  for (let i = 11; i >= 0; i--) {
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - i * 28
    );
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 28);

    const monthYear = endDate.toLocaleString("default", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    // Đếm số lượng documents được tạo trong khoảng thời gian
    const count = await model.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    last12Months.push({ month: monthYear, count });
  }

  return { last12Months };
}
