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
import {User, ShoppingCart, Search, ChevronDown} from "lucide-react";  
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { CartProvider } from "./context/CartContext";

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
    const [query, setQuery] = useState("");
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Tìm kiếm:", query);
    };

    useEffect(() => {
        const fetchCategories = async () => {
          try {
            const res = await fetch("/api/product-types");
    
            if (!res.ok) {
              throw new Error(`HTTP error! Status: ${res.status}`);
            }
    
            const text = await res.text();
            if (!text) {
              console.warn("⚠️ Response từ /api/product-types rỗng");
              return;
            }
    
            const data = JSON.parse(text);
            if (Array.isArray(data)) {
              setCategories(data);
            } else {
              throw new Error("Dữ liệu trả về không hợp lệ");
            }
          } catch (error) {
            console.error("❌ Lỗi khi lấy danh mục sản phẩm:", error);
          }
        };
    
        fetchCategories();
    }, []);

    return (  
        <div className="w-full h-full min-h-screen flex flex-col jutify-start items-start inline-flex gap-[0px]">
            {/* Heading */}
            <div className="w-full h-15 px-[30px] py-2.5 bg-white border-b border-black/20 justify-between items-center inline-flex overflow-hidden">
                {/* Left */}
                <div className="h-[40px] justify-start items-center inline-flex gap-5">
                    <img className="w-[170px] h-[60px]" src="/logo_left.png" alt="Logo" />
                </div>
                {/* Between */}
                <div className="w-[600px] relative rounded-[10px] bg-white border border-gray-300 h-10 flex flex-row items-center p-2 text-[14px] text-black font-inter">
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
                    <form onSubmit={handleSearch} className="flex flex-1 items-center ">
                        <input 
                            value={query} 
                            onChange={(e) => setQuery(e.target.value)} 
                            placeholder="Tìm kiếm" 
                            className="w-full h-full px-2 text-[16px] text-gray-700 border-none outline-none placeholder-gray-400" 
                        />
                        <Button type="submit" className="w-[50px] rounded-[5px] h-[30px] flex items-center justify-center">
                            <Search className="text-white w-5 h-5" />
                        </Button>
                    </form>
                </div>
                {/* Right */}
                <div className="h-[50px] justify-end items-center inline-flex gap-5">
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
                    href="/client/"
                    className={`px-3 py-1 rounded-md transition-colors ${
                        pathname === "/client/"
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
                    href="/client/"
                    className={`px-3 py-1 rounded-md transition-colors ${
                        pathname === "/client/"
                            ? "bg-primary text-white font-bold"
                            : "text-white hover:text-accent"
                    }`}
                >
                    ĐIỂM TÍCH LŨY
                </Link>
            </nav>
            {/* Main Content */}
            <CartProvider>
                <main className="w-full flex-1 overflow-y-auto">
                    {children}
                </main>
            </CartProvider>
        </div>
    );
}