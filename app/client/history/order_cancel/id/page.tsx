"use-client"

import React from "react";
import { MapPin } from "lucide-react"; 
import Image from "next/image";

export default function PageOrdeCancel() {
    return (
        <div className="w-full relative h-[1024px] bg-[#F9FAFB] overflow-hidden flex flex-col items-start justify-start text-left text-black font-inter">
            <div className="self-stretch flex-1 overflow-hidden flex flex-col items-start justify-start py-[30px] px-[100px] gap-2.5">
                <div className="self-stretch overflow-hidden flex flex-row items-start justify-center text-[25px]">
                    <b className="relative">Đơn hàng đã hủy</b>
                </div>
            <div className="self-stretch rounded-[5px] bg-white flex flex-col items-start justify-start px-[20px] py-[10px] gap-2.5">
                <b className="relative">Thông tin nhận hàng</b>
                <div className="flex flex-row items-center justify-start gap-[30px]">
                    <MapPin className="text-black" />
                <div className="relative">
                    <p className="m-0">
                        <span>
                            <span className="font-semibold font-inter">Nguyễn Văn A</span>
                        </span>
                        <span>
                            <span> 0123456789</span>
                        </span>
                    </p>
                    <p className="m-0 text-lg">
                        <span>
                        <span>123, Thủ Đức, TPHCM</span>
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <div className="self-stretch rounded-[5px] bg-white flex flex-col items-start justify-start px-[20px] py-[10px] gap-2.5">
            <div className="self-stretch rounded-3xs flex flex-row items-center justify-between flex-wrap content-center p-3xs gap-x-0 gap-y-[273px]">
                <div className="w-[346px] flex flex-row items-center justify-between gap-3">
                    <Image className="self-stretch flex-1 relative overflow-hidden object-cover" width={50} height={50} alt="" src="/ava.png" />
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
            <div className="self-stretch flex flex-col items-start justify-start py-0 px-5 gap-2.5 text-center text-base">
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
        <div className="w-[1240px] rounded-[5px] bg-white flex flex-col items-start justify-start py-2.5 px-5 box-border gap-2.5">
            <div className="self-stretch h-[50px] flex flex-row items-center justify-between gap-0">
                <div className="relative leading-[20px]">Yêu cầu bởi</div>
                <div className="relative leading-[20px]">Người mua</div>
            </div>
            <div className="self-stretch h-[50px] flex flex-row items-center justify-between gap-0">
                <div className="relative leading-[20px]">Yêu cầu vào</div>
                <div className="relative leading-[20px]">1-1-2025 17:00</div>
            </div>
            <div className="self-stretch h-[50px] flex flex-row items-center justify-between gap-0">
                <div className="relative leading-[20px]">Lý do</div>
                <div className="relative leading-[20px]">Thay đổi địa chỉ</div>
            </div>
        </div>
        </div>
        </div>
    );
}