"use client"; 
import { ReactNode } from "react";
import { Phone, MapPin, Mail } from "lucide-react";

interface ClientLayoutProps {
    children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) { 
    return (
        <div className="w-full min-h-screen flex flex-col bg-white">
            {/* Body */}
            <main>
                {children}
            </main>
            {/* Footer */}
            <div className="w-full bg-primary px-[30px] py-[20px] text-white flex-shrink-0">
                <div className="self-stretch flex flex-row items-center justify-start p-3xs gap-2.5">
                    <img className="w-[100px] h-[100px]" src="/logo_slogan.png" alt="Logo" />
                    <div className="self-stretch flex-1 flex flex-col items-start justify-center gap-5">
                        <div className="self-stretch relative font-medium">Mua sắm tiện lợi, tiết kiệm và xanh hơn với GoGreen - Nơi bạn tìm thấy sản phẩm chất lượng với giá tốt nhất!</div>
                    </div>
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
    );
}