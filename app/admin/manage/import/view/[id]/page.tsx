"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PageImportDetail() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchImport = async () => {
      const res = await fetch(`/api/import/${id}`);
      const json = await res.json();
      setData(json);
    };

    if (id) fetchImport();
  }, [id]);

  if (!data) return <div>Đang tải...</div>;

  return (
    <div className="p-1 flex flex-col gap-5">
      <div className="w-[500px] flex flex-col gap-2.5">
        <b>Thông tin nhập hàng</b>
        <div className="text-[16px] font-semibold">Tên nhà cung cấp</div>
        <Input className="h-[60px]" value={data.provider?.name || "Không có"} readOnly />
      </div>
      <div className="flex flex-col gap-2.5">
        <b>Đơn hàng</b>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-left">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-2">Sản phẩm</th>
                <th className="px-4 py-2">Giá nhập</th>
                <th className="px-4 py-2">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {data.importDetails.map((detail: any) => (
                <tr key={detail.id} className="border-b">
                  <td className="px-4 py-2">{detail.product.name}</td>
                  <td className="px-4 py-2">{detail.price.toLocaleString()}đ</td>
                  <td className="px-4 py-2">{detail.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
          <div className="flex items-center gap-2 hover:scale-105 transition-all">
              <ArrowLeft className="text-primary" />
              <Link href="/admin/manage/import" className="text-primary">Quay về danh sách</Link>
            </div>
          <span className="text-primary font-bold">Tổng cộng: {data.totalPrice.toLocaleString()}đ</span>
        </div>
      </div>
    </div>
  );
}