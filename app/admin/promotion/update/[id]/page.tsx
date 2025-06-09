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
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Tên loại sản phẩm không được để trống"),
  value: z
    .string()
    .regex(/^\d+$/, "Giá trị phải là số")
    .transform((val) => parseFloat(val)),
  day_start: z.string().min(1, "Ngày bắt đầu không được để trống"),
  day_end: z.string().min(1, "Ngày kết thúc không được để trống"),
  order_min: z
    .string()
    .regex(/^\d+$/, "Giá trị đơn hàng tối thiểu phải là số")
    .transform((val) => parseFloat(val)),
  discount_max: z
    .string()
    .regex(/^\d+$/, "Giảm tối đa phải là số")
    .transform((val) => parseFloat(val)),
});

export default function updateCategory() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: 0,
      day_start: "",
      day_end: "",
      order_min: 0,
      discount_max: 0,
    },
  });

  function toDatetimeLocalString(dateString: string) {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16); // trả về "YYYY-MM-DDTHH:mm"
  }

  useEffect(() => {
    if (!id) return;

    fetch(`/api/promotion/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Lỗi: " + data.error);
        } else {
          form.reset({
            name: data.name,
            value: data.value.toString(),
            day_start: toDatetimeLocalString(data.day_start),
            day_end: toDatetimeLocalString(data.day_end),
            order_min: data.order_min.toString(),
            discount_max: data.discount_max,
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
    fetch(`/api/promotion/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        value: values.value, // Gửi giá trị phần trăm dưới dạng số
        day_start: new Date(values.day_start).toISOString(),
        day_end: new Date(values.day_end).toISOString(),
        order_min: values.order_min,
        discount_max: values.discount_max,
      }),
    })
      .then((res) => {
        // Kiểm tra mã trạng thái HTTP của phản hồi
        if (!res.ok) {
          throw new Error("Lỗi từ server: " + res.statusText);
        }
        // Kiểm tra nếu phản hồi rỗng
        if (res.status === 204) {
          throw new Error("Server không trả về dữ liệu");
        }
        return res.json(); // Chỉ gọi .json() khi có dữ liệu hợp lệ
      })
      .then((data) => {
        if (data.error) {
          alert("Lỗi: " + data.error);
        } else {
          toast.success("Cập nhật thành công");
          form.reset(); // Reset form về giá trị mặc định
          router.push("/admin/promotion");
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
        Đơn hàng / Khuyến mãi / Cập nhật
      </div>
      <div className="relative justify-start text-[#5cb338] text-base font-bold font-['Inter'] mt-[10px]">
        Thông tin khuyến mãi
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
                    <FormLabel className="font-normal">
                      Tên khuyến mãi
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
                name="value"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="font-normal">
                      Giá trị khuyến mãi
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Ngày bắt đầu & Ngày kết thúc */}
          <div className="w-full self-stretch inline-flex justify-between items-center mt-[10px]">
            {/* Ngày bắt đầu */}
            <div className="w-[500px] inline-flex flex-col justify-start items-start gap-5">
              <FormField
                control={form.control}
                name="day_start"
                render={({ field }) => {
                  const endAt = form.watch("day_end");

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

            {/* Ngày kết thúc */}
            <div className="w-[500px] inline-flex flex-col justify-start items-start gap-5">
              <FormField
                control={form.control}
                name="day_end"
                render={({ field }) => {
                  const startAt = form.watch("day_start");

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
                name="order_min"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="font-normal">
                      Giá trị đơn hàng tối thiểu
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
                name="discount_max"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="font-normal">Giảm tối đa</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                  <Link href="/admin/promotion" className="text-white">
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
