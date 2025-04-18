"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PageProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/client");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        router.push("/login"); // Nếu chưa login thì redirect
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });
      if (res.ok) {
        router.push("/login");
      } else {
        alert("Đăng xuất thất bại");
      }
    } catch (error) {
      console.error("Error during logout", error);
      alert("Đã có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <div>Đang tải...</div>;

  return (
    <div className="flex-1 px-[100px] py-[30px] flex flex-col gap-2.5">
      <div className="text-[30px] text-black font-bold text-center">
        Thông tin tài khoản
      </div>
      {/* Tên người nhận */}
      <div
        onClick={() => router.push("/client/profile/edit/name")}
        className="cursor-pointer hover:bg-gray-100 transition self-stretch h-[70px] flex flex-row items-center justify-between"
      >
        <div className="w-[300px] flex items-center p-4">
          <div className="font-medium">Tên người nhận</div>
        </div>
        <div className="flex items-center justify-center p-4">
          <div>{user.name}</div>
        </div>
      </div>
      {/* Số điện thoại */}
      <div
        onClick={() => router.push("/client/profile/edit/phone")}
        className="cursor-pointer hover:bg-gray-100 transition border-t border-gray-200 self-stretch h-[70px] flex flex-row items-center justify-between"
      >
        <div className="w-[300px] flex items-center p-4">
          <div className="font-medium">Số điện thoại người nhận</div>
        </div>
        <div className="flex items-center justify-center p-4">
          <div>{user.phone}</div>
        </div>
      </div>
      {/* Địa chỉ */}
      <div
        onClick={() => router.push("/client/profile/edit/address")}
        className="cursor-pointer hover:bg-gray-100 transition border-t border-gray-200 self-stretch h-[70px] flex flex-row items-center justify-between"
      >
        <div className="w-[300px] flex items-center p-4">
          <div className="font-medium">Địa chỉ giao hàng</div>
        </div>
        <div className="flex items-center justify-center p-4">
          <div>{user.address}</div>
        </div>
      </div>
      {/* Đổi mật khẩu */}
      <div className="border-t border-gray-200 self-stretch h-[70px] flex flex-row items-center justify-between">
        <div className="w-[300px] flex items-center p-4 gap-2.5">
          <div className="font-medium">Đổi mật khẩu</div>
        </div>
        <div className="w-[120px] flex items-center justify-center p-4">
          <div
            onClick={() => router.push("/client/profile/change-password")}
            className="cursor-pointer hover:underline"
          >
            Thay đổi
          </div>
        </div>
      </div>
      {/* Đăng xuất */}
      <div className="self-stretch h-[70px] box-border overflow-hidden shrink-0 flex flex-row">
        <Button
          onClick={handleLogout}
          disabled={isLoading}
          className="bg-white self-stretch flex-1 h-[52px] flex items-start justify-start p-4 box-border gap-2.5 text-secondary text-[16px] font-bold hover:opacity-80 transition-all"
        >
          {isLoading ? "Đang đăng xuất..." : "ĐĂNG XUẤT"}
        </Button>
      </div>
    </div>
  );
}
