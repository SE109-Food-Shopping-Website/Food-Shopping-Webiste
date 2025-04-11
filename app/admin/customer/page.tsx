"use client";

import React from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { customerData } from "./data/customer-data";

export default function pageCustomer() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  return (
    <div className="relative justify-start text-black text-base font-normal font-['Inter']">
      Góp ý / Khách hàng / Danh sách
      <DataTable
        columns={columns}
        data={customerData}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
