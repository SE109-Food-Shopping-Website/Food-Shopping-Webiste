import { DollarSign } from "lucide-react";
import StatCard from "./StatCard";
import { useEffect, useState } from "react";

interface ExpenseStatProps {
  month: number;
}

const ExpenseStat: React.FC<ExpenseStatProps> = ({ month }) => {
  const [data, setData] = useState({
    value: "0",
    percent: "0%",
    trend: "equal",
  });

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await fetch(`/api/admin/statics/expense?month=${month}`);
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
        console.error("Lỗi fetch expense:", err);
      }
    };

    fetchExpense();
  }, [month]);

  return (
    <StatCard
      title="Tổng tiền chi"
      value={data.value}
      percent={data.percent}
      change={data.trend as "up" | "down" | "equal"}
      icon={<DollarSign size={40} color="#FB4141" />}
      bg="bg-[rgba(251,65,65,0.08)]"
      border="border-[rgba(251,65,65,0.5)]"
      compareText={month === 1 ? undefined : `so với tháng ${month - 1}/2025`}
    />
  );
};

export default ExpenseStat;
