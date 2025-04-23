// admin/components/IncomeStat.tsx
import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import StatCard from "./StatCard";

interface IncomeStatProps {
  month: number;
}

const IncomeStat: React.FC<IncomeStatProps> = ({ month }) => {
  const [data, setData] = useState({
    value: "0",
    percent: "0%",
    trend: "equal",
  });

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const res = await fetch(`/api/admin/statics/income?month=${month}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);

        setData({
          value: Number(json.revenue).toLocaleString("vi-VN"),
          percent: json.percentChange
            ? `${Math.abs(json.percentChange).toFixed(2)}%`
            : "0%",
          trend: json.trend, // "up" | "down" | "equal"
        });
      } catch (err) {
        console.error("Lỗi fetch income:", err);
      }
    };

    fetchIncome();
  }, [month]);

  return (
    <StatCard
      title="Tổng tiền thu"
      value={data.value}
      percent={data.percent}
      change={data.trend as "up" | "down" | "equal"}
      icon={<DollarSign size={40} color="#5cb338" />}
      bg="bg-[rgba(92,179,56,0.08)]"
      border="border-[rgba(92,179,56,0.5)]"
      compareText={month === 1 ? undefined : `so với tháng ${month - 1}/2025`}
    />
  );
};

export default IncomeStat;
