import { Form } from "@/components/ui/form";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function pageLogin() {
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
        <div className="w-1/2 h-full px-[50px] py-[100px] inline-flex justify-start items-center gap-2.5 overflow-hidden">
          {/* Form */}
          <div className="w-full h-full px-[60px] py-[30px] bg-white inline-flex flex-col justify-start items-center gap-[30px] overflow-hidden">
            <Form>
              <div className="relative justify-start text-[#fb4141] text-[32px] font-bold font-['Inter']">
                ĐĂNG NHẬP
              </div>
              <Input type="email" placeholder="Email" />
              <Input type="password" placeholder="Password" />
              <Button className="w-[500px] h-[60px] p-2.5 bg-[#5cb338] rounded-[5px] inline-flex justify-center items-center gap-2.5 overflow-hidden">
                <div className="relative justify-start text-white text-[20px] font-bold font-['Inter']">
                  ĐĂNG NHẬP
                </div>
              </Button>
            </Form>
            {/* Forget password */}
          </div>
        </div>
      </div>
    </div>
  );
}
