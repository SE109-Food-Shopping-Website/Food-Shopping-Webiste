import { Button } from "@/components/ui/button";
import React from "react";
import { Input } from "@/components/ui/input";
import { CirclePlus, PlusCircle, Search } from "lucide-react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { providerData } from "./data/provider-data";

export default function pageProvider() {
  return (
    <div className="relative justify-start text-black text-base font-normal font-['Inter']">
      Trung tâm / Quản lý / Nhà cung cấp
      <div className="w-full bg-white p-[10px] flex items-center justify-between border border-white rounded-[10px] mb-[20px] mt-[10px]">
        <div className="flex justify-end">
          <div className="relative">
            <Input placeholder="Tìm kiếm" className="pr-10" />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="flex justify-start">
          <div className="relative">
            <PlusCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" />
            <Button className="pl-12 ">Thêm nhà cung cấp</Button>
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={providerData}
        isLoading={false}
        error={undefined}
      />
    </div>
  );
}
