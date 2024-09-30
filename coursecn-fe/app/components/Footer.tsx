import Link from "next/link";

type FooterProps = {};

const Footer: React.FC<FooterProps> = (props) => {
  return (
    <footer>
      <div className="border border-[#0000000e] dark:border-[#ffffff1e]" />
      <br />
      <div className="mx-auto w-[95%] px-2 sm:px-6 800px:w-full 800px:max-w-[85%] lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">Về chúng tôi</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/about"
                  className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  href="/policy"
                  className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Chính sách
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">Liên kết nhanh</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/courses"
                  className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Khóa học
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Tài khoản của tôi
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">Liên kết xã hội</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="https://www.youtube.com/channel/"
                  className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Youtube
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.instagram.com/"
                  className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.github.com/"
                  className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Github
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="pb-3 text-[20px] font-[600] text-black dark:text-white">
              Thông tin liên hệ
            </h3>
            <p className="pb-2 text-base text-black dark:text-gray-300 dark:hover:text-white">
              SĐT: 0909090909
            </p>

            <p className="pb-2 text-base text-black dark:text-gray-300 dark:hover:text-white">
              Địa chỉ: 123 Đường Nguyễn Văn Văn, Hà Đông, Hà Nội
            </p>

            <p className="pb-2 text-base text-black dark:text-gray-300 dark:hover:text-white">
              Email: coursecn.contact@gmail.com
            </p>
          </div>
        </div>
      </div>
      <br />
    </footer>
  );
};

export default Footer;
