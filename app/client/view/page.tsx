"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format, toZonedTime } from "date-fns-tz";

export default function PageViewPayment() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [createdAt, setCreatedAt] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const res = await fetch(`/api/order/${orderId}`);
        const data = await res.json();

        if (data?.order?.created_at) {
          const zoned = toZonedTime(data.order.created_at, "Asia/Ho_Chi_Minh");
          const formatted = format(zoned, "dd/MM/yyyy HH:mm:ss", {
            timeZone: "Asia/Ho_Chi_Minh",
          });
          setCreatedAt(formatted);
        }
      } catch (err) {
        console.error("Lỗi lấy đơn hàng:", err);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <div className="text-center p-6">
      <h1 className="text-2xl font-bold">Cảm ơn bạn đã đặt hàng!</h1>
      <p>Mã đơn hàng của bạn: <strong>{orderId}</strong></p>
      {createdAt && (
        <p>Thời gian đặt hàng: <strong>{createdAt}</strong></p>
      )}
      <a href="/client/history/unprepared" className="text-blue-500 underline mt-2 block">
        Xem lịch sử đơn hàng
      </a>
    </div>
  );
}