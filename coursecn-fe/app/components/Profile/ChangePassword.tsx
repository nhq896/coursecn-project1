import { styles } from "@/app/styles/style";
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface ChangePasswordProps {}

const ChangePassword: React.FC<ChangePasswordProps> = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

  const passwordChangeHandler = async (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu không khớp!");
    } else {
      await updatePassword({ oldPassword, newPassword });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Đổi mật khẩu thành công!");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  return (
    <div className="w-full px-2 pl-7 800px:px-5 800px:pl-0">
      <h1 className="block pb-2 text-center text-[25px] font-[500] text-black dark:text-[#fff] 800px:text-[30px]">
        Đổi mật khẩu
      </h1>
      <div className="w-full">
        <form aria-required onSubmit={passwordChangeHandler} className="flex flex-col items-center">
          <div className="mt-5 w-full 800px:w-[60%]">
            <label className="block pb-2 text-black dark:text-[#fff]">Nhập mật khẩu cũ</label>
            <input
              type="password"
              className={`${styles.input} mb-4 !w-[95%] text-black dark:text-[#fff] 800px:mb-0`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="mt-2 w-full 800px:w-[60%]">
            <label className="block pb-2 text-black dark:text-[#fff]">Nhập mật khẩu mới</label>
            <input
              type="password"
              className={`${styles.input} mb-4 !w-[95%] text-black dark:text-[#fff] 800px:mb-0`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mt-2 w-full 800px:w-[60%]">
            <label className="block pb-2 text-black dark:text-[#fff]">Xác nhận mật khẩu</label>
            <input
              type="password"
              className={`${styles.input} mb-4 !w-[95%] text-black dark:text-[#fff] 800px:mb-0`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              className={`mt-8 h-[40px] w-[95%] cursor-pointer rounded-[3px] border border-[#37a39a] text-center text-black dark:text-[#fff]`}
              required
              value="Cập nhật"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
