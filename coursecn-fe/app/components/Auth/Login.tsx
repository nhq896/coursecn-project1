"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "../../../app/styles/style";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

interface LoginProps {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
  refetch: any;
}

const schema = Yup.object().shape({
  email: Yup.string().email("Địa chỉ email không hợp lệ!").required("Vui lòng nhập địa chỉ email!"),
  password: Yup.string()
    .required("Vui lòng nhập mật khẩu!")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự!"),
});

const Login: React.FC<LoginProps> = ({ setRoute, setOpen, refetch }) => {
  const [show, setShow] = useState(false);
  const [login, { isSuccess, error }] = useLoginMutation();
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      await login({ email, password });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Đăng nhập thành công!");
      setOpen(false);
      refetch();
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Đăng nhập</h1>
      <form onSubmit={handleSubmit}>
        <label className={`${styles.label}`} htmlFor="email">
          Nhập địa chỉ email
        </label>
        <input
          type="email"
          name=""
          value={values.email}
          onChange={handleChange}
          id="email"
          placeholder="mail@gmail.com"
          className={`${errors.email && touched.email && "border-red-500"} ${styles.input}`}
        />
        {errors.email && touched.email && (
          <span className="block pt-2 text-red-500">{errors.email}</span>
        )}
        <div className="relative mb-1 mt-5 w-full">
          <label className={`${styles.label}`} htmlFor="email">
            Nhập mật khẩu
          </label>
          <input
            type={!show ? "password" : "text"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder={show ? "password!@%" : "********"}
            className={`${errors.password && touched.password && "border-red-500"} ${styles.input}`}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              className="z-1 absolute bottom-3 right-2 cursor-pointer text-black dark:text-white"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="z-1 absolute bottom-3 right-2 cursor-pointer text-black dark:text-white"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
          {errors.password && touched.password && (
            <span className="block pt-2 text-red-500">{errors.password}</span>
          )}
        </div>
        <div className="mt-5 w-full">
          <input type="submit" value="Đăng nhập" className={`${styles.button}`} />
        </div>
        <br />
        <h5 className="pt-2 text-center text-[14px] text-black dark:text-white">
          Hoặc tiếp tục với
        </h5>
        <div className="my-3 flex items-center justify-center">
          <FcGoogle size={30} className="mr-2 cursor-pointer" onClick={() => signIn("google")} />
          <AiFillGithub
            size={30}
            className="ml-2 cursor-pointer text-black dark:text-white"
            onClick={() => signIn("github")}
          />
        </div>
        <h5 className="pt-2 text-center text-[14px] text-black dark:text-white">
          Bạn chưa có tài khoản?{" "}
          <span className="cursor-pointer pl-1 text-[#2190ff]" onClick={() => setRoute("Sign-Up")}>
            Đăng ký
          </span>
        </h5>
      </form>
      <br />
    </div>
  );
};

export default Login;
