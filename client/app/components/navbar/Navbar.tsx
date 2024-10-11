"use client";

import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import { useEffect, useState } from "react";
import clsx from "clsx";
import NavItems from "./NavItems";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AlignRight } from "lucide-react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import {
  useLogoutMutation,
  useSocialAuthMutation,
} from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { RootState } from "@/redux/store";
import { RouterUrl } from "@/app/enums/router.enum";

const Navbar = () => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { data } = useSession();
  const [socialAuth, { isSuccess }] = useSocialAuthMutation();
  const [logout] = useLogoutMutation();

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  useEffect(() => {
    if (data && !user) {
      socialAuth({
        email: data?.user?.email,
        name: data?.user?.name,
        avatar: data?.user?.image,
      });
    }
    if (!data && isSuccess) {
      toast.success("Đăng nhập thành công!");
    }
    // if (!data) {
    //   logout({});
    // }
  }, [data, isSuccess, logout, socialAuth, user]);

  const handleLogout = async () => {
    // await Promise.all([signOut(), logout({})]);
    logout({});
    await signOut();
  };

  return (
    <div className="relative w-full">
      <div
        className={clsx(
          "fixed left-0 top-0 z-[80] h-20 w-full border-b bg-background px-4 transition duration-100 md:px-6",
          active ? "shadow-lg" : "shadow",
        )}
      >
        <div className="m-auto h-full py-2">
          <div className="flex h-full w-full items-center justify-between p-3">
            <Link
              href={RouterUrl.Home}
              className={`font-Poppins text-xl font-bold`}
            >
              coursecn
            </Link>
            <div className="flex items-center">
              <NavItems isMobile={false} />
              <ThemeSwitcher />
              {/* for mobile start */}
              <AlignRight
                size={24}
                onClick={() => setOpenSidebar(true)}
                className="cursor-pointer md:hidden"
              />
              {/* for mobile end */}
              {user ? (
                <div className="relative hidden md:flex">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Avatar>
                        <AvatarImage src={user.avatar.url} />
                        <AvatarFallback>
                          {user.name.split(" ").at(-1)?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="z-[99999] hidden md:block"
                    >
                      <DropdownMenuLabel>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar.url} />
                            <AvatarFallback>
                              {user.name.split(" ").at(-1)?.[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-base">{user.name}</p>
                            <p className="font-normal text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href={RouterUrl.Profile} className="w-full py-1">
                          Trang cá nhân
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <div
                          onClick={handleLogout}
                          className="w-full cursor-pointer py-1"
                        >
                          Đăng xuất
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link href={RouterUrl.SignIn}>
                  <Button
                    variant="outline"
                    className="hidden h-10 text-base md:flex"
                  >
                    Đăng nhập
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* mobile sidebar start */}
        <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
          <SheetContent side="left" className="z-[100]">
            <SheetHeader className="text-left">
              <Link
                href={RouterUrl.Home}
                className={`font-Poppins text-xl font-bold`}
              >
                coursecn
              </Link>
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">Menu</SheetDescription>
            </SheetHeader>
            <NavItems isMobile={true} />
            {user ? (
              <Avatar className="size-6">
                <AvatarImage src={user.avatar.url} />
                <AvatarFallback>
                  {user.name.split(" ").at(-1)?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Link href={RouterUrl.SignIn}>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full text-base"
                >
                  Đăng nhập
                </Button>
              </Link>
            )}
          </SheetContent>
        </Sheet>
        {/* mobile sidebar end */}
      </div>
    </div>
  );
};

export default Navbar;
