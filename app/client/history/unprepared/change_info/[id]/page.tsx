"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Nếu bạn dùng shadcn hoặc tương tự

export default function PageChangeInfo() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const formatPrice = (price?: number) => price?.toLocaleString() ?? "0";

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`/api/order/${id}`);
      const json = await res.json();
      setOrder(json.order);

      if (json.order.user?.name) {
        setName(json.order.user.name);
        setPhone(json.order.user.phone);
        setAddress(json.order.user.address);
      } else if (json.order.note) {
        // Tách tên, sđt, địa chỉ từ order.note
        const note = json.order.note;
        const nameMatch = note.match(/Giao cho (.*?),/);
        const phoneMatch = note.match(/sđt: ([\d+]+),/);
        const addressMatch = note.match(/địa chỉ: (.*)/);
      
        setName(nameMatch?.[1] || "");
        setPhone(phoneMatch?.[1] || "");
        setAddress(addressMatch?.[1] || "");
      }
      
    };

    if (id) fetchOrder();
  }, [id]);

  const handleUpdateInfo = async () => {
    const res = await fetch("/api/order/update-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: id,
        name,
        phone,
        address,
      }),
    });

    const result = await res.json();
    if (result.message === "Đơn hàng đã được cập nhật") {
      alert("Cập nhật thông tin thành công!");
    } else {
      alert("Cập nhật thất bại!");
    }
  };

  if (!order) return <div>Đang tải...</div>;

  return (
    <div className="w-[1240px] flex flex-col gap-5 text-black font-inter">
      <h2 className="text-[25px] font-bold text-center">Thay đổi thông tin đơn hàng</h2>

      {/* Thông tin nhận hàng (có thể sửa) */}
      <div className="rounded-[5px] px-[20px] py-[10px] flex flex-col gap-4 bg-white">
        <b>Thông tin nhận hàng</b>
        <div className="flex flex-col gap-3">
          <label>
            Họ tên:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 mt-1 border rounded-md"
            />
          </label>
          <label>
            Số điện thoại:
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 mt-1 border rounded-md"
            />
          </label>
          <label>
            Địa chỉ:
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 mt-1 border rounded-md"
            />
          </label>
          <div className="flex justify-end">
            <Button onClick={handleUpdateInfo}>Lưu thay đổi</Button>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="rounded-[5px] px-[20px] py-[10px] flex flex-col gap-5 bg-white">
        <b>Sản phẩm</b>
        {order.orderDetails.map((detail: any, index: number) => (
          <div key={index} className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center gap-4">
              {detail.product?.image ? (
                <Image
                  src={detail.product.image}
                  alt={detail.product.name}
                  width={100}
                  height={100}
                  className="object-cover rounded-md"
                />
              ) : (
                <div className="w-[100px] h-[100px] bg-gray-200 flex items-center justify-center rounded-md text-xs text-gray-500">
                  No Image
                </div>
              )}
              <div>
                <p className="font-bold">{detail.product?.name}</p>
                <p>Đơn vị tính: {detail.product?.unit}</p>
                <p>Số lượng: x{detail.quantity}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="line-through text-gray-500">{formatPrice(detail.originalPrice)}đ</p>
              <p className="text-primary text-[18px] font-semibold">{formatPrice(detail.salePrice)}đ</p>
            </div>
          </div>
        ))}
      </div>

      {/* Thông tin giá tiền */}
      <div className="rounded-[5px] px-[20px] py-[10px] flex flex-col gap-3 bg-white">
        <div className="flex justify-between">
          <span>Tạm tính</span>
          <b>{formatPrice(order.originalPrice)}đ</b>
        </div>
        <div className="flex justify-between">
          <span>Phí ship</span>
          <b>{formatPrice(order.shippingFee)}đ</b>
        </div>
        <div className="flex justify-between">
          <span>Giảm giá</span>
          <b>{formatPrice(order.discountAmount)}đ</b>
        </div>
        <div className="flex justify-between text-[18px]">
          <b>Tổng cộng</b>
          <b className="text-primary">{formatPrice(order.totalPrice)}đ</b>
        </div>
      </div>

      {/* Mã đơn hàng và thời gian */}
      <div className="rounded-[5px] bg-white px-[20px] py-[10px]">
        <div className="flex justify-between">
          <span>Mã đơn hàng</span>
          <span>{order.id}</span>
        </div>
        <div className="flex justify-between">
          <span>Thời gian đặt hàng</span>
          <span>{new Date(order.created_at).toLocaleString("vi-VN")}</span>
        </div>
      </div>
    </div>
  );
}