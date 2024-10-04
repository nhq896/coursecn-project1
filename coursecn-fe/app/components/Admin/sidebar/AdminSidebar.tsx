"use client";

import { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import {
  HomeOutlinedIcon,
  ArrowForwardIosIcon,
  ArrowBackIosIcon,
  PeopleOutlinedIcon,
  ReceiptOutlinedIcon,
  BarChartOutlinedIcon,
  MapOutlinedIcon,
  GroupsIcon,
  OndemandVideoIcon,
  VideoCallIcon,
  WebIcon,
  QuizIcon,
  WysiwygIcon,
  ManageHistoryIcon,
  SettingsIcon,
  ExitToAppIcon,
} from "./Icon";
import avatarDefault from "../../../../public/assests/avatar.png";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

interface itemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: any;
}

const Item: React.FC<itemProps> = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem
      active={selected === title}
      onClick={() => setSelected(title)}
      icon={icon}
      className="hover:!bg-[unset]"
    >
      <Link href={to} className="hover:!bg-[unset]">
        <Typography className="!text-base text-black dark:text-white">{title}</Typography>
      </Link>
    </MenuItem>
  );
};

const AdminSidebar = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [logout, setlogout] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const logoutHandler = () => {
    setlogout(true);
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${theme === "dark" ? "#111C43 !important" : "#fff !important"}`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          opacity: 1,
        },
        "& .pro-menu-item": {
          color: `${theme !== "dark" && "#000"}`,
        },
      }}
      className="!bg-white dark:bg-[#111C43]"
    >
      <Sidebar
        collapsed={isCollapsed}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 99999999999999,
          width: isCollapsed ? "0%" : "16%",
        }}
      >
        <Menu>
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={
              isCollapsed ? (
                <ArrowForwardIosIcon className="text-black dark:text-white" />
              ) : undefined
            }
            style={{
              margin: "10px 0 20px 0",
            }}
          >
            {!isCollapsed && (
              <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                <Link href="/" className="block flex-1">
                  <h3 className="text-2xl font-bold uppercase text-black dark:text-white">
                    coursecn
                  </h3>
                </Link>
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="flex items-center justify-center"
                >
                  <ArrowBackIosIcon className="text-black dark:text-[#ffffffc1]" />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <Image
                  alt="profile-user"
                  width={100}
                  height={100}
                  src={user.avatar ? user.avatar.url : avatarDefault}
                  style={{
                    cursor: "pointer",
                    borderRadius: "50%",
                    border: "3px solid #5b6fe6",
                  }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  className="!text-[20px] text-black dark:text-[#ffffffc1]"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user?.name}
                </Typography>
                {/* <Typography
                  variant="h6"
                  sx={{ m: "10px 0 0 0" }}
                  className="!text-[20px] capitalize text-black dark:text-[#ffffffc1]"
                >
                  - {user?.role}
                </Typography> */}
              </Box>
            </Box>
          )}

          <Box>
            <Item
              title="Trang quản lý"
              to="/admin"
              icon={<HomeOutlinedIcon className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 25px" }}
              className="!text-[18px] !font-[400] capitalize text-black dark:text-[#ffffffc1]"
            >
              {!isCollapsed && "Dữ liệu"}
            </Typography>
            <Item
              title="Người dùng"
              to="/admin/users"
              icon={<GroupsIcon className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Hóa đơn"
              to="/admin/invoices"
              icon={<ReceiptOutlinedIcon className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              className="!text-[18px] !font-[400] capitalize text-black dark:text-[#ffffffc1]"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Nội dung"}
            </Typography>
            <Item
              title="Tạo khóa học"
              to="/admin/create-course"
              icon={<VideoCallIcon className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Khóa học đã tạo"
              to="/admin/courses"
              icon={<OndemandVideoIcon className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              className="!text-[18px] !font-[400] capitalize text-black dark:text-[#ffffffc1]"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Tùy chỉnh"}
            </Typography>
            <Item
              title="Trang chủ"
              to="/admin/hero"
              icon={<WebIcon className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Câu hỏi thường gặp"
              to="/admin/faq"
              icon={<QuizIcon className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Danh mục"
              to="/admin/categories"
              icon={<WysiwygIcon className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              className="!text-[18px] !font-[400] capitalize text-black dark:text-[#ffffffc1]"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Quản lý"}
            </Typography>
            <Item
              title="Quản lý quyền"
              to="/admin/team"
              icon={<PeopleOutlinedIcon className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              className="!text-[18px] !font-[400] capitalize text-black dark:text-[#ffffffc1]"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Thống kê"}
            </Typography>
            <Item
              title="Thống kê khóa học"
              to="/admin/courses-analytics"
              icon={<BarChartOutlinedIcon className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Thống kê hóa đơn"
              to="/admin/orders-analytics"
              icon={<MapOutlinedIcon className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Thống kê người dùng"
              to="/admin/users-analytics"
              icon={<ManageHistoryIcon className="text-black dark:text-white" />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              className="!text-[18px] !font-[400] capitalize text-black dark:text-[#ffffffc1]"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Khác"}
            </Typography>
            <div onClick={logoutHandler}>
              <Item
                title="Đăng xuất"
                to="/"
                icon={<ExitToAppIcon className="text-black dark:text-white" />}
                selected={selected}
                setSelected={setSelected}
              />
            </div>
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default AdminSidebar;
