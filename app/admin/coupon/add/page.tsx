"use client";

import React from "react";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Tên giảm giá không được để trống"),
  discount_percent: z
    .string()
    .regex(/^\d+$/, "Phần trăm giảm giá phải là số")
    .transform((val) => parseFloat(val)),
  start_at: z.string().min(1, "Ngày bắt đầu không được để trống"),
  end_at: z.string().min(1, "Ngày kết thúc không được để trống"),
  product_type_id: z
    .string()
    .regex(/^\d+$/, "ID loại sản phẩm phải là số")
    .transform((val) => parseInt(val, 10)),
});

export default function AddCoupon() {
  // Viết hoa chữ cái đầu để đúng quy ước component React
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      discount_percent: 0,
      start_at: "",
      end_at: "",
      product_type_id: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch("/api/admin/coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Lỗi từ server: " + res.statusText);
        }
        if (res.status === 204) {
          throw new Error("Server không trả về dữ liệu");
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          alert("Lỗi: " + data.error);
        } else {
          toast.success("Thêm mới thành công");
          form.reset();
          router.push("/admin/coupon");
        }
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        alert("Đã xảy ra lỗi: " + err.message);
      });
  }

  return (
    <div>
      <div className="relative justify-start text-black text-base font-normal font-['Inter']">
        Đơn hàng / Giảm sản phẩm / Thêm mới
      </div>
      <div className="relative justify-start text-[#5cb338] text-base font-bold font-['Inter'] mt-[10px]">
        Thông tin giảm giá sản phẩm
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
          <div className="w-full self-stretch inline-flex justify-between items-center mt-[10px]">
            <div className="w-[500px] inline-flex flex-col justify-start items-start gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="font-normal">Tên giảm giá</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên giảm giá"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[500px] inline-flex flex-col justify-start items-start gap-5">
              <FormField
                control={form.control}
                name="discount_percent"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="font-normal">Giảm giá (%)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="10"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="w-full self-stretch inline-flex justify-between items-center mt-[10px]">
            <div className="w-[500px] inline-flex flex-col justify-start items-start gap-5">
              <FormField
                control={form.control}
                name="start_at"
                render={({ field }) => {
                  const endAt = form.watch("end_at");

                  return (
                    <FormItem className="w-full flex flex-col">
                      <FormLabel className="font-normal">Ngày bắt đầu</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          max={endAt || undefined}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="w-[500px] inline-flex flex-col justify-start items-start gap-5">
              <FormField
                control={form.control}
                name="end_at"
                render={({ field }) => {
                  const startAt = form.watch("start_at"); 
                  return (
                    <FormItem className="w-full flex flex-col">
                      <FormLabel className="font-normal">Ngày kết thúc</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          min={startAt || undefined}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>
          <div className="w-full self-stretch inline-flex justify-between items-center mt-[10px]">
            <div className="w-[500px] inline-flex flex-col justify-start items-start gap-5">
              <FormField
                control={form.control}
                name="product_type_id"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="font-normal">Loại sản phẩm</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập ID loại sản phẩm"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Button */}
          <div className="w-full self-stretch inline-flex flex-col justify-start items-end gap-5 overflow-hidden mt-[15px]">
            <div className="inline-flex justify-start items-start gap-[29px]">
              <div className="relative">
                <LogOut className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" />
                <Button variant={"secondary"} className="pl-12" type="button">
                  <Link href="/admin/coupon" className="text-white">
                    Thoát
                  </Link>
                </Button>
              </div>
              <div className="relative">
                <Save className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" />
                <Button className="pl-12" type="submit">
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
