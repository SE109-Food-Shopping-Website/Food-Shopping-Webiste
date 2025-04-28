"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, Save } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function DetailProcessing() {
  const router = useRouter();
  const { id } = useParams(); // Lấy ID từ URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ name: string; phone: string; address: string } | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [detail, setDetail] = useState<{ reason: string; paid_at: string | null } | null>(null);

  const handleUpdateStatus = useCallback(async () => {
    if (window.confirm("Bạn có chắc chắn muốn hoàn đơn này?")) {
      try {
        const res = await fetch(`/api/admin/order/request/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "RETURN" }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Có lỗi xảy ra.");
        }
        console.log("Cập nhật thành công, chuyển hướng...");
        alert("Đơn hàng đã được trả thành công!");
        router.push("/admin/order/request");
      } catch (err) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err);
        setError(err instanceof Error ? err.message : "Lỗi không xác định");
      }
    }
  }, [id, router]);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/admin/order/request/${id}`);
        const data = await res.json();
        console.log("API response:", data);

        if (res.ok) {
          if (!data.user || !data.summary || !data.detailOrder) {
            console.error("Dữ liệu API không đầy đủ:", data);
            setError("Dữ liệu đơn hàng không đầy đủ (thiếu user, summary, hoặc detailOrder)");
            setLoading(false);
            return;
          }
          setUserData(data.user);
          setProducts(data.products);
          setSummary(data.summary);
          setDetail(data.detailOrder);
          setLoading(false);
        } else {
          console.error("API error:", data.error);
          setError(data.error || "Lỗi khi lấy thông tin đơn hàng");
          setLoading(false);
        }
      } catch (error) {
        console.error("Lỗi khi fetch order:", error);
        setError("Lỗi khi lấy thông tin đơn hàng");
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi: {error}</p>;
  if (!userData || !summary || !detail) {
    console.error("State không đầy đủ:", { userData, summary, detail });
    return <p>Không có dữ liệu đơn hàng</p>;
  }

  // Định dạng ngày giờ
  const formatDateTime = (isoString: string | null) => {
    if (!isoString) return "Không xác định";
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="justify-start text-black text-base font-normal font-['Inter']">
        Đơn hàng / Yêu cầu trả / Chi tiết
      </div>
      <div className="justify-start text-[#5cb338] text-base font-bold font-['Inter'] mt-[10px]">
        Thông tin khách đặt hàng
      </div>
      <div className="self-stretch px-5 py-2.5 bg-white rounded-[5px] inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
        <div className="inline-flex justify-start items-center gap-7">
          <img className="w-24 h-24" src="/ava.png" alt="Avatar" />
          <div className="w-full inline-flex flex-col justify-start items-start gap-2.5">
            <div className="self-stretch text-black text-base font-bold font-['Inter']">
              {userData.name}
            </div>
            <div className="self-stretch text-black text-base font-normal font-['Inter']">
              {userData.phone}
            </div>
            <div className="self-stretch text-black text-base font-normal font-['Inter']">
              {userData.address}
            </div>
          </div>
        </div>
      </div>
      <div className="justify-start text-[#5cb338] text-base font-bold font-['Inter'] mt-[10px]">
        Thông tin đơn hàng
      </div>
      {products.length > 0 && (
        <div className="mt-4 w-full">
          <table className="w-full text-sm text-left text-black">
            <thead className="bg-[#5cb338] font-bold text-white">
              <tr>
                <th className="px-4 py-2 border">ID SP</th>
                <th className="px-4 py-2 border">Tên sản phẩm</th>
                <th className="px-4 py-2 border">Số lượng</th>
                <th className="px-4 py-2 border">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-2 border">{p.id}</td>
                  <td className="px-4 py-2 border">{p.name}</td>
                  <td className="px-4 py-2 border">{p.quantity}</td>
                  <td className="px-4 py-2 border">
                    {p.total.toLocaleString()}₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="justify-start text-[#5cb338] text-base font-bold font-['Inter'] mt-[20px]">
        Thông tin trả hàng
      </div>
      <div className="mt-4 w-full text-sm text-black space-y-2">
        <div className="flex justify-between">
          <span>Lý do trả hàng:</span>
          <span>{detail.reason}</span>
        </div>
        <div className="flex justify-between">
          <span>Thời gian yêu cầu:</span>
          <span>{formatDateTime(detail.paid_at)}</span>
        </div>
      </div>

      {summary && (
        <div className="mt-4 w-full text-sm text-black space-y-2">
          <div className="flex justify-between">
            <span>Tổng tiền hàng:</span>
            <span>{summary.originalPrice.toLocaleString()}₫</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển:</span>
            <span>{summary.shippingFee.toLocaleString()}₫</span>
          </div>
          <div className="flex justify-between">
            <span>Giảm giá:</span>
            <span>-{summary.discountAmount.toLocaleString()}₫</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Tổng cộng:</span>
            <span>{summary.totalPrice.toLocaleString()}₫</span>
          </div>
        </div>
      )}

      <div className="w-full inline-flex flex-col justify-start items-end gap-5 mt-[15px]">
        <div className="inline-flex justify-start items-start gap-[29px]">
          <div className="relative">
            <LogOut className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" />
            <Button variant="secondary" className="pl-12" type="button">
              <Link href="/admin/order/request" className="text-white">
                Thoát
              </Link>
            </Button>
          </div>
          <div className="relative">
            <Button onClick={handleUpdateStatus}>
              <Save className="mr-2" /> Trả hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}