"use client";

import React, { useEffect, useState } from "react";
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

export default function updateCategory() {
  const router = useRouter();
  const { id } = useParams(); // Lấy ID từ URL
  const [loading, setLoading] = useState(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      percent: 0,
    },
  });

  useEffect(() => {
    if (!id) return;

    fetch(`/api/product-types/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Lỗi: " + data.error);
        } else {
          form.reset({
            name: data.name,
            percent: data.priceMarginPct,
          });
        }
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        alert("Không thể tải dữ liệu!");
      })
      .finally(() => setLoading(false));
  }, [id, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch(`/api/product-types/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name: values.name,
        priceMarginPct: Number(values.percent),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Lỗi: " + data.error);
        } else {
          alert("Cập nhật thành công!");
          router.push("/admin/manage/category");
        }
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        alert("Đã xảy ra lỗi!");
      });
  }

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div>
      <div className="relative justify-start text-black text-base font-normal font-['Inter']">
        Trung tâm / Quản lý / Loại sản phẩm
      </div>
      <div className="relative justify-start text-[#5cb338] text-base font-bold font-['Inter'] mt-[10px]">
        Thông tin loại sản phẩm
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
          {/* Tên NCC */}
          <div className="w-full self-stretch inline-flex justify-between items-center mt-[10px]">
            <div className="w-[500px] inline-flex flex-col justify-start items-start gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-[500px]">
                    <FormLabel className="font-normal">
                      Tên loại sản phẩm
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[500px] inline-flex flex-col justify-start items-start gap-5">
              <FormField
                control={form.control}
                name="percent"
                render={({ field }) => (
                  <FormItem className="w-[500px]">
                    <FormLabel className="font-normal">
                      Giá bán chênh lệch (%)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Button */}
          <div className="w-full self-stretch self-stretch inline-flex flex-col justify-start items-end gap-5 overflow-hidden mt-[15px]">
            <div className="inline-flex justify-start items-start gap-[29px]">
              <div className="relative">
                <LogOut className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" />
                <Button variant={"secondary"} className="pl-12" type="button">
                  <Link href="/admin/manage/category" className="text-white">
                    Thoát
                  </Link>
                </Button>{" "}
              </div>
              <div className="relative">
                <Button type="submit">
                  <Save className="mr-2" /> Lưu
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
