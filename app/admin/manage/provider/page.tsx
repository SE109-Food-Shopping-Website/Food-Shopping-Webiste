import { Button } from "@/components/ui/button";
import React from "react";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";

export default function pageProvider() {
  return (
    <div className="relative justify-start text-black text-base font-normal font-['Inter']">
      Trung tâm / Quản lý / Nhà cung cấp
      <div className="w-full bg-white p-[10px] flex items-center justify-between border border-white rounded-[10px]">
        <div className="flex justify-end">
          <div className="relative">
            <Input placeholder="Tìm kiếm" className="pr-10" />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <Button>Thêm nhà cung cấp</Button>
      </div>
    </div>
  );
}
