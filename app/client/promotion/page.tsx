"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Product{
    id: number;
    name: string;
    price: number;
    images?: string[] | null;
    productType_id: number;
}

export default function PagePromotion() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
              const res = await fetch("/api/products");
          
              if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
              }
          
              const text = await res.text();
              if (!text) {
                console.warn("Response từ /api/products rỗng");
                return;
              }
          
              const data = JSON.parse(text);
          
              const processed = data.map((item: any) => ({
                ...item,
                images: item.images ? JSON.parse(item.images) : null,
              }));
          
              setProducts(processed);
            } catch (error) {
              console.error("Lỗi khi lấy sản phẩm:", error);
            }
        };  
        fetchProducts();
    }, []);
    return (
        <div className="min-h-screen w-full flex items-start justify-center py-[30px] bg-gray-50 text-black font-inter">
            <div className="w-[1240px] flex flex-col items-start gap-6">
                <div className="w-full flex flex-col items-center gap-2.5">
                    <div className="text-[25px] font-bold">Chương trình khuyến mãi</div>
                </div>
                <div className="w-full p-5 rounded-[10px] shadow-md bg-white flex flex-col gap-5">
                    <div>
                        <span className="text-[20px] font-bold">Giảm giá khung giờ vàng</span>
                        <span className="text-xl font-bold">: </span>
                        <span className="text-lime-600 text-[25px] font-bold">18h-19h</span>
                        <span className="text-[20px] font-bold"> hằng ngày</span>
                    </div>
                    <div className="self-stretch flex-1 flex flex-col items-start justify-start gap-[30px] text-black">
                        <div className="flex flex-wrap gap-10">
                            {products.map((product) => {
                            console.log("Rendering product:", product);
                            return (
                                <Link
                                key={product.id}
                                href={`/client/detail/${product.id}`}
                                className="w-[200px] flex flex-col gap-2.5 cursor-pointer"
                                >
                                <div className="w-full h-[200px] border-primary border-[3px] flex items-center justify-center rounded-md overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        width={150}
                                        height={150}
                                        className="object-cover"
                                    />
                                    ) : (
                                    <span className="text-gray-500">Không có ảnh</span>
                                    )}
                                </div>
                                <div className="w-full flex flex-col px-2.5 gap-2.5">
                                    <span className="font-semibold truncate whitespace-nowrap overflow-hidden">
                                    {product.name}
                                    </span>
                                    <b className="text-base text-primary">
                                    {product.price.toLocaleString()}đ
                                    </b>
                                </div>
                                </Link>
                            );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}