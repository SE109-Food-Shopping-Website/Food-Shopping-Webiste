"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

// Schema xác thực
const formSchema = z
  .object({
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export default function SetNewPassword() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const email = localStorage.getItem("resetEmail"); // Lấy email từ localStorage

    if (!email) {
      alert("Không tìm thấy email để xác nhận! Vui lòng thử lại.");
      return;
    }

    try {
      // Gửi mật khẩu mới và email tới API
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword: data.password }),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.message || "Lỗi khi đặt lại mật khẩu.");
        alert("Có lỗi xảy ra: " + result.message);
      } else {
        // Thành công
        alert("Đặt lại mật khẩu thành công!");
        router.push("/login"); // Chuyển hướng về trang đăng nhập
      }
    } catch (error) {
      setServerError("Lỗi kết nối với server.");
      alert("Lỗi kết nối với server. Vui lòng thử lại.");
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
          ĐẶT LẠI MẬT KHẨU
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
                className="w-full flex flex-col gap-[30px]"
              >
                <div className="self-stretch text-center justify-start text-red-500 text-3xl font-bold font-['Inter']">
                  MẬT KHẨU MỚI
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="w-[460px] h-[60px] p-2.5 rounded-[5px]"
                          placeholder="Nhập mật khẩu mới"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="w-[460px] h-[60px] p-2.5 rounded-[5px]"
                          placeholder="Nhập lại mật khẩu"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-[500px] h-[40px] p-2.5 bg-[#5cb338] rounded-[5px] inline-flex justify-center items-center gap-2.5 overflow-hidden mb-[20px]"
                >
                  <div className="relative justify-start text-white text-[20px] font-bold font-['Inter']">
                    XÁC NHẬN
                  </div>
                </Button>
              </form>
            </Form>
            {serverError && (
              <div className="text-red-500 text-sm">{serverError}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
