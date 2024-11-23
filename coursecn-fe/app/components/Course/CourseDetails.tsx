import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { format, register } from "timeago.js";
import vi from "timeago.js/lib/lang/vi";
import CourseContentList from "../Course/CourseContentList";
import { Elements } from "@stripe/react-stripe-js";
import CheckOutForm from "../Payment/CheckOutForm";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Image from "next/image";
import { VscVerifiedFilled } from "react-icons/vsc";
import { formatPrice } from "@/app/utils/formatPrice";

register("vi", vi);

type Props = {
  data: any;
  stripePromise: any;
  clientSecret: string;
  setRoute: any;
  setOpen: any;
};

const CourseDetails = ({
  data,
  stripePromise,
  clientSecret,
  setRoute,
  setOpen: openAuthModal,
}: Props) => {
  const { data: userData, refetch } = useLoadUserQuery(undefined, {});
  const [user, setUser] = useState<any>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setUser(userData?.user);
  }, [userData]);

  const dicountPercentenge = ((data?.estimatedPrice - data.price) / data?.estimatedPrice) * 100;

  const discountPercentengePrice = dicountPercentenge.toFixed(0);

  const isPurchased = user && user?.courses?.find((item: any) => item._id === data._id);

  const handleOrder = (e: any) => {
    if (user) {
      setOpen(true);
    } else {
      setRoute("Login");
      openAuthModal(true);
    }
  };

  return (
    <div>
      <div className="m-auto w-[90%] py-5 800px:w-[90%]">
        <div className="flex w-full flex-col-reverse 800px:flex-row">
          <div className="w-full 800px:w-[65%] 800px:pr-5">
            <h1 className="text-[25px] font-[600] text-black dark:text-white">{data.name}</h1>
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                <Ratings rating={data.ratings} />
                <h5 className="text-black dark:text-white">{data.reviews?.length} đánh giá</h5>
              </div>
              <h5 className="text-black dark:text-white">{data.purchased} người đăng ký</h5>
            </div>

            <br />
            <h1 className="text-[25px] font-[600] text-black dark:text-white">
              Bạn sẽ học được gì từ khóa học này?
            </h1>
            <div>
              {data.benefits?.map((item: any, index: number) => (
                <div className="flex w-full py-2 800px:items-center" key={index}>
                  <div className="mr-1 w-[15px]">
                    <IoCheckmarkDoneOutline size={20} className="text-black dark:text-white" />
                  </div>
                  <p className="pl-2 text-black dark:text-white">{item.title}</p>
                </div>
              ))}
              <br />
              <br />
            </div>
            <h1 className="text-[25px] font-[600] text-black dark:text-white">
              Điều kiện để bắt đầu khóa học này?
            </h1>
            {data.prerequisites?.map((item: any, index: number) => (
              <div className="flex w-full py-2 800px:items-center" key={index}>
                <div className="mr-1 w-[15px]">
                  <IoCheckmarkDoneOutline size={20} className="text-black dark:text-white" />
                </div>
                <p className="pl-2 text-black dark:text-white">{item.title}</p>
              </div>
            ))}
            <br />
            <br />
            <div>
              <h1 className="text-[25px] font-[600] text-black dark:text-white">
                Nội dung khóa học
              </h1>
              <CourseContentList data={data?.courseData} isDemo={true} />
            </div>
            <br />
            <br />
            {/* course description */}
            <div className="w-full">
              <h1 className="text-[25px] font-[600] text-black dark:text-white">Mô tả khóa học</h1>
              <p className="mt-[20px] w-full overflow-hidden whitespace-pre-line text-[18px] text-black dark:text-white">
                {data.description}
              </p>
            </div>
            <br />
            <br />
            <div className="w-full">
              <div className="items-center 800px:flex">
                <Ratings rating={data?.ratings} />
                <div className="mb-2 800px:mb-[unset]" />
                <h5 className="text-[25px] text-black dark:text-white">
                  {Number.isInteger(data?.ratings)
                    ? data?.ratings.toFixed(1)
                    : data?.ratings.toFixed(2)}{" "}
                  Đánh giá khóa học • {data?.reviews?.length} đánh giá
                </h5>
              </div>
              <br />
              {(data?.reviews && [...data.reviews].reverse()).map((item: any, index: number) => (
                <div className="w-full pb-4" key={index}>
                  <div className="flex">
                    <div className="h-[50px] w-[50px]">
                      <Image
                        src={
                          item.user?.avatar
                            ? item.user?.avatar?.url
                            : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                        }
                        width={50}
                        height={50}
                        alt=""
                        className="h-[50px] w-[50px] rounded-full object-cover"
                      />
                    </div>
                    <div className="hidden pl-2 800px:block">
                      <div className="flex items-center">
                        <h5 className="pr-2 text-[18px] text-black dark:text-white">
                          {item.user.name}
                        </h5>
                        <Ratings rating={item.rating} />
                      </div>
                      <p className="text-black dark:text-white">{item.comment}</p>
                      <small className="text-[#000000d1] dark:text-[#ffffff83]">
                        {format(item.createdAt, "vi")} •
                      </small>
                    </div>
                    <div className="flex items-center pl-2 800px:hidden">
                      <h5 className="pr-2 text-[18px] text-black dark:text-white">
                        {item.user.name}
                      </h5>
                      <Ratings rating={item.rating} />
                    </div>
                  </div>
                  {item.commentReplies.map((i: any, index: number) => (
                    <div className="my-5 flex w-full 800px:ml-16" key={index}>
                      <div className="h-[50px] w-[50px]">
                        <Image
                          src={
                            i.user.avatar
                              ? i.user.avatar.url
                              : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                          }
                          width={50}
                          height={50}
                          alt=""
                          className="h-[50px] w-[50px] rounded-full object-cover"
                        />
                      </div>
                      <div className="pl-2 text-black dark:text-white">
                        <div className="flex items-center">
                          <h5 className="text-[20px]">{i.user.name}</h5>{" "}
                          <VscVerifiedFilled className="ml-2 text-[20px] text-[#0095F6]" />
                        </div>
                        <p>{i.comment}</p>
                        <small className="text-[#ffffff83]">{format(i.createdAt, "vi")} •</small>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-full 800px:w-[35%]">
            <div className="sticky left-0 top-[100px] z-50 w-full">
              <CoursePlayer videoUrl={data?.demoUrl} title={data?.title} />
              <div className="flex items-center">
                <h1 className="pt-5 text-[25px] text-black dark:text-white">
                  {data.price === 0 ? "Miễn phí" : formatPrice(data?.price)}
                </h1>
                <h5 className="mt-2 pl-3 text-[20px] text-black line-through opacity-80 dark:text-white">
                  {data.estimatedPrice && formatPrice(data.estimatedPrice)}
                </h5>

                <h4 className="pl-5 pt-4 text-[22px] text-black dark:text-white">
                  Giảm {discountPercentengePrice}%
                </h4>
              </div>
              <div className="flex items-center">
                {isPurchased ? (
                  <Link
                    className={`${styles.button} my-3 !w-[180px] cursor-pointer !bg-[crimson]`}
                    href={`/course-access/${data._id}`}
                  >
                    Vào khóa học
                  </Link>
                ) : (
                  <div
                    className={`${styles.button} my-3 !w-[180px] cursor-pointer !bg-[crimson]`}
                    onClick={handleOrder}
                  >
                    Mua ngay
                  </div>
                )}
              </div>
              <br />
              {/* <p className="pb-1 text-black dark:text-white">• Mã nguồn đi kèm</p> */}
              <p className="pb-1 text-black dark:text-white">• Truy cập suốt đời</p>
              {/* <p className="pb-1 text-black dark:text-white">• Chứng chỉ hoàn thành</p> */}
              <p className="pb-3 text-black dark:text-white 800px:pb-1">• Hỗ trợ tận tình</p>
            </div>
          </div>
        </div>
      </div>
      <>
        {open && (
          <div className="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-[#00000036]">
            <div className="min-h-[500px] w-[500px] rounded-xl bg-white p-3 shadow">
              <div className="flex w-full justify-end">
                <IoCloseOutline
                  size={40}
                  className="cursor-pointer text-black"
                  onClick={() => setOpen(false)}
                />
              </div>
              <div className="w-full">
                {stripePromise && clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckOutForm setOpen={setOpen} data={data} user={user} refetch={refetch} />
                  </Elements>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default CourseDetails;
