"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";

export default function pageImport() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    fetch("/api/import")
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu từ API:", data); // Console log dữ liệu
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);
  return (
    <div className="relative justify-start text-black text-base font-normal font-['Inter']">
      Trung tâm / Quản lý / Nhập hàng
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
