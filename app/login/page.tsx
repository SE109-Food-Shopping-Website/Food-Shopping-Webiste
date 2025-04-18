"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
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

// Schema validate
const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
});

export default function PageLogin() {
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const { role } = await res.json();

      if (role === 1) {
        router.push("/admin/manage/provider"); // Nếu role là admin (1)
      } else if (role === 2) {
        router.push("/client/collection/dashboard"); // Nếu role là client (2)
      }
    } else {
      alert("Sai thông tin đăng nhập");
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
          ĐĂNG NHẬP
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
        <div className="self-stretch self-stretch px-12 py-24 inline-flex justify-start items-center gap-2.5 overflow-hidden">
          <div className="flex-1 px-14 py-7 bg-white inline-flex flex-col justify-start items-center gap-7 overflow-hidden">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-[20px]"
              >
                <div className="self-stretch text-center justify-start text-red-500 text-3xl font-bold font-['Inter'] mt-[20px]">
                  ĐĂNG NHẬP
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email"
                          className="w-[460px] h-[60px] p-2.5 rounded-[5px] placeholder:text-gray-400"
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
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Mật khẩu"
                          className="w-[460px] h-[60px] p-2.5 rounded-[5px] placeholder:text-gray-400"
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
                    ĐĂNG NHẬP
                  </div>
                </Button>
              </form>
            </Form>

            {/* <div className="w-full flex flex-col items-center gap-2">
              <Link
                href="/forgetpw"
                className="text-[16px] text-[#5cb338] hover:underline"
              >
                Quên mật khẩu?
              </Link>
              <div className="text-[16px] text-gray-600 mt-[15px]">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="text-[#fb4141] font-bold text-[16px] hover:underline"
                >
                  Đăng ký
                </Link>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
