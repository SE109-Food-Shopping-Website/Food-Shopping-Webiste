"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  reason: z.string().min(1, "Hãy chọn lý do"),
});

export default function PageOrderCancel() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          reason: "",
        },
    });
    const [selectedReason, setSelectedReason] = useState("Chọn lý do hủy đơn hàng");
    
      function handleSelectReason(reason: string) {
        setSelectedReason(reason);
        form.setValue("reason", reason);
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <div className="w-[1240px] relative overflow-hidden flex flex-col items-start justify-start text-left text-black font-inter gap-[10px]">
            <div className="self-stretch overflow-hidden flex flex-row items-start justify-center text-[25px]">
                <b className="relative">Yêu cầu Hủy đơn</b>
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
                                    <FormLabel>Lý do hủy đơn hàng</FormLabel>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="w-full border border-gray-300 rounded px-4 py-2 flex justify-between items-center">
                                            <span>{selectedReason}</span>
                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-[1200px]">
                                            {["Không có nhu cầu mua nữa ", "Đặt nhầm", "Hết hàng" ,"Lý do khác"].map((item) => (
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
                </form>
            </FormProvider>
            <div className="self-stretch overflow-hidden flex flex-row items-start justify-center p-3xs text-white">
                <Button variant="default" className="rounded-[5px] w-[300px] h-[50px] flex items-center justify-center text-lg font-bold">
                    GỬI YÊU CẦU     
                </Button>
            </div>
        </div>
    );
}

