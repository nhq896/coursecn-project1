import { ListOrdered, LockKeyhole, LucideIcon, SquareUser } from "lucide-react";

type ProfileTab = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export const profileTabItems: ProfileTab[] = [
  {
    icon: SquareUser,
    label: "Tài khoản của tôi",
    value: "my-account",
  },
  {
    icon: LockKeyhole,
    label: "Đổi mật khẩu",
    value: "change-password",
  },
  {
    icon: ListOrdered,
    label: "Khóa học đã tham gia",
    value: "enrolled-courses",
  },
];
