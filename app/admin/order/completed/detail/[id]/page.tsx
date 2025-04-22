"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, "Tên loại sản phẩm không được để trống"),
  percent: z
    .string()
    .regex(/^\d+$/, "Giá bán chênh lệch phải là số")
    .transform((val) => parseFloat(val)),
});

export default function detailCompleted() {
  const router = useRouter();
  const { id } = useParams(); // Lấy ID từ URL
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      percent: 0,
    },
  });

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/admin/order/completed/${id}`);
        const data = await res.json();

        if (res.ok) {
          setUserData(data.user);
          setProducts(data.products);
          setSummary(data.summary);
          setLoading(false);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Lỗi khi fetch order:", error);
      }
    }

    fetchOrder();
  }, [id]);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div>
      <div className="relative justify-start text-black text-base font-normal font-['Inter']">
        Đơn hàng / Hoàn thành / Chi tiết
      </div>
      <div className="relative justify-start text-[#5cb338] text-base font-bold font-['Inter'] mt-[10px]">
        Thông tin khách đặt hàng
      </div>
      <div className="self-stretch px-5 py-2.5 bg-white rounded-[5px] inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
        <div className="inline-flex justify-start items-center gap-7">
          <img className="w-24 h-24" src="/ava.png" />
          <div className="w-full inline-flex flex-col justify-start items-start gap-2.5">
            <div className="self-stretch justify-start text-black text-base font-bold font-['Inter']">
              {userData.name}
            </div>
            <div className="self-stretch justify-start text-black text-base font-normal font-['Inter']">
              {userData.phone}
            </div>
            <div className="self-stretch justify-start text-black text-base font-normal font-['Inter']">
              {userData.address}
            </div>
          </div>
        </div>
      </div>
      <div className="justify-start text-primary text-base font-bold font-['Inter']">
        Thông tin đơn hàng
      </div>
      {products.length > 0 && (
        <div className="mt-4 w-full">
          <table className="w-full text-sm text-left text-black">
            <thead className="bg-primary font-bold text-white">
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

      <Form {...form}>
        <form encType="multipart/form-data">
          {/* Button */}
          <div className="w-full self-stretch self-stretch inline-flex flex-col justify-start items-end gap-5 overflow-hidden mt-[15px]">
            <div className="inline-flex justify-start items-start gap-[29px]">
              <div className="relative">
                <LogOut className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" />
                <Button variant={"secondary"} className="pl-12" type="button">
                  <Link href="/admin/order/completed" className="text-white">
                    Thoát
                  </Link>
                </Button>{" "}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
