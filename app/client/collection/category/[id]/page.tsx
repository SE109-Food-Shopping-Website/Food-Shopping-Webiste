"use client";

import { useParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Product {
  id: number;
  name: string;
  price: number;
  images?: string;
  productTypeId?: number;
}

const categories = [
  { id: 1, name: "Rau củ quả" },
  { id: 2, name: "Sữa" },
  { id: 3, name: "Trứng" },
];

const products: Product[] = [
  { id: 1, name: "Rau chân vịt", price: 40000, images: "/spinach_3.jpg", productTypeId: 1 },
  { id: 2, name: "Súp lơ", price: 35000, images: "/cauli.png", productTypeId: 1 },
  { id: 3, name: "Sữa milo", price: 150000, images: "/milo_3.jpg", productTypeId: 2 },
  { id: 4, name: "Sữa TH True Milk", price: 200000, images: "/truemilk.jpg", productTypeId: 2 },
  { id: 5, name: "Trứng gà", price: 25000, images: "/egg.jpg", productTypeId: 3 },
  { id: 6, name: "Trứng vịt", price: 15000, images: "/duck.jpg", productTypeId: 3 },
];

export default function CategoryPage() {
  const params = useParams();
  const categoryId = Number(params.id); 

  // Tìm tên danh mục
  const category = categories.find((c) => c.id === categoryId);
  const categoryName = category ? category.name : "Danh mục không tồn tại";

  // Lọc sản phẩm theo danh mục
  const filteredProducts = products.filter((p) => p.productTypeId === categoryId);

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
          <RadioGroup className="space-y-3">
            <div className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm cursor-pointer hover:bg-gray-100">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one" className="text-black">Rau củ quả</Label>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm cursor-pointer hover:bg-gray-100">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two" className="text-black">Sữa</Label>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm cursor-pointer hover:bg-gray-100">
              <RadioGroupItem value="option-three" id="option-three" />
              <Label htmlFor="option-three" className="text-black">Trứng</Label>
            </div>
          </RadioGroup>
        </div>
        {/* Right */}
        <div className="self-stretch flex-1 flex flex-col items-start justify-start text-black">
          <h1 className="text-2xl font-bold p-2">{categoryName}</h1>
          {/* Danh sách sản phẩm */}
          <div className="flex flex-wrap gap-10 p-2">
            {filteredProducts.map((product) => (
              <div key={product.id} className="w-[200px] flex flex-col gap-2.5">
                <div className="w-full h-[200px] border-primary border-[3px] flex items-center justify-center rounded-md">
                  <img className="w-auto h-auto" src={product.images || "/ava.png"} alt={product.name} />
                </div>
                <div className="w-full flex flex-col px-2.5 gap-2.5">
                  <span className="font-semibold">{product.name}</span>
                  <b className="text-base text-primary">{product.price.toLocaleString()}đ</b>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}