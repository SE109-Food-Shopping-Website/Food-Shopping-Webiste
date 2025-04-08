"use client";

import React from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { importData } from "./data/import-data";

export default function pageImport() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  return (
    <div className="relative justify-start text-black text-base font-normal font-['Inter']">
      Trung tâm / Quản lý / Nhập hàng
      <DataTable
        columns={columns}
        data={importData}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
