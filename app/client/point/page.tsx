"use client"

import React from "react";

export default function PagePoint() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 text-black font-inter">
            <div className="w-[1240px] pb-[70px] flex flex-col items-start gap-6">
                <div className="w-full flex flex-col items-center gap-2.5">
                    <div className="text-[25px] font-bold">Ưu đãi khách hàng</div>
                    <div className="text-[18px]">Thể lệ đổi điểm: <span className="italic">1 điểm = 1000 đồng</span></div>
                </div>
                <div className="w-full p-5 rounded-[10px] shadow-md bg-white flex flex-col gap-4">
                    <div>
                        <span className="text-[18px]">Hạng của bạn</span>
                        <span className="text-xl font-bold">: </span>
                        <span className="text-lime-600 text-[20px] font-bold">Hạng Đồng</span>
                    </div>
                    <div>
                        <span className="text-[18px]">Điểm tích lũy:</span>
                        <span className="text-[18px] font-bold"> 1500 điểm</span>
                    </div>
                    <div>
                        <span className="text-[18px]">Cần tích lũy thêm </span>
                        <span className="text-[18px] font-bold italic">500 điểm</span>
                        <span className="text-[18px]"> nữa để lên hạng </span>
                        <span className="text-[18px] font-bold italic">Bạc</span>
                    </div>
                </div>
                <div className="w-full p-5 bg-white rounded-[10px] shadow-md flex flex-col gap-5">
                    <div className="text-lime-600 text-[20px] font-bold">Hạng Đồng <span className="text-base text-foreground">1000 điểm</span></div>
                    <div className="text-[16px]">
                        <span className="font-bold">1 </span>
                        <span>phiếu giảm giá </span>
                        <span className="font-bold">5%</span>
                        <span>, tối đa </span>
                        <span className="font-bold">100.000 đồng</span>
                    </div>

                    <div className="text-lime-600 text-[20px] font-bold">Hạng Bạc <span className="text-base text-foreground">2000 điểm</span></div>
                    <div className="text-[16px]">
                        <span className="font-bold">2 </span>
                        <span>phiếu giảm giá </span>
                        <span className="font-bold">10%</span>
                        <span>, tối đa </span>
                        <span className="font-bold">100.000 đồng</span>
                    </div>

                    <div className="text-lime-600 text-[20px] font-bold">Hạng Vàng <span className="text-base text-foreground">5000 điểm</span></div>
                    <div className="text-[16px]">
                        <span className="font-bold">3 </span>
                        <span>phiếu giảm giá </span>
                        <span className="font-bold">15%</span>
                        <span>, tối đa </span>
                        <span className="font-bold">100.000 đồng</span>
                    </div>
                </div>
            </div>
        </div>
    );
}