import React from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {Phone, MapPin, Mail} from "lucide-react";

export default function pageDashboard() {
    return (
        <div className="w-full min-h-screen flex flex-col bg-white">
            {/* Body */}
            <div className="flex-1 flex flex-row items-start justify-start py-[30px] px-[100px] gap-[60px] text-left text-white font-inter">
                {/* Left */}
                <div className="w-auto rounded-[5px] bg-primary h-auto flex flex-col items-start justify-start p-5 box-border gap-5">
                    <div className="self-stretch relative font-bold text-[18px]">Danh mục sản phẩm</div>
                    <ScrollArea className="w-full">
                        <div className="self-stretch flex flex-col items-start justify-start py-0 px-2.5 gap-5 text-base">
                            {Array(4)
                            .fill("Rau củ quả")
                            .map((item, index) => (
                                <div
                                key={index}
                                className="self-stretch flex flex-row items-start justify-start gap-2.5"
                                >
                                <div className="w-5 flex flex-row items-center justify-start">
                                    <img
                                    className="grow shrink basis-0 self-stretch"
                                    src="/ava.png"
                                    alt="product logo"
                                    />
                                </div>
                                <div className="relative font-semibold">{item}</div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                {/* Right */}
                <div className="self-stretch flex-1 flex flex-col items-start justify-start gap-[30px] text-black">
                    <b className="relative text-[20px]">Rau củ quả</b>
                    <div className="flex flex-wrap gap-10">
                        {Array(18).fill(null).map((_, index) => (
                            <div key={index} className="w-[200px] flex flex-col gap-2.5">
                                <div className="w-full h-[200px] border-primary border-[3px] flex items-center justify-center rounded-md">
                                    <img className="w-auto h-auto" src="/ava.png" alt="Product Imagge" />
                                </div>
                                <div className="w-full flex flex-col px-2.5 gap-2.5">
                                    <span className="font-semibold">Cà rốt</span>
                                    <b className="text-base text-primary">40.000đ</b>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>  
           {/* Footer */}
           <div className="w-full bg-primary px-[30px] text-white flex-shrink-0">
                <div className="self-stretch flex flex-row items-center justify-start p-3xs gap-2.5">
                    <img className="w-[170px] h-[170px]" src="/logo_slogan.png" alt="Logo" />
                    <div className="self-stretch flex-1 flex flex-col items-start justify-center gap-5">
                    <div className="self-stretch relative font-medium">Mua sắm tiện lợi, tiết kiệm và xanh hơn với GoGreen - Nơi bạn tìm thấy sản phẩm chất lượng với giá tốt nhất!
                </div>
                <div className="self-stretch flex flex-row items-start justify-between gap-0 text-lg">
                    <div className="flex flex-row items-start justify-start p-3xs gap-2.5">
                        <div className="flex flex-col items-start justify-center gap-2.5">
                        <div className="relative text-[14px] pl-6">
                            <MapPin size={16} className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white" />
                            Địa chỉ
                        </div>
                        <b className="relative text-[16px]">123, Thủ Đức, TPHCM</b>
                        </div>
                    </div>
                    <div className="flex flex-row items-start justify-start p-3xs gap-2.5">
                        <div className="flex flex-col items-start justify-center gap-2.5">
                        <div className="relative text-[14px] pl-6">
                            <Phone size={16} className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white" />
                            Hotline
                        </div>
                        <b className="relative text-[16px]">19001234</b>
                        </div>
                    </div>
                    <div className="flex flex-row items-start justify-start p-3xs gap-2.5">
                        <div className="flex flex-col items-start justify-center gap-2.5">
                        <div className="relative text-[14px] pl-6">
                            <Mail size={16} className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white" />
                            Email
                        </div>
                        <b className="relative text-[16px]">a@gmail.com</b>
                        </div>
                    </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}