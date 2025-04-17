"use client";

import React, {useState} from "react";
import {ArrowLeft} from "lucide-react"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/client/context/CartContext";

export default function PageChangeInfo() {
  const { cart,shippingFee, discount, totalPayment } = useCart();
  const router = useRouter();

  const [name, setName] = useState("Nguyễn Văn A");
  const [phone, setPhone] = useState("0123456789");
  const [address, setAddress] = useState("123 Đường ABC, Phường XYZ, Quận 1, TP.HCM");
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = () => {
    const orderId = Math.floor(Math.random() * 1000000); 
    router.push(`/client/history/unprepared?orderId=${orderId}`);
  };

  return (
    <div className="w-[1440px] min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex flex-row items-start justify-start py-[10px] px-[100px] gap-[30px] text-left text-white font-inter">
        {/* Left */}
        <div className="w-[500px] relative overflow-hidden shrink-0 flex flex-col items-start justify-start p-2.5 box-border gap-2.5 text-left text-lg text-black font-inter">
            <b className="relative text-[18px]">Thông tin nhận hàng</b>
            {/* Name */}
            <div className="relative text-[16px] font-semibold">Tên người nhận</div> 
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="h-[40px] w-full border border-[#5CB338] rounded-[5px] px-4 text-[16px] text-black placeholder:text-[#CCCCCC]"
            />     
            {/* Phone */}
            <div className="relative text-[16px] font-semibold">Số điện thoại người nhận</div> 
            <input 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="h-[40px] w-full border border-[#5CB338] rounded-[5px] px-4 text-[16px] text-black placeholder:text-[#CCCCCC]"
            />     
            {/* Address */}
            <div className="relative text-[16px] font-semibold">Địa chỉ giao hàng</div> 
            <input 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              className="h-[40px] w-full border border-[#5CB338] rounded-[5px] px-4 text-[16px] text-black placeholder:text-[#CCCCCC]"
            />
        </div>
        {/* Right */}
        <div className="flex-1 w-full relative overflow-hidden shrink-0 flex flex-col items-start justify-start p-2.5 box-border gap-2.5 text-left text-base text-black font-inter">
          <b className="relative text-[18px]">Đơn hàng</b>
          {/* Item */}
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-center text-white">
              <thead>
                <tr className="bg-primary">
                  <th className="border border-gray-300 px-4 py-2">Sản phẩm</th>
                  <th className="border border-gray-300 px-4 py-2">Số lượng</th>
                  <th className="border border-gray-300 px-4 py-2">Đơn giá</th>
                  <th className="border border-gray-300 px-4 py-2">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
              {cart.map((product) => (
              <tr key={product.id} className="text-foreground border">
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.quantity}</td>
                <td className="px-4 py-2">{product.price.toLocaleString()}đ</td>
                <td className="px-4 py-2">{(product.price * product.quantity).toLocaleString()}đ</td>
              </tr>
            ))}
              </tbody>
            </table>
          </div>
          <div className="self-stretch flex flex-col items-start justify-start py-0 px-5 gap-2.5 text-center">
            <div className="self-stretch flex flex-row items-start justify-between gap-0">
              <div className="relative leading-[130%] font-medium">Tạm tính</div>
              <p className="font-medium">{cart.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString()}đ</p>
            </div>
            <div className="self-stretch flex flex-row items-start justify-between gap-0">
              <div className="relative leading-[130%] font-medium">Phí ship</div>
              <p className="font-medium">{shippingFee.toLocaleString()}đ</p>
            </div>
            <div className="self-stretch flex flex-row items-start justify-between">
              <div className="font-medium leading-[130%]">Giảm giá</div>
              <p className="font-medium">{discount.toLocaleString()}đ</p>
            </div>
            <div className="self-stretch flex flex-row items-start justify-between gap-0 text-[18px]">
              <b className="relative leading-[130%]">Tổng cộng</b>
              <p className="font-bold text-primary">{totalPayment.toLocaleString()}đ</p>
            </div>
          </div>
          {/* Button */}
          <div className="self-stretch flex flex-row items-end justify-end py-0 px-5 gap-0">
            <Button onClick={handlePlaceOrder} className="rounded-[5px] border-2 border-primary text-white px-5 py-2.5 font-semibold group transition-all duration-200 hover:scale-105" type="submit">
              CẬP NHẬT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}