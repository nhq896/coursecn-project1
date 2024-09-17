"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModal from "../utils/CustomModal";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "../components/Auth/Verification";
import Image from "next/image";
import avatar from "../../public/assests/avatar.png";
import { useSession } from "next-auth/react";
import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./Loader/Loader";

type HeaderProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: React.FC<HeaderProps> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { data: userData, isLoading, refetch } = useLoadUserQuery(undefined, {});
  const { data } = useSession();
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();
  const [logout, setLogout] = useState(false);
  const {} = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  });

  useEffect(() => {
    if (!isLoading) {
      if (!userData) {
        if (data) {
          socialAuth({
            email: data?.user?.email,
            name: data?.user?.name,
            avatar: data.user?.image,
          });
          refetch();
        }
      }
      if (data === null) {
        if (isSuccess) {
          toast.success("Đăng nhập thành công!");
        }
      }
      if (data === null && !isLoading && !userData) {
        setLogout(true);
      }
    }
  }, [data, userData, isLoading]);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      {
        setOpenSidebar(false);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="relative w-full">
          <div
            className={`${
              active
                ? "fixed left-0 top-0 z-[80] h-20 w-full border-b bg-white shadow-xl transition duration-300 dark:border-[#ffffff1c] dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black"
                : "z-[80] h-20 w-full border-b dark:border-[#ffffff1c] dark:shadow"
            }`}
          >
            <div className="mx-auto flex h-full w-[95%] items-center py-2 800px:w-[92%]">
              <div className="flex w-full items-center justify-between p-3">
                <div>
                  <Link href={"/"} className={`text-2xl font-bold text-black dark:text-white`}>
                    coursecn
                  </Link>
                </div>
                <div className="flex items-center">
                  <NavItems activeItem={activeItem} isMobile={false} />
                  <ThemeSwitcher />
                  {/* only for mobile */}
                  <div className="800px:hidden">
                    <HiOutlineMenuAlt3
                      size={25}
                      className="cursor-pointer text-black dark:text-white"
                      onClick={() => setOpenSidebar(true)}
                    />
                  </div>
                  {userData ? (
                    <Link href={"/profile"}>
                      <Image
                        src={userData?.user.avatar ? userData.user.avatar.url : avatar}
                        alt=""
                        width={30}
                        height={30}
                        className="h-[30px] w-[30px] cursor-pointer rounded-full"
                        style={{ border: activeItem === 5 ? "2px solid #37a39a" : "none" }}
                      />
                    </Link>
                  ) : (
                    <HiOutlineUserCircle
                      size={25}
                      className="cursor-pointer text-black dark:text-white 800px:block"
                      onClick={() => setOpen(true)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* mobile sidebar */}
            {openSidebar && (
              <div
                className="fixed left-0 top-0 z-[99999] h-screen w-full bg-[#00000024] dark:bg-[unset]"
                onClick={handleClose}
                id="screen"
              >
                <div className="fixed right-0 top-0 z-[999999999] h-screen w-[70%] bg-white dark:bg-slate-900 dark:bg-opacity-90">
                  <NavItems activeItem={activeItem} isMobile={true} />
                  {userData?.user ? (
                    <Link href={"/profile"}>
                      <Image
                        src={userData?.user.avatar ? userData.user.avatar.url : avatar}
                        alt=""
                        width={30}
                        height={30}
                        className="ml-[20px] h-[30px] w-[30px] cursor-pointer rounded-full"
                        style={{ border: activeItem === 5 ? "2px solid #37a39a" : "none" }}
                      />
                    </Link>
                  ) : (
                    <HiOutlineUserCircle
                      size={25}
                      className="hidden cursor-pointer text-black dark:text-white 800px:block"
                      onClick={() => setOpen(true)}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          {route === "Login" && (
            <>
              {open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  setRoute={setRoute}
                  activeItem={activeItem}
                  component={Login}
                  refetch={refetch}
                />
              )}
            </>
          )}

          {route === "Sign-Up" && (
            <>
              {open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  setRoute={setRoute}
                  activeItem={activeItem}
                  component={SignUp}
                />
              )}
            </>
          )}

          {route === "Verification" && (
            <>
              {open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  setRoute={setRoute}
                  activeItem={activeItem}
                  component={Verification}
                />
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
