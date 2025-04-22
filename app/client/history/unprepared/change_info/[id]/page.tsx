"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function PageChangeInfo() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const formatPrice = (price?: number) => price?.toLocaleString() ?? "0";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order/${id}`);
        const json = await res.json();
        if (json.message) {
          throw new Error(json.message);
        }
        setOrder(json.order);
        setName(json.order.name || "");
        setPhone(json.order.phone || "");
        setAddress(json.order.address || "");
      } catch (error: any) {
        console.error("Lỗi khi lấy đơn hàng:", error);
        toast({
          title: "Lỗi",
          description: error.message || "Không thể tải thông tin đơn hàng!",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const handleUpdateInfo = async () => {
    try {
      // Validate dữ liệu
      if (!name.trim()) {
        throw new Error("Họ tên không được để trống");
      }
      if (!phone.trim() || !/^\d{10,}$/.test(phone)) {
        throw new Error("Số điện thoại không hợp lệ (phải có ít nhất 10 chữ số)");
      }
      if (!address.trim()) {
        throw new Error("Địa chỉ không được để trống");
      }

      const payload = {
        orderId: id,
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      };
      console.log("Payload gửi đi:", payload);

      const res = await fetch("/api/order/update-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.message === "Thông tin giao hàng đã được cập nhật") {
        toast({
          title: "Cập nhật thành công",
          description: "Thông tin giao hàng của bạn đã được cập nhật thành công!",
          variant: "default",
        });
      } else {
        throw new Error(result.message || "Dữ liệu không hợp lệ");
      }
    } catch (error: any) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Cập nhật thông tin giao hàng thất bại!",
        variant: "destructive",
      });
    }
  };

  if (loading || !order) return <div>Đang tải...</div>;

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
              {detail.product?.images ? (
                <Image
                  src={JSON.parse(detail.product.images)[0] || "/ava.png"}
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