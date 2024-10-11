import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import React from "react";
import bannerImg from "@/public/assets/banner-img.png";

const Hero = () => {
  return (
    <div className="relative z-20 m-auto h-[90vh] w-[95%] flex-col md:flex md:w-[90%] 2xl:w-[85%]">
      <div className="w-full flex-row items-center justify-around pt-10 md:flex">
        <div className="relative flex aspect-square w-full max-w-2xl justify-center md:w-1/2">
          <div className="hero_animation absolute size-[95%] rounded-full"></div>
          <Image
            src={bannerImg}
            alt=""
            priority
            className="z-10 h-auto w-[90%] object-contain xl:max-w-[90%] 2xl:max-w-[85%]"
          />
        </div>
        <div className="flex w-full flex-col items-center md:w-[50%] md:items-start md:justify-center">
          <h2 className="py-2 text-center text-2xl font-medium md:text-left md:text-3xl md:leading-10 lg:text-5xl lg:leading-[60px]">
            Cải thiện trải nghiệm học tập trực tuyến của bạn!
          </h2>
          <div className="flex w-full flex-col items-center md:block md:w-[95%]">
            <p className="mb-5 block text-center text-base font-normal leading-6 md:text-left md:text-xl md:leading-8">
              Bắt đầu hành trình của bạn với chúng tôi, nơi việc học luôn được
              trân trọng.
            </p>
            <div className="flex w-full">
              <Input className="rounded-r-none" placeholder="Tìm khóa học" />
              <Button size="icon" className="rounded-l-none">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
