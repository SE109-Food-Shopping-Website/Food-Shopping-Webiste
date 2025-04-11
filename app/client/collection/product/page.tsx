"use client";

import Link from "next/link";
import React, {useState, useEffect} from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ProductType {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  images?: string[] | null;
  productTypeId: number;
}

export default function PageProduct() {
  const [categories, setCategories] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredProducts = selectedCategory
  ? products.filter((p) => p.productTypeId === selectedCategory)
  : products;

  const fetchProducts = async (categoryId: number | null = null) => {
    try {
      const url = categoryId
        ? `/api/products?categoryId=${categoryId}`
        : `/api/products`;
    
      const res = await fetch(url);
    
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    
      const text = await res.text();
      if (!text) {
        console.warn("Response từ /api/products rỗng");
        return;
      }
    
      const data = JSON.parse(text);
      console.log("Products from API:", data);
    
      if (Array.isArray(data)) {
        const processed = data.map((item: any) => ({
          ...item,
          images: item.images ? JSON.parse(item.images) : null,
        }));
        setProducts(processed);
      } else {
        throw new Error("Dữ liệu không hợp lệ từ API products");
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
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
  
      fetchCategories();
      fetchProducts();
    }, []);
  
  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* Body */}
      <div className="flex-1 flex flex-row items-start justify-start py-[30px] px-[100px] gap-[60px] text-left text-white font-inter">
        {/* Left */}
        <div className="w-auto rounded-[5px] bg-primary h-auto flex flex-col items-start justify-start p-5 box-border gap-5">
          {/* Price */}
          <div className="self-stretch relative font-bold text-[16px]">Giá</div>
          <RadioGroup className="space-y-3">
            <div className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm cursor-pointer hover:bg-gray-100">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one" className="text-black">1.000đ - 2.000đ</Label>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm cursor-pointer hover:bg-gray-100">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two" className="text-black">2.000đ - 5.000đ</Label>
            </div>
          </RadioGroup>
          <div className="w-full h-[1px] bg-gray-300 opacity-80 rounded-full"></div>
          {/* Product Type */}
          <div className="self-stretch relative font-bold text-[16px]">Loại sản phẩm</div>
          <RadioGroup
              className="space-y-3"
              value={selectedCategory !== null ? selectedCategory.toString() : "all"}
              onValueChange={(value) => {
                const selected = value === "all" ? null : Number(value);
                setSelectedCategory(selected);
                fetchProducts(selected); 
              }}
            >
              <div className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm cursor-pointer hover:bg-gray-100">
                <RadioGroupItem value="all" id="category-all" />
                <Label htmlFor="category-all" className="text-black">Tất cả</Label>
              </div>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm cursor-pointer hover:bg-gray-100"
                >
                  <RadioGroupItem value={category.id.toString()} id={`category-${category.id}`} />
                  <Label htmlFor={`category-${category.id}`} className="text-black">
                    {category.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
        </div>
        {/* Right */}
        <div className="self-stretch flex-1 flex flex-col items-start justify-start text-black">
          <h1 className="text-2xl font-bold p-2">Tất cả sản phẩm</h1>
          <div className="flex flex-wrap gap-10">
            {filteredProducts.map((product) => (
              <Link
              key={product.id}
              href={`/client/detail/${product.id}`} 
              className="w-[200px] flex flex-col gap-2.5 cursor-pointer"
            >
              <div key={product.id} className="w-[200px] flex flex-col gap-2.5">
                <div className="w-full h-[200px] border-primary border-[3px] flex items-center justify-center rounded-md">
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
                  <span className="font-semibold">{product.name}</span>
                  <b className="text-base text-primary">
                    {product.price.toLocaleString()}đ
                  </b>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}