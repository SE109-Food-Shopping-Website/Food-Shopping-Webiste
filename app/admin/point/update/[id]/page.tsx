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
  min_point: z
    .string()
    .regex(/^\d+$/, "Giá trị phải là số")
    .transform((val) => parseFloat(val)),
  max_promotion: z
    .string()
    .regex(/^\d+$/, "Giá trị đơn hàng tối thiểu phải là số")
    .transform((val) => parseFloat(val)),
  max_discount: z
    .string()
    .regex(/^\d+$/, "Giảm tối đa phải là số")
    .transform((val) => parseFloat(val)),
  discount_percent: z
    .string()
    .regex(/^\d+$/, "Phần trăm giảm giá phải là số")
    .transform((val) => parseFloat(val)),
});

export default function updatePoint() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      min_point: 0,
      max_promotion: 0,
      max_discount: 0,
      discount_percent: 0,
    },
  });

  useEffect(() => {
    if (!id) return;

    fetch(`/api/point/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Lỗi: " + data.error);
        } else {
          form.reset({
            name: data.name,
            min_point: data.min_point.toString(),
            max_promotion: data.max_promotion.toString(),
            max_discount: data.max_discount.toString(),
            discount_percent: data.discount_percent.toString(),
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
    fetch(`/api/point/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        min_point: values.min_point, // Gửi giá trị phần trăm dưới dạng số
        max_promotion: values.max_promotion,
        max_discount: values.max_discount,
        discount_percent: values.discount_percent,
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
          router.push("/admin/point");
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
        Đơn hàng / Thứ hạng / Danh sách
      </div>
      <div className="relative justify-start text-[#5cb338] text-base font-bold font-['Inter'] mt-[10px]">
        Thông tin thứ hạng
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
                    <FormLabel className="font-normal">Tên thứ hạng</FormLabel>
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
                      <Input {...field} />
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
                name="min_point"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="font-normal">
                      Điểm tối thiểu
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
                name="max_promotion"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="font-normal">
                      Số mã tối đa được giảm
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

          <div className="w-full self-stretch inline-flex justify-between items-center mt-[10px]">
            <div className="w-[500px] inline-flex flex-col justify-start items-start gap-5">
              <FormField
                control={form.control}
                name="max_discount"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="font-normal">
                      Giảm giá tối đa
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

          {/* Button */}
          <div className="w-full self-stretch self-stretch inline-flex flex-col justify-start items-end gap-5 overflow-hidden mt-[15px]">
            <div className="inline-flex justify-start items-start gap-[29px]">
              <div className="relative">
                <LogOut className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" />
                <Button variant={"secondary"} className="pl-12" type="button">
                  <Link href="/admin/point" className="text-white">
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
