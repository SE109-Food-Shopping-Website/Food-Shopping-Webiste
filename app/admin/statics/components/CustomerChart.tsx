// File: components/CustomerChart.tsx
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface CustomerEntry {
  month: number;
  users: number;
}

const CustomerChart = () => {
  const [userData, setUserData] = useState<CustomerEntry[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/admin/statics/customer/month");
        const json = await res.json();
        setUserData(json);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu người dùng:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mb-10">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Số lượng khách hàng đăng ký theo tháng
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={userData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="users" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerChart;
