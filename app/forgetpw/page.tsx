"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
});

export default function ForgetPassword() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setServerError("");
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: values.email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Lỗi gửi mã xác thực");
      }

      // Lưu email vào localStorage để dùng cho bước xác nhận
      localStorage.setItem("resetEmail", values.email);
      router.push("/forgetpw/confirm");
    } catch (error: any) {
      setServerError(error.message);
    }
  };

  return (
    <div className="w-full h-full bg-white inline-flex flex-col justify-start items-start overflow-hidden">
      {/* Heading */}
      <div className="h-[80px] px-[30px] py-2.5 bg-white inline-flex justify-start items-center gap-5 overflow-hidden">
        <img
          className="w-[173.68px] h-[60px] relative"
          src="/logo_left.png"
          alt="logo"
        />
        <div className="relative justify-start text-[#fb4141] text-[28px] font-bold font-['Inter']">
          QUÊN MẬT KHẨU
        </div>
      </div>

      {/* Body */}
      <div className="w-full h-full bg-[#5cb338] inline-flex justify-start items-start overflow-hidden">
        {/* Left */}
        <div className="w-1/2 h-full inline-flex justify-between items-center overflow-hidden">
          <img
            className="h-full relative"
            src="/logo_slogan.png"
            alt="logo_slogan"
          />
        </div>

        {/* Right */}
        <div className="w-1/2 h-full px-[50px] py-[100px] inline-flex justify-start items-center gap-2.5 overflow-hidden">
          <div className="w-full px-[60px] py-[30px] bg-white inline-flex flex-col justify-start items-center gap-[30px] overflow-hidden">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 w-full flex flex-col items-center"
              >
                <div className="text-[#fb4141] text-[32px] font-bold">
                  QUÊN MẬT KHẨU
                </div>
                <div className="text-black text-base font-medium text-center">
                  Nhập email cho quá trình xác thực, chúng tôi sẽ gửi mã xác
                  thực gồm 4 ký tự vào email này
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full inline-flex items-center">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email"
                          className="h-[60px] w-[500px] inline-flex items-center"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {serverError && (
                  <div className="text-red-500 text-sm">{serverError}</div>
                )}

                <Button
                  type="submit"
                  className="w-full h-[40px] bg-[#5cb338] rounded-[5px]"
                >
                  <span className="text-white text-[20px] font-bold">
                    TIẾP THEO
                  </span>
                </Button>
              </form>
            </Form>

            {/* Link đăng ký */}
            <div className="w-full flex flex-col items-center gap-2">
              <div className="text-[16px] text-gray-600">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="text-[#fb4141] font-bold text-[16px] hover:underline"
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
