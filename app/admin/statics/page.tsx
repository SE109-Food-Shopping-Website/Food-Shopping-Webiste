"use client";
import { TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react";
import IncomeStat from "./components/IncomeStat";
import ExpenseStat from "./components/ExpenseStat";
import RevenueStat from "./components/RevenueStat";
import CustomerStat from "./components/CustomerStat";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import RevenueChart from "./components/RevenueChart";
import CustomerChart from "./components/CustomerChart";

const userData = [
  { month: "Tháng 1", users: 50 },
  { month: "Tháng 2", users: 80 },
  { month: "Tháng 3", users: 90 },
  { month: "Tháng 4", users: 70 },
  { month: "Tháng 5", users: 100 },
  { month: "Tháng 6", users: 110 },
  { month: "Tháng 7", users: 150 },
  { month: "Tháng 8", users: 160 },
  { month: "Tháng 9", users: 140 },
  { month: "Tháng 10", users: 130 },
  { month: "Tháng 11", users: 170 },
  { month: "Tháng 12", users: 200 },
];

export default function PageStatistics() {
  const [selectedMonth, setSelectedMonth] = useState("Tháng 1");

  const fetchRevenueData = async (monthIndex: number) => {
    const res = await fetch(`/admin/statics/income?month=${monthIndex}`);
    const data = await res.json();

    if (res.ok) {
      setRevenueInfo({
        value: Number(data.revenue).toLocaleString("vi-VN"),
        percent: data.percentChange
          ? `${Math.abs(data.percentChange).toFixed(2)}%`
          : "0%",
        trend: data.trend, // up | down | equal
      });
    } else {
      console.error("Error fetching income:", data.error);
    }
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedMonth(selected);
    const index = parseInt(selected.split(" ")[1]); // "Tháng 3" → 3
    fetchRevenueData(index);
  };

  const fetchIncome = async (month: number) => {
    const res = await fetch(`/admin/statics/income?month=${month}`);
    const data = await res.json();
    // data = { month, revenue, previousRevenue, percentChange, trend }
  };

  const [revenueInfo, setRevenueInfo] = useState({
    value: "0",
    percent: "0%",
    trend: "equal", // "up" | "down" | "equal"
  });
  const monthIndex = parseInt(selectedMonth.split(" ")[1]);

  React.useEffect(() => {
    fetchRevenueData(1); // Mặc định Tháng 1
  }, []);

  return (
    <div className="p-6">
      <div className="text-black text-base font-medium mb-6">
        Trung tâm / Thống kê / Doanh thu
      </div>

      {/* Select tháng */}
      <div className="mb-6">
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="px-4 py-2 border rounded-md"
        >
          {[
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
          ].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <IncomeStat month={monthIndex} />
        <ExpenseStat month={monthIndex} />
        <RevenueStat month={monthIndex} />
        <CustomerStat month={monthIndex} />
      </div>

      {/* Revenue Line Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Doanh thu theo tháng
        </h2>
        <RevenueChart />
      </div>

      {/* Users Column Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Người dùng mới theo tháng
        </h2>
        <CustomerChart />
      </div>
    </div>
  );
}
