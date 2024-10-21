import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActivateUserMutation } from "@/redux/features/auth/authApi";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import clsx from "clsx";
import { RootState } from "@/redux/store";

interface VerificationModalProps {
  title: string;
  description: string;
  onOpenChange: (value: boolean) => void;
  onVerifySuccess: () => void;
  onResendCode: () => Promise<void>;
}

const otpLength = 4;

const formSchema = z.object({
  activation_code: z
    .string({
      required_error: "Vui lòng nhập mã xác thực!",
    })
    .length(otpLength, "Mã xác thực gồm 4 chữ số!"),
});

const VerificationModal: React.FC<VerificationModalProps> = ({
  title,
  description,
  onOpenChange,
  onVerifySuccess,
  onResendCode,
}) => {
  const initTime = 5 * 60;
  const [timeLeft, setTimeLeft] = useState<number>(initTime);
  const { token } = useSelector((state: RootState) => state.auth);
  const [resendLoading, setResendLoading] = useState(false);
  const [activateUser, { isLoading, isSuccess, error }] =
    useActivateUserMutation();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Kích hoạt tài khoản thành công!");
      onVerifySuccess();
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = (error.data as { message: string }).message;
        toast.error(errorMessage);
      } else {
        console.log("error activate user", error);
      }
    }
  }, [error, isSuccess, onVerifySuccess]);

  const resendCode = async () => {
    try {
      setResendLoading(true);
      await onResendCode();
      setTimeLeft(initTime);
    } catch (error) {
      console.log("error resend code", error);
    } finally {
      setResendLoading(false);
    }
  };

  const formattedTime = `${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? "0" : ""}${timeLeft % 60}`;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activation_code: "",
    },
    disabled: isLoading,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { activation_code } = values;

    await activateUser({
      activation_token: token,
      activation_code: activation_code,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent
        closeButton={<></>}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="activation_code"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Họ và tên</FormLabel> */}
                  <FormControl>
                    <div className="mt-2 flex justify-center">
                      <InputOTP
                        maxLength={otpLength}
                        containerClassName="w-fit scale-110"
                        {...field}
                      >
                        {[...Array(otpLength).keys()].map((item) => {
                          return (
                            <InputOTPGroup key={item}>
                              <InputOTPSlot
                                className={clsx(
                                  error &&
                                    "shake border-destructive ring-transparent",
                                )}
                                index={item}
                              />
                            </InputOTPGroup>
                          );
                        })}
                      </InputOTP>
                    </div>
                  </FormControl>
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!form.formState.isValid || !timeLeft || isLoading}
              size="lg"
              className="w-full items-center gap-1 text-base"
            >
              {isLoading && <LoaderCircle size={20} className="animate-spin" />}
              Xác nhận
            </Button>
            {!timeLeft && (
              <p className="!mt-1 text-center text-xs text-destructive">
                Thời gian xác thực đã hết. Vui lòng chọn &quot;Gửi lại&quot;!
              </p>
            )}
          </form>
        </Form>
        <div className="text-center text-sm">
          Bạn chưa nhận được mã?{" "}
          <Button
            variant="link"
            disabled={timeLeft > 0 || resendLoading}
            onClick={resendCode}
            className="size-fit items-center gap-1 justify-self-center p-0"
          >
            Gửi lại {timeLeft > 0 && <span>({formattedTime})</span>}
            {resendLoading && (
              <LoaderCircle size={20} className="animate-spin" />
            )}
          </Button>
        </div>
        <DialogClose asChild>
          <Button variant="link" className="size-fit justify-self-center p-0">
            <ArrowLeft size={16} /> Quay lại
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationModal;
