"use client";

import React, {useState, useEffect} from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";

export default function customerComment() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
      fetch("/api/admin/comment")
        .then((res) => res.json())
        .then((data) => {
          console.log("Dữ liệu từ API:", data); 
          setData(data.feedbacks);
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
      Góp ý / Khách hàng / Góp ý
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
