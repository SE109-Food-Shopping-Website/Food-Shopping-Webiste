import { Users } from "lucide-react";
import StatCard from "./StatCard";
import { useEffect, useState } from "react";

interface CustomerStatProps {
  month: number;
}

const CustomerStat: React.FC<CustomerStatProps> = ({ month }) => {
  const [data, setData] = useState({
    value: "0",
    percent: "0%",
    trend: "equal",
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`/api/admin/statics/customer?month=${month}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);

        setData({
          value: Number(json.count).toLocaleString("vi-VN"),
          percent: json.percentChange
            ? `${Math.abs(json.percentChange).toFixed(2)}%`
            : "0%",
          trend: json.trend, // "up" | "down" | "equal"
        });
      } catch (err) {
        console.error("Lỗi fetch customer stat:", err);
      }
    };

    fetchCustomer();
  }, [month]);

  return (
    <StatCard
      title="Khách hàng đăng ký mới"
      value={data.value}
      percent={data.percent}
      change={data.trend as "up" | "down" | "equal"}
      icon={<Users size={40} color="#3b82f6" />}
      bg="bg-[rgba(59,130,246,0.08)]"
      border="border-[rgba(59,130,246,0.5)]"
      compareText={month === 1 ? undefined : `so với tháng ${month - 1}/2025`}
    />
  );
};

export default CustomerStat;
