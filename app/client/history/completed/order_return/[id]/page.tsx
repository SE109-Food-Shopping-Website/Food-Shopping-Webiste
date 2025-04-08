"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { ChevronDown} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  reason: z.string().min(1, "Hãy chọn lý do"),
  description: z.string().min(1, "Hãy nhập mô tả"),
  img_links: z.string().array(),
  date: z.string().min(1, "Hãy chọn thời gian"),
  address: z.string().min(1, "Hãy nhập địa chỉ"),
});

export default function PageOrderReturn() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        reason: "",
        description: "",
        img_links: [],
        date: "",
        address: "",
        },
    });

    const [selectedReason, setSelectedReason] = useState("Chọn lý do trả hàng");

    function handleSelectReason(reason: string) {
        setSelectedReason(reason);
        form.setValue("reason", reason);
    }

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files) return;

        const links: string[] = [];
        for (let i = 0; i < files.length; i++) {
        // giả lập tạo đường dẫn ảnh
        links.push(URL.createObjectURL(files[i]));
        }

    form.setValue("img_links", links);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form data:", values);
  }

  return (
    <div className="w-[1240px] relative overflow-hidden flex flex-col items-start justify-start text-left text-black font-inter gap-[10px]">
        <div className="self-stretch overflow-hidden flex flex-row items-start justify-center text-[25px]">
            <b className="relative">Yêu cầu Trả hàng/Hoàn tiền</b>
        </div>
        <div className="self-stretch rounded-[5px] flex flex-col items-start justify-start px-[20px] gap-2.5">
            <div className="self-stretch rounded-3xs flex flex-row items-center justify-between flex-wrap content-center p-3xs gap-x-0 gap-y-[273px]">
                <div className="w-auto flex flex-row items-center justify-between gap-1.5">
                    <Image
                        src={"/ava.png"}
                        alt="Product Image"
                        width={100}
                        height={100}
                        className="object-cover rounded-md"
                    />
                    <div className="w-[183px] flex flex-col items-start justify-start gap-2.5">
                        <b className="self-stretch relative leading-[20px]">Cà rốt</b>
                        <div className="self-stretch relative text-lg leading-[20px] font-medium">Phân loại: màu trắng</div>
                            <div className="self-stretch relative text-base leading-[20px] text-darkslategray-100">x 1</div>
                        </div>
                </div>
                <div className="flex flex-col items-start justify-center text-base text-darkslategray-200">
                        <div className="relative [text-decoration:line-through] leading-[20px] font-medium">50.000đ</div>
                            <b className="relative text-[18px] text-black">40.000đ</b>
                </div>
            </div>
            <div className="self-stretch rounded-[5px] bg-white flex flex-col items-start justify-start py-[10px] gap-2.5">
                <div className="self-stretch flex flex-row items-start justify-between gap-0">
                    <div className="relative leading-[130%] font-medium">Tạm tính</div>
                        <b className="relative text-[16px] leading-[130%]">140.000đ</b>
                    </div>
                    <div className="self-stretch flex flex-row items-start justify-between gap-0">
                        <div className="relative leading-[130%] font-medium">Phí ship</div>
                        <b className="relative leading-[130%]">30.000đ</b>
                    </div>
                    <div className="self-stretch flex flex-row items-start justify-between gap-0">
                        <div className="relative leading-[130%] font-medium">Giảm giá</div>
                        <b className="relative leading-[130%]">10.000đ</b>
                    </div>
                    <div className="self-stretch flex flex-row items-start justify-between gap-0 text-[18px]">
                        <b className="relative leading-[130%]">Tổng cộng</b>
                        <b className="relative leading-[130%] text-primary">160.000đ</b>
                        </div>
            </div>
        </div>
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[1240px] mx-auto p-4 space-y-4 text-black">
                {/* Dropdown lý do */}
                <div>
                <FormField
                    control={form.control}
                    name="reason"
                    render={() => (
                    <FormItem>
                        <FormLabel>Lý do trả hàng</FormLabel>
                        <DropdownMenu>
                        <DropdownMenuTrigger className="w-full border border-gray-300 rounded px-4 py-2 flex justify-between items-center">
                            <span>{selectedReason}</span>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[1200px]">
                            {["Sai sản phẩm", "Hỏng hóc", "Không đúng mô tả"].map((item) => (
                            <DropdownMenuItem key={item} onClick={() => handleSelectReason(item)}>
                                {item}
                            </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                        </DropdownMenu>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
                {/* Mô tả */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Mô tả lỗi sản phẩm</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Nhập mô tả lý do hoàn trả..."
                            className="h-28 resize-none"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Upload hình ảnh */}
                <FormField
                    control={form.control}
                    name="img_links"
                    render={() => (
                        <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium">Hình ảnh sản phẩm</FormLabel>
                        <FormControl>
                            <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="text-sm file:text-sm file:font-medium file:bg-primary file:text-white 
                                        file:py-2 file:px-4 file:rounded-md file:border-none
                                        focus:outline-none focus:ring-0 focus:border-transparent 
                                        bg-transparent w-full"
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                {/* Ngày nhận */}
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => {
                        const today = new Date().toISOString().split("T")[0]; // format yyyy-mm-dd
                        return (
                        <FormItem className="space-y-2 flex flex-col">
                            <FormLabel className="text-sm font-medium text-gray-700">Thời gian nhận hàng</FormLabel>
                            <FormControl>
                            <input
                                type="date"
                                {...field}
                                min={today}
                                className="w-[150px] h-10 px-3 py-2 text-sm rounded-md border border-primary 
                                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                                        transition duration-200"
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        );
                    }}
                />
                {/* Địa điểm */}
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Địa chỉ nhận hàng</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Nhập địa chỉ nhận hàng"
                            className="h-14 resize-none"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Submit */}
                <div className="self-stretch overflow-hidden flex flex-row items-start justify-center p-3xs text-white">
                    <Button type="submit" variant="default" className="rounded-[5px] w-[250px] h-[50px] flex items-center justify-center text-lg font-bold">
                        GỬI YÊU CẦU
                    </Button>
                </div>
            </form>
        </FormProvider>
    </div>
  );
}