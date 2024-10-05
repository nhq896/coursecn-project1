"use client";

import { ThemeSwitcher } from "@/app/utils/ThemeSwitcher";
import {
  useGetAllNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "@/redux/features/notifications/notificationsApi";
import React, { FC, useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import socketIO from "socket.io-client";
import { format, register } from "timeago.js";
import vi from "timeago.js/lib/lang/vi";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

register("vi", vi);

type Props = {
  open?: boolean;
  setOpen?: any;
};

const DashboardHeader: FC<Props> = ({ open, setOpen }) => {
  const { data, refetch } = useGetAllNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateNotificationStatus, { isSuccess }] = useUpdateNotificationStatusMutation();
  const [notifications, setNotifications] = useState<any>([]);
  const [audio] = useState<any>(
    typeof window !== "undefined" &&
      new Audio(
        "https://res.cloudinary.com/damk25wo5/video/upload/v1693465789/notification_vcetjn.mp3"
      )
  );

  const playNotificationSound = () => {
    audio.play();
  };

  useEffect(() => {
    if (data) {
      setNotifications(data.notifications.filter((item: any) => item.status === "unread"));
    }
    if (isSuccess) {
      refetch();
    }
    audio.load();
  }, [data, isSuccess, audio]);

  useEffect(() => {
    socketId.on("newNotification", (data) => {
      refetch();
      playNotificationSound();
    });
  }, []);

  const handleNotificationStatusChange = async (id: string) => {
    await updateNotificationStatus(id);
  };

  return (
    <div className="fixed right-0 top-5 z-[9999999] flex w-full items-center justify-end p-6 pt-2">
      <ThemeSwitcher />
      <div className="relative m-2 cursor-pointer" onClick={() => setOpen(!open)}>
        <IoMdNotificationsOutline className="cursor-pointer text-2xl text-black dark:text-white" />
        <span className="absolute -right-2 -top-2 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#3ccba0] text-[12px] text-white">
          {notifications && notifications.length}
        </span>
      </div>
      {open && (
        <div className="absolute top-16 z-[1000000000] h-[60vh] w-[350px] overflow-y-scroll rounded border border-[#ffffff0c] bg-white px-2 py-3 shadow-xl dark:bg-[#111C43]">
          <h5 className="p-3 text-center text-[20px] text-black dark:text-white">Thông báo</h5>
          {notifications &&
            notifications.map((item: any, index: number) => (
              <div
                className="border-b border-b-[#0000000f] bg-[#00000013] dark:border-b-[#ffffff47] dark:bg-[#2d3a4e]"
                key={index}
              >
                <div className="flex w-full items-center justify-between p-2">
                  <p className="text-black dark:text-white">{item.title}</p>
                  <p
                    className="cursor-pointer text-black dark:text-white"
                    onClick={() => handleNotificationStatusChange(item._id)}
                  >
                    Đánh dấu đã đọc
                  </p>
                </div>
                <p className="px-2 text-black dark:text-white">{item.message}</p>
                <p className="p-2 text-[14px] text-black dark:text-white">
                  {format(item.createdAt, "vi")}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
