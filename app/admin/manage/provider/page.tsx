import { Button } from "@/components/ui/button";
import React from "react";
import { Input } from "@/components/ui/input";
import { CirclePlus, PlusCircle, Search } from "lucide-react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { providerData } from "./data/provider-data";
import Link from "next/link";

export default function pageProvider() {
  return (
    <div className="relative justify-start text-black text-base font-normal font-['Inter']">
      Trung tâm / Quản lý / Nhà cung cấp
      <DataTable
        columns={columns}
        data={providerData}
        isLoading={false}
        error={undefined}
      />
    </div>
  );
}
