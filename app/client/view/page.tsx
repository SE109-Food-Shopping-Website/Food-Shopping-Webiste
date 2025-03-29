"use client";
import { useSearchParams } from "next/navigation";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="text-center p-6">
      <h1 className="text-2xl font-bold">Cảm ơn bạn đã đặt hàng!</h1>
      <p>Mã đơn hàng của bạn: <strong>{orderId}</strong></p>
      <a href="/client/history/unprepared" className="text-blue-500 underline">
        Xem lịch sử đơn hàng
      </a>
    </div>
  );
}