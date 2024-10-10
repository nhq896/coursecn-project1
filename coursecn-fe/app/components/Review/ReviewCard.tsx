import Ratings from "@/app/utils/Ratings";
import Image from "next/image";

interface ReviewCardProps {
  item: any;
}

const ReviewCard: React.FC<ReviewCardProps> = (props) => {
  return (
    <div className="h-max w-full rounded-lg border border-[#00000028] p-3 pb-4 shadow-inner shadow-[bg-slate-700] backdrop-blur dark:border-[#ffffff1d] dark:bg-slate-500 dark:bg-opacity-[0.20]">
      <div className="flex w-full">
        <Image
          src={props.item.avatar}
          alt=""
          width={50}
          height={50}
          className="h-[50px] w-[50px] rounded-full object-cover"
        />
        <div className="hidden w-full justify-between 800px:flex">
          <div className="pl-4">
            <h5 className="text-[20px] text-black dark:text-white">{props.item.name}</h5>
            <h6 className="text-[16px] text-[#000] dark:text-[#ffffffab]">
              {props.item.profession}
            </h6>
          </div>
          <Ratings rating={5} />
        </div>
        {/* for mobile */}
        <div className="flex w-full flex-col justify-between 800px:hidden">
          <div className="pl-4">
            <h5 className="text-[20px] text-black dark:text-white">{props.item.name}</h5>
            <h6 className="text-[16px] text-[#000] dark:text-[#ffffffab]">
              {props.item.profession}
            </h6>
          </div>
          <Ratings rating={5} />
        </div>
      </div>
      <p className="px-2 pt-2 font-Poppins text-black dark:text-white">{props.item.comment}</p>
    </div>
  );
};

export default ReviewCard;
