import { styles } from "@/app/styles/style";
import { useEditLayoutMutation, useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";

type Props = {};

const EditHero: FC<Props> = (props: Props) => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const { data, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();

  useEffect(() => {
    if (data) {
      setTitle(data?.layout?.banner.title);
      setSubTitle(data?.layout?.banner.subTitle);
      setImage(data?.layout?.banner?.image?.url);
    }
    if (isSuccess) {
      toast.success("Cập nhật thành công!");
      refetch();
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
      }
    }
  }, [data, isSuccess, error]);

  const handleUpdate = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    await editLayout({
      type: "Banner",
      image,
      title,
      subTitle,
    });
  };

  return (
    <>
      <div className="w-full items-center 1000px:flex">
        <div className="hero_animation absolute top-[100px] h-[50vh] w-[50vh] rounded-[50%] 1000px:top-[unset] 1100px:left-[18rem] 1100px:h-[500px] 1100px:w-[500px] 1500px:left-[21rem] 1500px:h-[700px] 1500px:w-[700px]"></div>
        <div className="z-10 flex items-center justify-end pt-[70px] 1000px:min-h-screen 1000px:w-[40%] 1000px:pt-[0]">
          <div className="relative flex items-center justify-end">
            <img
              src={image}
              alt=""
              className="z-[10] h-[auto] w-[90%] object-contain 1100px:max-w-[90%] 1500px:max-w-[85%]"
            />
            <input
              type="file"
              name=""
              id="banner"
              accept="image/*"
              onChange={handleUpdate}
              className="hidden"
            />
            <label htmlFor="banner" className="absolute bottom-0 right-0 z-20">
              <AiOutlineCamera className="cursor-pointer text-[18px] text-black dark:text-white" />
            </label>
          </div>
        </div>
        <div className="mt-[150px] flex flex-col items-center text-center 1000px:mt-[0px] 1000px:w-[60%] 1000px:text-left">
          <textarea
            className="block w-full resize-none bg-transparent px-3 py-2 text-[30px] font-semibold text-[#000000c7] outline-none dark:text-white 1000px:text-[60px] 1000px:leading-[75px] 1100px:w-[78%] 1500px:w-[60%] 1500px:text-[70px]"
            placeholder="Cải thiện trải nghiệm học tập trực tuyến"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={4}
          />
          <br />
          <textarea
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
            placeholder="Cùng chúng tôi học tập tốt hơn ngay hôm nay!"
            className="resize-none bg-transparent text-[18px] font-semibold text-[#000000ac] outline-none dark:text-[#edfff4] 1100px:!w-[74%] 1500px:!w-[55%]"
          ></textarea>
          <br />
          <br />
          <br />
          <div
            className={`${
              styles.button
            } !h-[40px] !min-h-[40px] !w-[100px] bg-[#cccccc34] text-black dark:text-white ${
              data?.layout?.banner?.title !== title ||
              data?.layout?.banner?.subTitle !== subTitle ||
              data?.layout?.banner?.image?.url !== image
                ? "!cursor-pointer !bg-[#42d383]"
                : "!cursor-not-allowed"
            } absolute bottom-12 right-12 !rounded`}
            onClick={
              data?.layout?.banner?.title !== title ||
              data?.layout?.banner?.subTitle !== subTitle ||
              data?.layout?.banner?.image?.url !== image
                ? handleEdit
                : () => null
            }
          >
            Lưu
          </div>
        </div>
      </div>
    </>
  );
};

export default EditHero;
