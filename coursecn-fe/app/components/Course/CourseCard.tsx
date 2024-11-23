import { formatPrice } from "@/app/utils/formatPrice";
import Ratings from "@/app/utils/Ratings";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";

type Props = {
  item: any;
  isProfile?: boolean;
};

const CourseCard: FC<Props> = ({ item, isProfile }) => {
  return (
    <Link href={!isProfile ? `/course/${item._id}` : `course-access/${item._id}`}>
      <div className="min-h-[35vh] w-full rounded-lg border border-[#00000015] p-3 shadow-sm backdrop-blur dark:border-[#ffffff1d] dark:bg-slate-500 dark:bg-opacity-20 dark:shadow-inner dark:shadow-[bg-slate-700]">
        <Image
          src={item.thumbnail.url}
          width={500}
          height={300}
          objectFit="contain"
          className="w-full rounded"
          alt=""
        />
        <br />
        <h1 className="text-[16px] text-black dark:text-[#fff]">{item.name}</h1>
        <div className="flex w-full items-center justify-between pt-2">
          <Ratings rating={item.ratings} />
          <h5 className={`text-black dark:text-[#fff] ${isProfile && "hidden 800px:inline"}`}>
            {item.purchased} người đăng ký
          </h5>
        </div>
        <div className="flex w-full items-center justify-between pt-3">
          <div className="flex">
            <h3 className="text-black dark:text-[#fff]">
              {item.price === 0 ? "Miễn phí" : formatPrice(item.price)}
            </h3>
            <h5 className="mt-[-5px] pl-3 text-[14px] text-black line-through opacity-80 dark:text-[#fff]">
              {item.estimatedPrice && formatPrice(item.estimatedPrice)}
            </h5>
          </div>
          <div className="flex items-center pb-3">
            <AiOutlineUnorderedList size={20} fill="#fff" />
            <h5 className="pl-2 text-black dark:text-[#fff]">{item.courseData?.length} bài học</h5>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
