"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Coupon {
    end_at: string;
}

interface ProductType {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    images?: string[] | null;
    productType: ProductType;
    productType_id: number;
    salePrice: number;
    coupon: Coupon;
}

export default function PagePromotion() {
    const [groupedProducts, setGroupedProducts] = useState<
        Record<number, { productType: ProductType; coupon: Coupon; products: Product[] }>
    >({});

    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products/promotion");

            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

            const text = await res.text();
            if (!text) {
            console.warn("Response rỗng từ /api/products/promotion");
            return;
            }

            const data: Product[] = JSON.parse(text);

            const grouped: Record<number, { productType: ProductType; coupon: Coupon; products: Product[] }> = {};

            for (const item of data) {
            const groupId = item.productType.id;
            if (!grouped[groupId]) {
                grouped[groupId] = {
                productType: item.productType,
                coupon: item.coupon,
                products: [],
                };
            }
            grouped[groupId].products.push(item);
            }

            setGroupedProducts(grouped);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm khuyến mãi:", error);
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
                {Object.values(groupedProducts).map(({ productType, coupon, products }) => (
                    <div
                        key={productType.id}
                        className="w-full p-5 rounded-[10px] shadow-md bg-white flex flex-col gap-5"
                    >
                        <div>
                            <span className="text-[18px] font-bold">Loại sản phẩm: </span>
                            <span className="text-[20px] text-primary font-bold">{productType.name}</span>
                            <span className="text-[18px] font-medium ml-2">
                                (Khuyến mãi đến:{" "}
                                <span className="text-red-500">
                                {new Date(coupon.end_at).toLocaleString()}
                                </span>
                                )
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-10">
                            {products.map((product) => (
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
                                        <div className="flex flex-row items-center gap-2.5">
                                        <b className="relative text-[16px] text-primary">
                                            {(product.salePrice ?? product.price).toLocaleString()}đ
                                        </b>
                                        {product.salePrice && product.salePrice < product.price && (
                                            <span className="text-base text-gray-500 line-through text-[13px]">
                                            {product.price.toLocaleString()}đ
                                            </span>
                                        )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}