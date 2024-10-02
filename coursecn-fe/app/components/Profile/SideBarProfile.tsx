import Image from "next/image";
import avatarDefault from "../../../public/assests/avatar.png";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Link from "next/link";

interface SideBarProfileProps {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logOutHandler: any;
}

const SideBarProfile: React.FC<SideBarProfileProps> = ({
  user,
  active,
  avatar,
  setActive,
  logOutHandler,
}) => {
  return (
    <div className="w-full">
      <div
        className={`flex w-full cursor-pointer items-center px-3 py-4 ${
          active === 1 ? "bg-white dark:bg-slate-800" : "bg-transparent"
        }`}
        onClick={() => setActive(1)}
      >
        <Image
          src={user.avatar || avatar ? user.avatar.url || avatar : avatarDefault}
          alt=""
          width={20}
          height={20}
          className="size-5 cursor-pointer rounded-full 800px:size-8"
        />
        <h5 className="hidden pl-2 text-black dark:text-white 800px:block">Tài khoản của tôi</h5>
      </div>
      <div
        className={`flex w-full cursor-pointer items-center px-3 py-4 ${
          active === 2 ? "bg-white dark:bg-slate-800" : "bg-transparent"
        }`}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine size={20} className="text-black dark:text-white" />
        <h5 className="hidden pl-2 text-black dark:text-white 800px:block">Đổi mật khẩu</h5>
      </div>
      <div
        className={`flex w-full cursor-pointer items-center px-3 py-4 ${
          active === 3 ? "bg-white dark:bg-slate-800" : "bg-transparent"
        }`}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={20} className="text-black dark:text-white" />
        <h5 className="hidden pl-2 text-black dark:text-white 800px:block">Khóa học đã đăng ký</h5>
      </div>
      {user.role === "admin" && (
        <Link
          className={`flex w-full cursor-pointer items-center px-3 py-4 ${
            active === 6 ? "bg-white dark:bg-slate-800" : "bg-transparent"
          }`}
          href={"/admin"}
        >
          <MdOutlineAdminPanelSettings size={20} className="text-black dark:text-white" />
          <h5 className="hidden pl-2 text-black dark:text-white 800px:block">Trang quản lý</h5>
        </Link>
      )}
      <div
        className={`flex w-full cursor-pointer items-center px-3 py-4 ${
          active === 4 ? "bg-white dark:bg-slate-800" : "bg-transparent"
        }`}
        onClick={() => logOutHandler()}
      >
        <AiOutlineLogout size={20} className="text-black dark:text-white" />
        <h5 className="hidden pl-2 text-black dark:text-white 800px:block">Đăng xuất</h5>
      </div>
    </div>
  );
};

export default SideBarProfile;
