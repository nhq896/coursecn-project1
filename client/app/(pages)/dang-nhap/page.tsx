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
import GoogleLogo from "@/app/components/icons/GoogleLogo";
import { Separator } from "@/components/ui/separator";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import GithubLogo from "@/app/components/icons/GithubLogo";
import { signIn } from "next-auth/react";
import { RouterUrl } from "@/app/enums/router.enum";

const formSchema = z.object({
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

const SignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, isSuccess, error, data }] = useLoginMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Đăng nhập thành công!";
      toast.success(message);
      router.push(RouterUrl.Home);
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = (error.data as { message: string }).message;
        toast.error(errorMessage);
      } else {
        console.log("error login", error);
      }
    }
  }, [data?.message, error, isSuccess, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    disabled: isLoading,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log(values);
    await login(values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-[440px]">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Đăng nhập vào coursecn
          </CardTitle>
          <CardDescription className="text-center">
            Nhập địa chỉ email và mật khẩu để đăng nhập!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                          className="pr-10"
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
                Đăng nhập
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
          Bạn chưa có tài khoản?
          <Link href={RouterUrl.SignUp}>
            <Button variant="link" className="px-1">
              Đăng ký
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
