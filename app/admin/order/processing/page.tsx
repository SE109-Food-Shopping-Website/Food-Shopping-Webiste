"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";

export default function pageProcessing() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch("/api/admin/order/processing")
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
      Đơn hàng / Danh sách đơn / Đang soạn
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
