import React from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function pageDashboard() {
    return (
        <div className="w-full h-full flex flex-col">
            {/* Body */}
            <div className="flex-1 flex flex-row items-start justify-start py-[30px] px-[100px] gap-[60px] text-left text-xl text-white font-inter">
                {/* Left */}
                <div className="w-auto rounded-[5px] bg-primary h-auto flex flex-col items-start justify-start p-5 box-border gap-5">
                    <div className="self-stretch relative font-semibold">Danh mục sản phẩm</div>
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
                                    alt="icon"
                                    />
                                </div>
                                <div className="relative font-semibold">{item}</div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                {/* Right */}
                <div className="self-stretch flex-1 flex flex-col items-start justify-start gap-[20px] text-[25px] text-black">
                    <b className="relative">Rau củ quả</b>
                    <div className="w-full relative flex flex-row items-center justify-start gap-[30px] text-left text-xl text-black font-inter">
                        <div className="w-[200px] flex flex-col items-start justify-start gap-2.5">
                            <div className="self-stretch rounded-[5px] border-primary border-solid border-[3px] box-border h-[200px] overflow-hidden shrink-0 flex flex-row items-start justify-start p-3xs">
                            <div className="self-stretch flex-1 flex flex-row items-center justify-center">
                            <img className="w-auto h-auto" src="/ava.png" alt="Ava" />
                            </div>
                            </div>
                            <div className="self-stretch flex flex-col items-start justify-start py-0 px-2.5 gap-2.5">
                            <div className="self-stretch relative font-semibold">Cà rốt</div>
                            <b className="self-stretch relative text-base text-primary">40.000đ</b>
                            </div>
                        </div>
                        <div className="w-[200px] flex flex-col items-start justify-start gap-2.5">
                            <div className="self-stretch rounded-[5px] border-primary border-solid border-[3px] box-border h-[200px] overflow-hidden shrink-0 flex flex-row items-start justify-start p-3xs">
                            <div className="self-stretch flex-1 flex flex-row items-center justify-center">
                            <img className="w-auto h-auto" src="/ava.png" alt="Ava" />
                            </div>
                            </div>
                            <div className="self-stretch flex flex-col items-start justify-start py-0 px-2.5 gap-2.5">
                            <div className="self-stretch relative font-semibold">Cà rốt</div>
                            <b className="self-stretch relative text-base text-primary">40.000đ</b>
                            </div>
                        </div>
                        <div className="w-[200px] flex flex-col items-start justify-start gap-2.5">
                            <div className="self-stretch rounded-[5px] border-primary border-solid border-[3px] box-border h-[200px] overflow-hidden shrink-0 flex flex-row items-start justify-start p-3xs">
                            <div className="self-stretch flex-1 flex flex-row items-center justify-center">
                            <img className="w-auto h-auto" src="/ava.png" alt="Ava" />
                            </div>
                            </div>
                            <div className="self-stretch flex flex-col items-start justify-start py-0 px-2.5 gap-2.5">
                            <div className="self-stretch relative font-semibold">Cà rốt</div>
                            <b className="self-stretch relative text-base text-primary">40.000đ</b>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
            {/* Footer */}
            <div className="w-full h-full relative bg-primary overflow-hidden flex flex-col items-start justify-start box-border text-left text-[16px] text-white font-inter">
                <div className="self-stretch flex flex-row items-center justify-start p-3xs gap-2.5">
                    <img className="w-[100px] h-[60px]" src="/logo_slogan.png" alt="Logo" />
                    <div className="self-stretch flex-1 flex flex-col items-start justify-center gap-5">
                    <div className="self-stretch relative font-medium">Mua sắm tiện lợi, tiết kiệm và xanh hơn với GoGreen - Nơi bạn tìm thấy sản phẩm chất lượng với giá tốt nhất!
                </div>
                <div className="self-stretch flex flex-row items-start justify-between gap-0 text-lg">
                    <div className="flex flex-row items-start justify-start p-3xs gap-2.5">
                        <div className="flex flex-col items-start justify-center gap-2.5">
                        <div className="relative">Địa chỉ</div>
                        <b className="relative">123, Thủ Đức, TPHCM</b>
                        </div>
                    </div>
                    <div className="flex flex-row items-start justify-start p-3xs gap-2.5">
                        <div className="flex flex-col items-start justify-center gap-2.5">
                        <div className="relative">Hotline</div>
                        <b className="relative text-gold">19001900</b>
                        </div>
                    </div>
                    <div className="flex flex-row items-start justify-start p-3xs gap-2.5">
                        <div className="flex flex-col items-start justify-center gap-2.5">
                        <div className="relative">Email</div>
                        <b className="relative">a@gmail.com</b>
                        </div>
                    </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}