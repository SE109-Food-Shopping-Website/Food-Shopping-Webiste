// admin/components/StatCard.tsx
import { TrendingUp, TrendingDown } from "lucide-react";
import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  percent: string;
  change: "up" | "down" | "equal";
  icon: React.ReactNode;
  bg: string;
  border: string;
  compareText?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  percent,
  change,
  icon,
  bg,
  border,
  compareText = "so với tháng trước",
}) => {
  return (
    <div
      className={`p-6 rounded-2xl shadow-md flex flex-col justify-between ${bg} border ${border} hover:shadow-lg transition-all`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-gray-700">{title}</h3>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <div className="flex items-center gap-2 mb-1">
        {change === "up" ? (
          <TrendingUp color="#22c55e" />
        ) : (
          <TrendingDown color="#ef4444" />
        )}
        <span
          className={`text-lg font-semibold ${
            change === "up" ? "text-green-600" : "text-red-500"
          }`}
        >
          {percent}
        </span>
      </div>
      <span className="text-sm text-gray-500">{compareText}</span>
    </div>
  );
};

export default StatCard;
