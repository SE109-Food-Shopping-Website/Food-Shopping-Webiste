import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus } from "lucide-react";
import React from "react";
import Image from "next/image";
import { productData } from "./data/product-data";

export default function pageProduct() {
  return (
    <div className="relative justify-start text-black text-base font-normal font-['Inter']">
      Trung tâm / Quản lý / Sản phẩm
      <div className="w-full p-2.5 bg-white rounded-[10px] inline-flex justify-between items-center overflow-hidden">
        <Input placeholder="Tìm theo ID, Tên, Email hoặc Địa chỉ..."></Input>
        <Button>
          <CirclePlus />
          Thêm sản phẩm
        </Button>
      </div>
      {/* Danh sách sản phẩm */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {productData.map((product) => (
          <div key={product.id} className="flex flex-col items-center">
            <Image
              src={product.img_links[0]}
              alt={product.name}
              width={150}
              height={150}
              className="rounded-lg"
            />
            <p className="mt-2 text-center">{product.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
