"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import GoogleLogo from "@/app/components/icons/GoogleLogo";
import VerificationModal from "@/app/components/VerificationModal";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import GithubLogo from "@/app/components/icons/GithubLogo";
import { signIn } from "next-auth/react";
import { RouterUrl } from "@/app/enums/router.enum";

const formSchema = z.object({
  name: z
    .string({
      required_error: "Vui lòng nhập họ tên của bạn!",
    })
    .min(1, "Vui lòng nhập họ tên của bạn!"),
  email: z
    .string({
      required_error: "Vui lòng nhập địa chỉ email của bạn!",
    })
    .email("Địa chỉ email không hợp lệ!"),
  password: z
    .string({
      required_error: "Vui lòng nhập mật khẩu!",
    })
    .min(6, "Mật khẩu cần có ít nhất 6 ký tự!"),
});

const SignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [openVerificationModal, setOpenVerificationModal] = useState(false);
  const [register, { isLoading, data, error, isSuccess }] =
    useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Đăng ký thành công!";
      toast.success(message);
      setOpenVerificationModal(true);
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = (error.data as { message: string }).message;
        toast.error(errorMessage);
      } else {
        console.log("error register user", error);
      }
    }
  }, [data?.message, error, isSuccess]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    disabled: isLoading,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log(values);
    await register(values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-[440px]">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Đăng ký tài khoản coursecn
          </CardTitle>
          <CardDescription className="text-center">
            Nhập họ tên, địa chỉ email và mật khẩu để đăng ký!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input
                        className="text-base"
                        placeholder="Họ và tên của bạn"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ email</FormLabel>
                    <FormControl>
                      <Input
                        className="text-base"
                        placeholder="email@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <div className="relative flex items-center">
                      <FormControl>
                        <Input
                          type={!showPassword ? "password" : "text"}
                          className="pr-10 text-base"
                          placeholder={!showPassword ? "********" : "abc123@"}
                          {...field}
                        />
                      </FormControl>
                      <span
                        className="absolute right-2 cursor-pointer"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {!showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="w-full items-center gap-1 text-base"
              >
                {isLoading && (
                  <LoaderCircle size={20} className="animate-spin" />
                )}
                Đăng ký
              </Button>
            </form>
          </Form>
          <div className="relative flex items-center justify-center py-6 text-center text-sm">
            <Separator />
            <span className="absolute bg-card px-2 leading-loose text-gray-500">
              hoặc tiếp tục với
            </span>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={() => signIn("google", { callbackUrl: RouterUrl.Home })}
              size="lg"
              className="flex-1 gap-2"
            >
              <GoogleLogo size={20} />
            </Button>
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={() => signIn("github", { callbackUrl: RouterUrl.Home })}
              size="lg"
              className="flex-1 gap-2"
            >
              <GithubLogo />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center text-sm">
          Bạn đã có tài khoản?
          <Link href={RouterUrl.SignIn}>
            <Button variant="link" className="px-1">
              Đăng nhập
            </Button>
          </Link>
        </CardFooter>
      </Card>
      {openVerificationModal && (
        <VerificationModal
          title="Nhập mã xác thực"
          description={`Mã xác thực đã được gửi tới: ${form.getValues("email")}`}
          onOpenChange={setOpenVerificationModal}
          onVerifySuccess={() => router.push(RouterUrl.SignIn)}
          onResendCode={async () => {
            await form.handleSubmit(onSubmit)();
          }}
        />
      )}
    </div>
  );
};

export default SignUp;
