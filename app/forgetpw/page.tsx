"use client";

import { Form } from "@/components/ui/form";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgetPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Danh sách email giả lập có trong hệ thống
  const mockEmails = ["an@gmail.com", "binh@gmail.com", "chi@gmail.com"];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Kiểm tra email trong danh sách
    if (mockEmails.includes(email.trim().toLowerCase())) {
      setError("");
      router.push("/forgetpw/confirm");
    } else {
      setError("Email không tồn tại trong hệ thống!");
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
          <div className="w-full h-full px-[60px] py-[30px] bg-white inline-flex flex-col justify-start items-center gap-[30px] overflow-hidden">
            <Form>
              <div className="relative justify-start text-[#fb4141] text-[32px] font-bold font-['Inter']">
                QUÊN MẬT KHẨU
              </div>
              <div className="self-stretch justify-start text-black text-base font-medium font-['Inter']">
                Nhập email cho quá trình xác thực, chúng tôi sẽ gửi mã xác thực
                gồm 4 ký tự vào email này
              </div>
              <Input
                type="email"
                className="w-[460px] h-[60px] p-2.5 rounded-[5px] placeholder:text-gray-400"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && (
                <div className="text-red-500 text-sm mt-[-20px]">{error}</div>
              )}
              <Button
                type="submit"
                onClick={handleSubmit}
                className="w-[500px] h-[40px] p-2.5 bg-[#5cb338] rounded-[5px] inline-flex justify-center items-center gap-2.5 overflow-hidden"
              >
                <div className="relative justify-start text-white text-[20px] font-bold font-['Inter']">
                  TIẾP THEO
                </div>
              </Button>
            </Form>

            {/* Link đăng ký */}
            <div className="w-full flex flex-col items-center gap-2">
              <div className="text-[16px] text-gray-600 mt-[15px]">
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
