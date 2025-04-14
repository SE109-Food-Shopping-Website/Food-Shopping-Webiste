"use client";

import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductType {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  images?: string[] | null;
  productType_id: number;
}

export default function PageDashboard() {
  const [categories, setCategories] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const router = useRouter();

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/client/collection/category/${categoryId}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/product-types");
        const data = await res.json();
        console.log("Categories from API:", data);
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục sản phẩm:", error);
      }
    };

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

    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex flex-row items-start justify-start py-[30px] px-[100px] gap-[60px] text-left text-white font-inter">
        {/* Sidebar Category */}
        <div className="w-[250px] rounded-[5px] bg-primary h-auto flex flex-col items-start justify-start p-5 box-border gap-5">
          <div className="self-stretch relative font-bold text-[18px]">
            Danh mục sản phẩm
          </div>
          <ScrollArea className="w-full h-auto overflow-y-auto">
            <div className="self-stretch flex flex-col items-start justify-start py-0 px-2.5 gap-5 font-semibold text-base">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`cursor-pointer flex items-center gap-2 p-2 ${
                    selectedCategory === category.id
                      ? "bg-white text-primary"
                      : "text-white"
                  }`}
                >
                  <span className="font-semibold truncate whitespace-nowrap overflow-hidden">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Product Grid */}
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
  );
}