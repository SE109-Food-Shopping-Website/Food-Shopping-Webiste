"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {toast} from "sonner";

export default function PageEditAddress() {
  const [address, setAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/client");
        if (res.ok) {
          const data = await res.json();
          setAddress(data.user.address); 
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile/update-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });
      if (res.ok) {
        toast.success("Cập nhật địa chỉ thành công!");
        setTimeout(() => {
          router.push("/client/profile");
        }, 1000);
      } else {
        toast.error("Cập nhật địa chỉ thất bại!");
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi!");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Đang tải...</div>;

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col items-start justify-start py-[30px] px-[100px] box-border gap-2.5 text-left text-[25px] text-black font-inter">
      <div className="self-stretch overflow-hidden flex flex-col items-center justify-start p-3xs">
        <b className="relative">Sửa địa chỉ giao hàng</b>
      </div>
      <div className="self-stretch flex flex-col items-center justify-start gap-2.5 text-[16px]">
        <div className="self-stretch rounded-[5px] box-border h-[60px] overflow-hidden shrink-0 flex flex-row items-center justify-start p-xl">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Nhập địa chỉ mới..."
            className="w-full border border-primary rounded-md p-2"
          />
        </div>
        <div className="self-stretch flex flex-row gap-3">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            variant={"default"}
            className="w-full text-white font-bold"
          >
            {isSaving ? "Đang lưu..." : "LƯU THAY ĐỔI"}
          </Button>
        </div>
      </div>
    </div>
  );
}