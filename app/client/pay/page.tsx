"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/client/context/CartContext";

export default function PagePayment() {
  const { cart, shippingFee, discount, totalPayment } = useCart();
  const router = useRouter();

  const [name, setName] = useState("Nguyễn Văn A");
  const [phone, setPhone] = useState("0123456789");
  const [address, setAddress] = useState("123 Đường ABC, Phường XYZ, Quận 1, TP.HCM");
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          cart,
          shippingFee,
          discount,
          totalPayment,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create order");

      router.push(`/client/view?orderId=${data.order.id}`);
    } catch (err) {
      console.error("Đặt hàng thất bại:", err);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex flex-row items-start justify-start py-[30px] px-[100px] gap-[60px] text-left text-white font-inter">
        {/* Left */}
        <div className="w-[500px] flex flex-col gap-2.5 text-lg text-black">
          <b className="text-[18px]">Thông tin nhận hàng</b>
          <div className="font-semibold">Tên người nhận</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-[60px]" />
          <div className="font-semibold">Số điện thoại người nhận</div>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-[60px]" />
          <div className="font-semibold">Địa chỉ giao hàng</div>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} className="h-[60px]" />
        </div>

        {/* Right */}
        <div className="flex-1 flex flex-col gap-2.5 text-base text-black">
          <b className="text-[18px]">Đơn hàng</b>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-left text-white">
              <thead>
                <tr className="bg-primary">
                  <th className="px-4 py-2">Sản phẩm</th>
                  <th className="px-4 py-2">Số lượng</th>
                  <th className="px-4 py-2">Đơn giá</th>
                  <th className="px-4 py-2">Thành tiền</th>
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

          {/* Tổng hợp */}
          <div className="px-5 flex flex-col gap-2.5 text-center">
            <div className="flex justify-between">
              <div className="font-medium">Tạm tính</div>
              <p className="font-medium">{cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}đ</p>
            </div>
            <div className="flex justify-between">
              <div className="font-medium">Phí ship</div>
              <p className="font-medium">{shippingFee.toLocaleString()}đ</p>
            </div>
            <div className="flex justify-between">
              <div className="font-medium">Giảm giá</div>
              <p className="font-medium">{discount.toLocaleString()}đ</p>
            </div>
            <div className="flex justify-between text-[18px]">
              <b>Tổng cộng</b>
              <p className="font-bold text-primary">{totalPayment.toLocaleString()}đ</p>
            </div>
          </div>

          {/* Button */}
          <div className="px-5 flex justify-between items-center">
            <div className="flex items-center gap-2 hover:scale-105 transition-all">
              <ArrowLeft className="text-primary" />
              <Link href="/client/cart" className="text-primary">Quay về giỏ hàng</Link>
            </div>
            <Button onClick={handlePlaceOrder} disabled={loading} className="border-2 border-primary text-white px-5 py-2.5 font-semibold hover:scale-105 transition-all">
              {loading ? "Đang xử lý..." : "ĐẶT HÀNG"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}