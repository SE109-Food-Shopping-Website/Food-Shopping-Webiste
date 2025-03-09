"use client";

import React from "react";
import { categoryData } from "./data/category-data";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";

export default function pageCategory() {
  return (
    <div className="relative justify-start text-black text-base font-normal font-['Inter']">
      Trung tâm / Quản lý / Loại sản phẩm
      <DataTable
        columns={columns}
        data={categoryData}
        isLoading={false}
        error={undefined}
      />
    </div>
  );
}
