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
  name: z.string().min(1, "Tên loại sản phẩm không được để trống"),
  percent: z
    .string()
    .regex(/^\d+$/, "Giá bán chênh lệch phải là số")
    .transform((val) => parseFloat(val)), // Chuyển đổi giá trị thành số
});

export default function addCategory() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      percent: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch("/api/product-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        priceMarginPct: values.percent, // Gửi giá trị phần trăm dưới dạng số
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
          toast.success("Thêm loại sản phẩm thành công");
          form.reset(); // Reset form về giá trị mặc định
          router.push("/admin/manage/category");
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
          {/* Tên Loại */}
          <div className="w-full self-stretch inline-flex justify-between items-center mt-[10px]">
            <div className="w-[500px] inline-flex flex-col justify-start items-start gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="font-[18px]">
                      Tên loại sản phẩm
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Rau"
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
                name="percent"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="font-normal">
                      Giá bán chênh lệch
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={100}
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
