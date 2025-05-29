"use client";

import { ReactNode } from "react";
import React, { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {User, ShoppingCart, ChevronDown} from "lucide-react";  
import { Toaster } from "@/components/ui/sonner";
import { useRouter, usePathname} from "next/navigation";
import { CartProvider } from "./context/CartContext";
import SearchBar from "@/components/ui/searchbar";
import ChatWidget from "@/components/ui/chatbot";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface ClientLayoutProps {
    children: ReactNode;
}

interface ProductType {
    id: number;
    name: string;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const pathname = usePathname();
    const [categories, setCategories] = useState<ProductType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("Danh mục sản phẩm");
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
          try {
            const res = await fetch("/api/product-types");
    
            if (!res.ok) {
              throw new Error(`HTTP error! Status: ${res.status}`);
            }
    
            const text = await res.text();
            if (!text) {
              console.warn("Response từ /api/product-types rỗng");
              return;
            }
    
            const data = JSON.parse(text);
            if (Array.isArray(data)) {
              setCategories(data);
            } else {
              throw new Error("Dữ liệu trả về không hợp lệ");
            }
          } catch (error) {
            console.error("Lỗi khi lấy danh mục sản phẩm:", error);
          }
        };
    
        fetchCategories();
    }, []);

    return (  
        <div className="w-full h-full min-h-screen flex flex-col jutify-start items-start inline-flex gap-[0px]">
            {/* Heading */}
            <div className="w-full h-15 px-[30px] py-2.5 bg-white border-b border-black/20 justify-between items-center inline-flex overflow-visible">
                {/* Left */}
                <div className="h-[40px] justify-start items-center inline-flex gap-5">
                    <img className="w-[170px] h-[60px]" src="/logo_left.png" alt="Logo" />
                </div>
                {/* Between */}
                <div className="w-[600px] relative z-[9999] rounded-[10px] bg-white border border-gray-300 h-10 flex flex-row items-center p-2 text-[14px] text-black font-inter">
                    {/* Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-[170px] flex justify-between items-center px-2 text-gray-700 py-1">
                            <span className="font-medium truncate">{selectedCategory}</span>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[170px]" align="start">
                            {categories.map((item) => (
                            <DropdownMenuItem
                                key={item.id}
                                onClick={() => setSelectedCategory(item.name)}
                            >
                                {item.name}
                            </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <span className="w-[1px] h-5 bg-gray-300 mx-2"></span>
                    <SearchBar selectedCategory={selectedCategory}/>
                </div>
                {/* Right */}
                <div className="h-[50px] justify-end items-center inline-flex gap-5">
                    <ChatWidget/>
                    <Link href="/client/profile">
                        <div title="Profile">
                            <User/>
                        </div>
                    </Link>
                    <Link href="/client/cart">  
                        <div title="Giỏ hàng">
                            <ShoppingCart />
                        </div>
                    </Link>
                </div>
            </div>
            {/* Menu */}
            <nav className="items-center space-x-4 p-1 w-full relative bg-primary h-[50px] flex flex-row justify-between py-0 px-[100px] box-border gap-0 text-left text-[16px] font-bold font-inter justify-center">
                <Link
                    href="/client/collection/dashboard"
                    className={`px-3 py-1 rounded-md transition-colors ${
                        pathname === "/client/collection/dashboard"
                            ? "bg-primary text-white font-bold"
                            : "text-white hover:text-accent"
                    }`}
                >
                    TRANG CHỦ
                </Link>
                <Link
                    href="/client/collection/product"
                    className={`px-3 py-1 rounded-md transition-colors ${
                        pathname === "/client/collection/product"
                            ? "bg-primary text-white font-bold"
                            : "text-white hover:text-accent"
                    }`}
                >
                    TẤT CẢ SẢN PHẨM
                </Link>
                <Link
                    href="/client/promotion"
                    className={`px-3 py-1 rounded-md transition-colors ${
                        pathname === "/client/promotion"
                            ? "bg-primary text-white font-bold"
                            : "text-white hover:text-accent"
                    }`}
                >
                    KHUYẾN MÃI
                </Link>
                <Link
                    href="/client/history/unprepared"
                    className={`px-3 py-1 rounded-md transition-colors ${
                        pathname === "/client/history/unprepared"
                            ? "bg-primary text-white font-bold"
                            : "text-white hover:text-accent"
                    }`}
                >
                    LỊCH SỬ MUA HÀNG
                </Link>
                <Link
                    href="/client/point"
                    className={`px-3 py-1 rounded-md transition-colors ${
                        pathname === "/client/point"
                            ? "bg-primary text-white font-bold"
                            : "text-white hover:text-accent"
                    }`}
                >
                    ĐIỂM TÍCH LŨY
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div
                        className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors cursor-pointer ${
                            pathname.startsWith("/client/rating")
                            ? "bg-primary text-white font-bold"
                            : "text-white hover:text-accent"
                        }`}
                        >
                        ĐÁNH GIÁ SẢN PHẨM
                        <ChevronDown size={16} />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[200px]">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/client/rating/my")}>
                        Đánh giá của tôi
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/client/rating/all")}>
                        Tất cả đánh giá
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>
            {/* Main Content */}
            <CartProvider>
                <main className="w-full flex-1 overflow-y-auto">
                    {children}
                    <Toaster
                        position="top-right" 
                        richColors 
                        duration={5000} 
                        closeButton 
                    />
                </main>
            </CartProvider>
        </div>
    );
}