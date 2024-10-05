import React, { FC, useEffect, useState } from "react";
import UserAnalytics from "../Analytics/UserAnalytics";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";
import OrdersAnalytics from "../Analytics/OrdersAnalytics";
import AllInvoices from "../Order/AllInvoices";
import {
  useGetOrdersAnalyticsQuery,
  useGetUsersAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";

type Props = {
  open?: boolean;
  value?: number;
};

const CircularProgressWithLabel: FC<Props> = ({ open, value }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={45}
        color={value && value > 99 ? "info" : "error"}
        thickness={4}
        style={{ zIndex: open ? -1 : 1 }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Box>
    </Box>
  );
};

const DashboardWidgets: FC<Props> = ({ open }) => {
  const [ordersComparePercentage, setOrdersComparePercentage] = useState<any>();
  const [userComparePercentage, setuserComparePercentage] = useState<any>();

  const { data, isLoading } = useGetUsersAnalyticsQuery({});
  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersAnalyticsQuery({});

  useEffect(() => {
    if (isLoading && ordersLoading) {
      return;
    } else {
      if (data && ordersData) {
        const usersLastTwoMonths = data.users.last12Months.slice(-2);
        const ordersLastTwoMonths = ordersData.orders.last12Months.slice(-2);

        if (usersLastTwoMonths.length === 2 && ordersLastTwoMonths.length === 2) {
          const usersCurrentMonth = usersLastTwoMonths[1].count;
          const usersPreviousMonth = usersLastTwoMonths[0].count;
          const ordersCurrentMonth = ordersLastTwoMonths[1].count;
          const ordersPreviousMonth = ordersLastTwoMonths[0].count;

          const usersPercentChange =
            usersPreviousMonth !== 0
              ? ((usersCurrentMonth - usersPreviousMonth) / usersPreviousMonth) * 100
              : 100;

          const ordersPercentChange =
            ordersPreviousMonth !== 0
              ? ((ordersCurrentMonth - ordersPreviousMonth) / ordersPreviousMonth) * 100
              : 100;

          setuserComparePercentage({
            currentMonth: usersCurrentMonth,
            previousMonth: usersPreviousMonth,
            percentChange: usersPercentChange,
          });

          setOrdersComparePercentage({
            currentMonth: ordersCurrentMonth,
            previousMonth: ordersPreviousMonth,
            percentChange: ordersPercentChange,
          });
        }
      }
    }
  }, [isLoading, ordersLoading, data, ordersData]);

  return (
    <div className="mt-8 min-h-screen">
      <div className="grid grid-cols-[75%,25%]">
        <div className="p-8">
          <UserAnalytics isDashboard={true} />
        </div>

        <div className="pr-8 pt-[80px]">
          <div className="w-full rounded-sm shadow dark:bg-[#111C43]">
            <div className="flex items-center justify-between p-5">
              <div className="">
                <BiBorderLeft className="text-[30px] text-[#000] dark:text-[#45CBA0]" />
                <h5 className="pt-2 text-[20px] text-black dark:text-[#fff]">
                  {ordersComparePercentage?.currentMonth}
                </h5>
                <h5 className="py-2 text-[20px] font-[400] text-black dark:text-[#45CBA0]">
                  Đã bán được
                </h5>
              </div>
              <div>
                <CircularProgressWithLabel
                  value={ordersComparePercentage?.percentChange > 0 ? 100 : 0}
                  open={open}
                />
                {/* <h5 className="pt-4 text-center">
                  {ordersComparePercentage?.percentChange > 0
                    ? "+" + ordersComparePercentage?.percentChange.toFixed(2)
                    : "-" + ordersComparePercentage?.percentChange.toFixed(2)}{" "}
                  %
                </h5> */}
              </div>
            </div>
          </div>

          <div className="my-8 w-full rounded-sm shadow dark:bg-[#111C43]">
            <div className="flex items-center justify-between p-5">
              <div className="">
                <PiUsersFourLight className="text-[30px] text-[#000] dark:text-[#45CBA0]" />
                <h5 className="pt-2 text-[20px] text-black dark:text-[#fff]">
                  {userComparePercentage?.currentMonth}
                </h5>
                <h5 className="py-2 text-[20px] font-[400] text-black dark:text-[#45CBA0]">
                  Người dùng mới
                </h5>
              </div>
              <div>
                <CircularProgressWithLabel
                  value={userComparePercentage?.percentChange > 0 ? 100 : 0}
                  open={open}
                />
                {/* <h5 className="pt-4 text-center">
                  {userComparePercentage?.percentChange > 0
                    ? "+" + userComparePercentage?.percentChange.toFixed(2)
                    : "-" + userComparePercentage?.percentChange.toFixed(2)}{" "}
                  %
                </h5> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[-20px] grid grid-cols-[65%,35%]">
        <div className="m-auto mt-[30px] h-[40vh] w-[94%] shadow-sm dark:bg-[#111c43]">
          <OrdersAnalytics isDashboard={true} />
        </div>
        <div className="p-5">
          <h5 className="pb-3 text-[20px] font-[400] text-black dark:text-[#fff]">
            Giao dịch gần đây
          </h5>
          <AllInvoices isDashboard={true} />
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
