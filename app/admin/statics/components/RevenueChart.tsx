import { LineChart } from "recharts";
import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";

interface RevenueEntry {
  month: number;
  income: number;
  expense: number;
}

const RevenueChart = () => {
  const [revenueData, setRevenueData] = useState<RevenueEntry[]>([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const responses = await Promise.all(
          Array.from({ length: 12 }, (_, i) =>
            fetch(`/api/admin/statics/revenue/month?month=${i + 1}`).then(
              (res) => res.json()
            )
          )
        );
        setRevenueData(responses);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu biểu đồ:", error);
      }
    };

    fetchRevenue();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mb-10">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Doanh thu và Chi phí theo tháng
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#00C49F"
            strokeWidth={3}
            name="Doanh thu"
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#FF8042"
            strokeWidth={3}
            name="Chi phí"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
