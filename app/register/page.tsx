"use client";

import { Form } from "@/components/ui/form";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function pageRegister() {
  interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    repassword: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [repassword, setRepassword] = useState("");
  const [name, setName] = useState("");

  const handleAddUser = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Call login API here
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
          ĐĂNG KÝ
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
        <div className="w-1/2 h-full px-[50px] py-[20px] inline-flex justify-start items-center gap-2.5 overflow-hidden">
          <div className="w-full h-full px-[60px] py-[20px] bg-white inline-flex flex-col justify-start items-center gap-[25px] overflow-hidden">
            <Form>
              <div className="relative justify-start text-[#fb4141] text-[32px] font-bold font-['Inter']">
                ĐĂNG KÝ
              </div>
              <Input
                type="email"
                className="w-[460px] h-[60px] p-2.5 rounded-[5px] border-none placeholder:text-gray-400"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="phone"
                className="w-[460px] h-[60px] p-2.5 rounded-[5px] border-none placeholder:text-gray-400"
                placeholder="Số điện thoại giao hàng"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                className="w-[460px] h-[60px] p-2.5 rounded-[5px] border-none placeholder:text-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Nhập lại mật khẩu"
                className="w-[460px] h-[60px] p-2.5 rounded-[5px] border-none placeholder:text-gray-400"
                value={repassword}
                onChange={(e) => setRepassword(e.target.value)}
                required
              />
              <Input
                type="name"
                className="w-[460px] h-[60px] p-2.5 rounded-[5px] border-none placeholder:text-gray-400"
                placeholder="Tên khách hàng"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                type="address"
                className="w-[460px] h-[60px] p-2.5 rounded-[5px] border-none placeholder:text-gray-400"
                placeholder="Địa chỉ giao hàng"
                value={address}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="w-[500px] h-[40px] p-2.5 bg-[#5cb338] rounded-[5px] inline-flex justify-center items-center gap-2.5 overflow-hidden"
              >
                <div className="relative justify-start text-white text-[20px] font-bold font-['Inter']">
                  ĐĂNG KÝ
                </div>
              </Button>
            </Form>

            {/* Đăng nhập */}
            <div className="w-full flex flex-col items-center gap-2">
              <div className="text-[16px] text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="text-[#fb4141] font-bold text-[16px] hover:underline"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
