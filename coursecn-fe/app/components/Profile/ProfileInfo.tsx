import Image from "next/image";
import { styles } from "../../../app/styles/style";
import { useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import avatarIcon from "../../../public/assests/avatar.png";
import { useEditProfileMutation, useUpdateAvatarMutation } from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { toast } from "react-hot-toast";

interface ProfileInfoProps {
  avatar: string | null;
  user: any;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ avatar, user }) => {
  const [name, setName] = useState(user && user.name);
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [editProfile, { isSuccess: success, error: updateError }] = useEditProfileMutation();
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery(undefined, { skip: loadUser ? false : true });

  const imageHandler = async (e: any) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result;
        updateAvatar(avatar);
      }
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (isSuccess) {
      setLoadUser(true);
    }
    if (error || updateError) {
      console.log(error);
    }
    if (success) {
      toast.success("Cập nhật thông tin thành công!");
      setLoadUser(true);
    }
  }, [isSuccess, error, success, updateError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (name !== "") {
      await editProfile({
        name: name,
      });
    }
  };

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="relative pl-6">
          <Image
            src={user.avatar || avatar ? user.avatar.url || avatar : avatarIcon}
            alt=""
            width={120}
            height={120}
            className="size-32 cursor-pointer rounded-full border-[3px] border-[#37a39a]"
          />
          <input
            type="file"
            name=""
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png,image/jpg,image/jpeg,image/webp"
          />
          <label htmlFor="avatar">
            <div className="absolute bottom-2 right-2 flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full bg-slate-900">
              <AiOutlineCamera size={20} className="z-1" />
            </div>
          </label>
        </div>
      </div>
      <br />
      <br />
      <div className="w-full pl-6 text-black dark:text-white 800px:pl-10">
        <form onSubmit={handleSubmit}>
          <div className="m-auto block pb-4 800px:w-[50%]">
            <div className="w-full">
              <label className="block pb-2">Họ và tên</label>
              <input
                type="text"
                className={`${styles.input} mb-4 800px:mb-0`}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-full pt-2">
              <label className="block pb-2">Địa chỉ email</label>
              <input
                type="text"
                readOnly
                className={`${styles.input} mb-1 800px:mb-0`}
                required
                value={user?.email}
              />
            </div>
            <input
              className={`mt-8 h-10 w-full cursor-pointer rounded-[3px] border border-[#37a39a] text-center text-black dark:text-[#fff]`}
              required
              value="Cập nhật"
              type="submit"
            />
          </div>
        </form>
        <br />
      </div>
    </>
  );
};

export default ProfileInfo;
