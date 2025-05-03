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
  min_point: z
    .string()
    .regex(/^\d+$/, "Điểm tối thiểu phải là số")
    .transform((val) => parseFloat(val)),
  max_promotion: z
    .string()
    .regex(/^\d+$/, "Giá trị tối đa phải là số")
    .transform((val) => parseFloat(val)),
  max_discount: z
    .string()
    .regex(/^\d+$/, "Giá trị tối đa phải là số")
    .transform((val) => parseFloat(val)),
});

export default function AddCoupon() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      min_point: 0,
      max_promotion: 0,
      discount_percent: 0,
      max_discount: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch("/api/admin/point", {
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
        Đơn hàng / Thứ hạng / Thêm mới
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
                      <Input
                        placeholder="Nhập tên thứ hạng"
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
                name="min_point"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="font-normal">
                      Điểm tối thiểu
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1000"
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
                name="max_promotion"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="font-normal">
                      Số mã tối đa được giảm
                    </FormLabel>
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
                name="max_discount"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="font-normal">
                      Giảm giá tối đa
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1000"
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
