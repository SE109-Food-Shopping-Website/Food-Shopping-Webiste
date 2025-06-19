"use client"

import React, {useEffect, useState} from "react";
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

const formSchema = z
  .object({
    name: z.string().min(1, "Tên coupon không được để trống"),
    start_at: z.string().min(1, "Ngày bắt đầu không được để trống"),
    end_at: z.string().min(1, "Ngày kết thúc không được để trống"),
    product_type_id: z
      .string()
      .regex(/^\d+$/, "ID loại sản phẩm phải là số")
      .transform((val) => parseInt(val, 10)),
    discount_percent: z
      .string()
      .regex(/^\d+$/, "Phần trăm giảm giá phải là số")
      .transform((val) => parseFloat(val)),
  })
  .refine((data) => {
    const start = new Date(data.start_at);
    const end = new Date(data.end_at);
    return end >= start;
  }, {
    path: ["end_at"],
    message: "Ngày kết thúc không được nhỏ hơn ngày bắt đầu",
});

export default function UpdateCoupon() {
  const router = useRouter();
  const { id } = useParams();
  const [Loading, setLoading] = useState(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      start_at: "",
      end_at: "",
      discount_percent: 0,
      product_type_id: 0,
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
  
    fetch(`/api/admin/coupon/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Lỗi: " + data.error);
        } else {
          form.reset({
            name: data.name,
            start_at: toDatetimeLocalString(data.start_at),
            end_at: toDatetimeLocalString(data.end_at),
            discount_percent: data.discount_percent.toString(),
            product_type_id: data.product_type_id.toString(),
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
    fetch(`/api/admin/coupon/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
            name: values.name,
            start_at: new Date(values.start_at).toISOString(),
            end_at: new Date(values.end_at).toISOString(),
            discount_percent: values.discount_percent,
            product_type_id: values.product_type_id,
      }),
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
        toast.success("Cập nhật thành công");
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
        Đơn hàng / Giảm sản phẩm / Cập nhật
      </div>
          <div className="relative justify-start text-[#5cb338] text-base font-bold font-['Inter'] mt-[10px]">
            Thông tin giảm giá sản phẩm
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
                        <FormLabel className="font-normal">Tên giảm giá</FormLabel>
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
                    name="discount_percent"
                    render={({ field }) => (
                      <FormItem className="w-full flex flex-col">
                        <FormLabel className="font-normal">Giảm giá (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập phần trăm giảm giá"
                            min={1} 
                            {...field} />
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
                            type="text"
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
              <div className="w-full self-stretch self-stretch inline-flex flex-col justify-start items-end gap-5 overflow-hidden mt-[15px]">
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
