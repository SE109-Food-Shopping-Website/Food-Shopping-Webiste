"use client"; 

import { useEffect, useState } from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type OrderDetail = {
  id: string;
  product: {
    images: string;
    name: string;
    unit: string;
  };
  quantity: number;
  salePrice: number;
};

export default function PageShipping() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleCompleteOrder = async (orderId: number) => {
    try {
      const res = await fetch(`/api/order/${orderId}/complete`, {
        method: "POST",
      });
  
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Có lỗi xảy ra");
      }
  
      toast.success("Đã xác nhận đơn hàng thành công!");
  
      setTimeout(() => {
        router.push("/client/history/completed");
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || "Xác nhận thất bại");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/order/?status=SHIPPING");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);  

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Body */}
      <div className="flex-1 flex flex-col items-center text-left text-white font-inter">
        {/* Danh sách đơn hàng */}
        <div className="w-full h-full relative px-4 py-4 flex flex-col items-center gap-[30px]">
          {loading ? (
            <div className="text-gray-500 text-lg">Đang tải dữ liệu...</div>
          ) : orders.length > 0 ? (
            orders.map((order) => {
              const displayedItems = order.orderDetails.slice(0, 2);
              const remainingCount = order.orderDetails.length - displayedItems.length;
              return (
                <div
                  key={order.id}
                  className="w-[1240px] bg-white rounded-[3px] px-4 py-6 flex flex-col gap-4 border border-gray-200 shadow-sm"
                >
                  <div className="w-full flex px-2 py-2 bg-[#F9FAFB] border border-gray-200 rounded-md flex-col gap-4">
                    {/* Hiển thị các sản phẩm đầu tiên */}
                    {displayedItems.map((detail: OrderDetail) => {
                      let imageSrc = "/ava.png";
                      try {
                        const parsedImages = JSON.parse(detail.product.images);
                        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                          imageSrc = parsedImages[0];
                        }
                      } catch (error) {
                        console.error("Error parsing product images:", error);
                      }

                      return (
                        <Link
                        key={detail.id}
                        href={`/client/history/order_detail/${order.id}`}
                        className="w-full rounded-[5px] flex flex-row items-center justify-between flex-wrap p-3 gap-y-4 hover:bg-gray-50"
                        >
                        <div className="flex flex-row items-center gap-5">
                          <img
                          className="w-[50px] h-[50px] rounded-full"
                          src={imageSrc}
                          alt={detail.product.name}
                          />
                          <div className="flex flex-col">
                          <b className="text-[18px] text-primary">
                            {detail.product.name}
                          </b>
                          <div className="text-[16px] text-foreground">
                            Đơn vị tính: {detail.product.unit}
                          </div>
                          <div className="text-base text-foreground">
                            x {detail.quantity}
                          </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end text-base">
                          <b className="text-primary text-[18px]">
                          {detail.salePrice.toLocaleString()}đ
                          </b>
                        </div>
                        </Link>
                      );
                    })}        
                    {/* Nếu còn sản phẩm khác, hiển thị số lượng còn lại */}
                    {remainingCount > 0 && (
                      <div className="px-3 text-base text-foreground text-[16px]">
                        ...và {remainingCount} sản phẩm khác
                      </div>
                    )}
                    {/* Tổng tiền */}
                    <div className="w-full flex flex-row items-center justify-end gap-2 text-base px-3">
                      <div className="font-medium text-foreground">
                        Tổng số tiền:{" "}
                        <b className="text-primary">
                          {order.totalPrice.toLocaleString()}đ
                        </b>
                      </div>
                    </div>
                  </div>
                  {/* Button */}
                  <div className="w-full relative h-[50px] flex flex-row items-center justify-end gap-[300px] text-left text-[14px] text-black font-inter">
                    <div className="w-[691px] relative tracking-[0.03em] flex items-center shrink-0">
                      <span className="w-full">
                        <p className="m-0">{`Vui lòng chỉ bấm “Đã nhận hàng” khi đơn hàng đã được giao đến bạn `}</p>
                        <p className="m-0">và sản phẩm được giao không có bất kỳ vấn đề nào</p>
                      </span>
                    </div>
                    <div className="w-full flex flex-row items-center justify-end gap-3 text-white">
                      <Button variant="secondary" onClick={() => handleCompleteOrder(order.id)}>
                        Đã nhận hàng
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
            ) : (
              <div className="text-gray-500 text-lg">Không có đơn hàng nào</div>
            )}
        </div>
      </div>
    </div>
  );
}
