"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
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

const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  address: z.string(),
});

export default function updateProvider() {
  const router = useRouter();
  const { id } = useParams(); // Lấy ID từ URL
  const [loading, setLoading] = useState(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
    },
  });

  useEffect(() => {
    if (!id) return;

    fetch(`/api/provider/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Lỗi: " + data.error);
        } else {
          form.reset({
            name: data.name,
            address: data.address,
            email: data.email,
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
    console.log("Submitting form with values:", values);
    fetch(`/api/provider/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name: values.name,
        address: values.address,
        email: values.email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Lỗi: " + data.error);
        } else {
          alert("Cập nhật thành công!");
          router.push("/admin/manage/provider");
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
        Trung tâm / Quản lý / Nhà cung cấp
      </div>
      <div className="relative justify-start text-[#5cb338] text-base font-bold font-['Inter'] mt-[10px]">
        Thông tin nhà cung cấp
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
                  <FormItem className="w-full">
                    <FormLabel className="font-normal">
                      Tên nhà cung cấp
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
                name="address"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-normal">
                      Địa chỉ nhà cung cấp
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
            <div className="w-[500px] flex flex-col justify-start items-start gap-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-normal">
                      Email nhà cung cấp
                    </FormLabel>
                    <FormControl>
                      <Input className="h-[60px]" {...field} />
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
                  <Link href="/admin/manage/provider" className="text-white">
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
