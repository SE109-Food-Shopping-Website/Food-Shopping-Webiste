"use client"

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MapPin } from "lucide-react";
import Image from "next/image";

export default function PageOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  const formatPrice = (price?: number) => price?.toLocaleString() ?? "0";

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`/api/order/${id}`);
      const json = await res.json();
      setOrder(json.order);
    };

    if (id) fetchOrder();
  }, [id]);

  if (!order) return <div>Đang tải...</div>;

  return (
    <div className="w-[1240px] flex flex-col gap-5 text-black font-inter">
      <h2 className="text-[25px] font-bold text-center">Thông tin đơn hàng</h2>
      {/* Thông tin nhận hàng */}
      <div className="rounded-[5px] px-[20px] py-[10px] flex flex-col gap-2.5 bg-white">
        <b>Thông tin nhận hàng</b>
        <div className="flex items-center gap-6">
          <MapPin className="text-black" />
          <div>
            <p>
              <span className="font-semibold">{order.name}</span>{" "}
              {order.phone}
            </p>
            <p className="text-lg">{order.address}</p>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="rounded-[5px] px-[20px] py-[10px] flex flex-col gap-5 bg-white">
        <b>Sản phẩm</b>
        {order.orderDetails.map((detail: any, index: number) => (
          <div key={index} className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center gap-4">
            {(() => {
              let imageSrc = "/ava.png"; 
              try {
                const parsedImages = JSON.parse(detail.product?.images || "[]");
                if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                  imageSrc = parsedImages[0];
                }
              } catch (error) {
                console.error("Error parsing product images:", error);
              }
              return (
                <Image
                  src={imageSrc}
                  alt={detail.product?.name || "Product image"}
                  width={70}
                  height={70}
                  className="object-cover rounded-md"
                />
              );
            })()}
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
      {/* Mã đơn hàng và thời gian đặt hàng */}
      <div className="rounded-[5px] bg-white px-[20px] py-[10px] gap-3 flex flex-col">
        <div className="flex justify-between">
          <span>Mã đơn hàng</span>
          <span>{order.id}</span>
        </div>
        <div className="flex justify-between">
          <span>Thời gian đặt hàng</span>
          <span>{new Date(order.created_at).toLocaleString("vi-VN")}</span>
        </div>
        {/* Thời gian nhận hàng */}
        {order.status === "COMPLETED" && order.paid_at && (
          <div className="flex justify-between">
            <span className="text-primary font-bold">Giao hàng thành công</span>
            <span>{new Date(order.paid_at).toLocaleString("vi-VN")}</span>
          </div>
        )}
        {/* Lý do hủy đơn */}
        {order.status === "CANCELLED" && order.reason && (
          <div className="flex justify-between">
            <span className="text-red-500 font-bold">Đã hủy đơn hàng</span>
            <span>{order.reason}</span>
          </div>
        )}
        {order.status === "CANCELLED" && order.form_submitted_at && (
          <div className="flex justify-between">
            <span className="text-red-500 font-bold">Thời gian hủy đơn</span>
            <span>{new Date(order.form_submitted_at).toLocaleString("vi-VN")}</span>
          </div>
        )}
        {/* Lý do trả hàng */}
        {order.status === "REQUEST" && order.form_submitted_at && (
          <div className="flex justify-between">
            <span className="text-red-500 font-bold">Đã gửi yêu cầu vào</span>
            <span>{new Date(order.form_submitted_at).toLocaleString("vi-VN")}</span>
          </div>
        )}
        {order.status === "REQUEST" && order.reason && (
          <div className="flex justify-between">
            <span className="text-red-500 font-bold">Lý do trả hàng</span>
            <span>{order.reason}</span>
          </div>
        )}
      </div>
    </div>
  );
}