import { styles } from "@/app/styles/style";
import { useActivationMutation } from "@/redux/features/auth/authApi";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from "react-redux";

interface VerificationProps {
  setRoute: (route: string) => void;
}

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification: React.FC<VerificationProps> = ({ setRoute }) => {
  const { token } = useSelector((state: any) => state.auth);
  const [activation, { isSuccess, error }] = useActivationMutation();
  const [invalidError, setInvalidError] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Tài khoản đã được kích hoạt!");
      setRoute("Login");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
        setInvalidError(true);
      } else {
        console.log(error);
      }
    }
  }, [isSuccess, error]);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }
    await activation({
      activation_token: token,
      activation_code: verificationNumber,
    });
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div>
      <h1 className={`${styles.title}`}>Xác thực tài khoản</h1>
      <div className="mt-2 flex w-full items-center justify-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-[#497DF2]">
          <VscWorkspaceTrusted size={32} />
        </div>
      </div>
      <br />
      <div className="m-auto flex items-center justify-around">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="number"
            key={key}
            ref={inputRefs[index]}
            className={`flex size-14 items-center justify-center rounded-lg border-[3px] bg-transparent text-center text-xl text-black outline-none dark:text-white ${
              invalidError ? "shake border-red-500" : "border-[#0000004a] dark:border-white"
            }`}
            placeholder=""
            maxLength={1}
            max={9}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <br />
      <br />
      <div className="flex w-full justify-center">
        <button className={`${styles.button}`} onClick={verificationHandler}>
          Xác nhận
        </button>
      </div>
      <br />
      <h5 className="pt-4 text-center text-sm text-black dark:text-white">
        Quay lại đăng nhập?{" "}
        <span className="cursor-pointer pl-1 text-[#2190ff]" onClick={() => setRoute("Login")}>
          Đăng nhập
        </span>
      </h5>
      <br />
    </div>
  );
};

export default Verification;
