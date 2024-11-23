"use client";

import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import Image from "next/image";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import Loader from "../Loader/Loader";
import { useRouter } from "next/navigation";

type HeroProps = {};

const Hero: React.FC<HeroProps> = (props) => {
  const { data, isLoading } = useGetHeroDataQuery("Banner", {});
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (search === "") {
      return;
    } else {
      router.push(`/courses?title=${search}`);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full items-center 1000px:flex">
          <div className="hero_animation absolute left-5 top-[100px] h-[40vh] w-[40vh] rounded-full 1000px:top-[unset] 1100px:left-8 1100px:h-[600px] 1100px:w-[600px] 1500px:left-14 1500px:h-[700px] 1500px:w-[700px]"></div>
          <div className="z-10 flex items-center justify-end pt-[70px] 1000px:min-h-[80vh] 1000px:w-[40%] 1000px:pt-0">
            <Image
              src={data?.layout?.banner?.image?.url}
              width={400}
              height={400}
              alt=""
              className="z-[10] h-[auto] w-[90%] object-contain 1100px:max-w-[90%] 1500px:max-w-[85%]"
            />
          </div>
          <div className="mt-[150px] flex flex-col items-center text-center 1000px:mt-0 1000px:w-[60%] 1000px:text-left">
            <h2 className="w-full px-3 py-2 text-3xl font-semibold text-[#000000c7] dark:text-white 1000px:text-[70px] 1000px:leading-[75px] 1100px:w-[78%] 1500px:w-[60%]">
              {data?.layout?.banner?.title}
            </h2>
            <br />
            <p className="text-lg font-semibold text-[#000000ac] dark:text-[#edfff4] 1100px:!w-[78%] 1500px:!w-[55%]">
              {data?.layout?.banner?.subTitle}
            </p>
            <br />
            <br />
            <div className="relative h-12 w-[90%] bg-transparent 1100px:w-[78%] 1500px:w-[55%]">
              <input
                type="search"
                placeholder="Tìm khóa học..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-full w-full appearance-none rounded border bg-transparent p-2 text-lg font-medium text-[#0000004e] outline-none dark:border-none dark:bg-[#575757] dark:text-[#ffffffe6] dark:placeholder:text-[#ffffffdd]"
              />
              <div
                className="absolute right-0 top-0 flex size-12 cursor-pointer items-center justify-center rounded-r bg-[#39c1f3]"
                onClick={handleSearch}
              >
                <BiSearch className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
