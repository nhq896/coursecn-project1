import { House, LibraryBig, LucideIcon } from "lucide-react";
import { RouterUrl } from "@/app/enums/router.enum";

type NavItemType = {
  icon: LucideIcon;
  label: string;
  path: string;
};

export const navItems: NavItemType[] = [
  {
    icon: House,
    label: "Trang chủ",
    path: RouterUrl.Home,
  },
  {
    icon: LibraryBig,
    label: "Khóa học",
    path: RouterUrl.Courses,
  },
  // {
  //   label: "Về chúng tôi",
  //   path: "/about-us",
  // },
  // {
  //   label: "Chính sách",
  //   path: "/policy",
  // },
  // {
  //   label: "FAQs",
  //   path: "/faqs",
  // },
];
