import { styles } from "@/app/styles/style";
import Image from "next/image";
import React from "react";
import ReviewCard from "../Review/ReviewCard";

type ReviewsProps = {};

const Reviews = (props: ReviewsProps) => {
  return (
    <div className="m-auto w-[90%] 800px:w-[85%]">
      <div className="w-full items-center 800px:flex">
        <div className="w-full 800px:w-[50%]">
          <Image
            src={require("../../../public/assests/business-img.png")}
            alt="business"
            width={700}
            height={700}
          />
        </div>
        <div className="w-full 800px:w-[50%]">
          <h3 className={`${styles.title} 800px:!text-[40px]`}>
            Nền Tảng <span className="text-gradient">Học Trực Tuyến</span> <br />
            Chất Lượng Cao
          </h3>
          <br />
          <p className={styles.label}>
            Chúng tôi cung cấp các khóa học chất lượng với nội dung được cập nhật liên tục. Với đội
            ngũ giảng viên nhiều kinh nghiệm, chúng tôi cam kết mang đến trải nghiệm học tập hiệu
            quả nhất cho học viên.
          </p>
        </div>
        <br />
        <br />
      </div>
    </div>
  );
};

export default Reviews;
