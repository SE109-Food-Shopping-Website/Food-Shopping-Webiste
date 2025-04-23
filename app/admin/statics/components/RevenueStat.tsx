import { DollarSign } from "lucide-react";
import StatCard from "./StatCard";
import { useEffect, useState } from "react";

interface RevenueStatProps {
  month: number;
}

const RevenueStat: React.FC<RevenueStatProps> = ({ month }) => {
  const [data, setData] = useState({
    value: "0",
    trend: "equal",
  });

  useEffect(() => {
    const fetchProfit = async () => {
      try {
        const res = await fetch(`/api/admin/statics/revenue?month=${month}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);

        setData({
          value: Number(json.profit).toLocaleString("vi-VN"),
          trend: json.trend, // "up" | "down" | "equal"
        });
      } catch (err) {
        console.error("Lỗi fetch profit:", err);
      }
    };

    fetchProfit();
  }, [month]);

  return (
    <StatCard
      title="Lợi nhuận"
      value={data.value}
      percent="" // Không cần phần trăm thay đổi, chỉ hiển thị số tiền
      change={data.trend as "up" | "down" | "equal"}
      icon={<DollarSign size={40} color="#00C49F" />}
      bg="bg-[rgba(0,196,159,0.08)]"
      border="border-[rgba(0,196,159,0.5)]"
      compareText={month === 1 ? undefined : `so với tháng ${month - 1}/2025`}
    />
  );
};

export default RevenueStat;
