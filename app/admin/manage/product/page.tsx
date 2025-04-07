import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus, PlusCircle } from "lucide-react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import ProductList from "./components/ProductList";

export default function pageProduct() {
  return (
    <div className="relative justify-start text-black text-base font-normal font-['Inter']">
      Trung tâm / Quản lý / Sản phẩm
      <div className="w-full p-2.5 bg-white rounded-[10px] inline-flex justify-between items-center overflow-hidden">
        <Input placeholder="Tìm theo tên"></Input>
        <div className="relative">
          <PlusCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" />
          <Button className="pl-12">
            <Link href="/admin/manage/product/add">Thêm sản phẩm</Link>
          </Button>{" "}
        </div>
      </div>
      {/* Danh sách sản phẩm */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <ProductList />
      </div>
    </div>
  );
}
