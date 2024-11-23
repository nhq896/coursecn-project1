"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "../../../app/styles/style";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";

type SignUpProps = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  name: Yup.string().required("Vui lòng nhập tên của bạn!"),
  email: Yup.string().email("Địa chỉ email không hợp lệ!").required("Vui lòng nhập địa chỉ email!"),
  password: Yup.string().required("Vui lòng nhập mật khẩu!").min(6),
});

const Signup: React.FC<SignUpProps> = ({ setRoute }) => {
  const [show, setShow] = useState(false);
  const [register, { data, error, isSuccess }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Đăng ký thành công!";
      toast.success(message);
      setRoute("Verification");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      const data = {
        name,
        email,
        password,
      };
      await register(data);
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Đăng ký</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className={`${styles.label}`} htmlFor="email">
            Nhập tên của bạn
          </label>
          <input
            type="text"
            name=""
            value={values.name}
            onChange={handleChange}
            id="name"
            placeholder="Nguyễn Văn A"
            className={`${errors.name && touched.name && "border-red-500"} ${styles.input}`}
          />
          {errors.name && touched.name && (
            <span className="block pt-2 text-red-500">{errors.name}</span>
          )}
        </div>
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
        </div>
        {errors.password && touched.password && (
          <span className="block pt-2 text-red-500">{errors.password}</span>
        )}
        <div className="mt-5 w-full">
          <input type="submit" value="Đăng ký" className={`${styles.button}`} />
        </div>
        <br />
        <h5 className="pt-2 text-center text-sm text-black dark:text-white">Hoặc tiếp tục với</h5>
        <div className="my-3 flex items-center justify-center">
          <FcGoogle size={30} className="mr-2 cursor-pointer" />
          <AiFillGithub size={30} className="ml-2 cursor-pointer text-black dark:text-white" />
        </div>
        <h5 className="pt-2 text-center text-sm text-black dark:text-white">
          Bạn đã có tài khoản?{" "}
          <span className="cursor-pointer pl-1 text-[#2190ff]" onClick={() => setRoute("Login")}>
            Đăng nhập
          </span>
        </h5>
      </form>
      <br />
    </div>
  );
};

export default Signup;
