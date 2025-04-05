"use client";

import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

interface ProductType {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  images?: string;
  productTypeId?: number;
}

const mockCategories: ProductType[] = [
    { id: 1, name: "Rau củ quả"},
    { id: 2, name: "Sữa" },
    { id: 3, name: "Trứng" },
];
  
const mockProducts: Product[] = [
    { id: 1, name: "Rau chân vịt", price: 4000, images: "/spinach_3.jpg", productTypeId: 1 },
    { id: 2, name: "Súp lơ", price: 3500, images: "/cauli.png", productTypeId: 1 },
    { id: 3, name: "Sữa milo", price: 45000, images: "/milo_3.jpg", productTypeId: 2 },
    { id: 4, name: "Sữa TH True Milk", price: 50000, images: "/truemilk.jpg", productTypeId: 2 },
    { id: 5, name: "Trứng gà", price: 25000, images: "/egg.jpg", productTypeId: 3 },
    { id: 6, name: "Trứng vịt", price: 20000, images: "/duck.jpg", productTypeId: 3 },
];

const categoryIcons: Record<number, string> = {
  1: "/spinach_3.jpg",
  2: "/truemilk.jpg",
  3: "/duck.jpg",
};

export default function PageDashboard() {
  const [categories, setCategories] = useState<ProductType[]>(mockCategories);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const router = useRouter();
  const handleCategoryClick = (categoryId: number) => {
    router.push(`/client/collection/category/${categoryId}`);
  };

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const res = await fetch("/api/product-types");
  //       if (!res.ok) {
  //         throw new Error(`HTTP error! Status: ${res.status}`);
  //       }
  //       const text = await res.text(); 
  //       if (!text) {
  //         throw new Error("Empty response from server");
  //       }
  //       const data = JSON.parse(text); 
  //       if (Array.isArray(data)) {
  //         setCategories(data);
  //       } else {
  //         throw new Error("Invalid JSON format");
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi lấy danh mục sản phẩm:", error);
  //     }
  //   };
  
  //   const fetchProducts = async () => {
  //     try {
  //       const res = await fetch("/api/products");
  //       if (!res.ok) {
  //         throw new Error(`HTTP error! Status: ${res.status}`);
  //       }
  //       const text = await res.text();
  //       if (!text) {
  //         throw new Error("Empty response from server");
  //       }
  //       const data = JSON.parse(text);
  //       if (Array.isArray(data)) {
  //         setProducts(data);
  //       } else {
  //         throw new Error("Invalid JSON format");
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi lấy sản phẩm:", error);
  //     }
  //   };
  
  //   fetchCategories();
  //   fetchProducts();
  // }, []);  

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* Body */}
      <div className="flex-1 flex flex-row items-start justify-start py-[30px] px-[100px] gap-[60px] text-left text-white font-inter">
        {/* Left */}
        <div className="w-auto rounded-[5px] bg-primary h-auto flex flex-col items-start justify-start p-5 box-border gap-5">
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
                  selectedCategory === category.id ? "bg-white text-primary" : "text-white"
                }`}
              >
                <img src={categoryIcons[category.id] || "/ava.png"} alt={category.name} className="w-6 h-6" />
                {category.name}
              </div>
            ))}
            </div>
          </ScrollArea>
        </div>
        {/* Right */}
        <div className="self-stretch flex-1 flex flex-col items-start justify-start gap-[30px] text-black">
          <div className="flex flex-wrap gap-10">
            {products.map((product) => (
              <div key={product.id} className="w-[200px] flex flex-col gap-2.5">
                <div className="w-full h-[200px] border-primary border-[3px] flex items-center justify-center rounded-md">
                  <img
                    className="w-auto h-auto"
                    src={product.images || "/ava.png"}
                    alt={product.name}
                  />
                </div>
                <div className="w-full flex flex-col px-2.5 gap-2.5">
                  <span className="font-semibold">{product.name}</span>
                  <b className="text-base text-primary">
                    {product.price.toLocaleString()}đ
                  </b>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}