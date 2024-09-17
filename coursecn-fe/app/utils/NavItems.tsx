import Link from "next/link";

export const navItemsData = [
  {
    name: "Trang chủ",
    url: "/",
  },
  {
    name: "Khóa học",
    url: "/courses",
  },
  // {
  //   name: "Giới thiệu",
  //   url: "/about",
  // },
  // {
  //   name: "Chính sách",
  //   url: "/policy",
  // },
  // {
  //   name: "Câu hỏi thường gặp",
  //   url: "/faq",
  // },
];

type NavItemsProps = {
  activeItem: number;
  isMobile: boolean;
};

const NavItems: React.FC<NavItemsProps> = ({ activeItem, isMobile }) => {
  return (
    <>
      <div className="hidden 800px:flex">
        {navItemsData &&
          navItemsData.map((i, index) => (
            <Link href={`${i.url}`} key={index} passHref>
              <span
                className={`${
                  activeItem === index
                    ? "font-medium text-[crimson] dark:text-[#37a39a]"
                    : "font-normal text-black dark:text-white"
                } px-6 text-lg`}
              >
                {i.name}
              </span>
            </Link>
          ))}
      </div>
      {isMobile && (
        <div className="mt-5 800px:hidden">
          <div className="w-full py-6 text-center">
            <Link href={"/"} passHref>
              <span className={`text-2xl font-bold text-black dark:text-white`}>coursecn</span>
            </Link>
          </div>
          {navItemsData &&
            navItemsData.map((i, index) => (
              <Link href="/" passHref key={index}>
                <span
                  className={`${
                    activeItem === index
                      ? "font-medium text-[crimson] dark:text-[#37a39a]"
                      : "font-normal text-black dark:text-white"
                  } block px-6 py-5 text-lg`}
                >
                  {i.name}
                </span>
              </Link>
            ))}
        </div>
      )}
    </>
  );
};

export default NavItems;
