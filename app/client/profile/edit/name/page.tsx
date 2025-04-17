"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PageEditName() {
  const [name, setName] = useState("Nguyễn Văn A");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile/update-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        router.push("/profile");
      } else {
        alert("Cập nhật tên thất bại!");
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi!");
    } finally {
      setIsSaving(false);
    }
  };

    return (
        <div className="w-full h-full relative overflow-hidden flex flex-col items-start justify-start py-[30px] px-[100px] box-border gap-2.5 text-left text-[25px] text-black font-inter">
            <div className="self-stretch overflow-hidden flex flex-col items-center justify-start p-3xs">
                <b className="relative">Sửa tên người nhận</b>
            </div>
            <div className="self-stretch flex flex-col items-center justify-start gap-2.5 text-[16px]">
                {/* Input */}
                <div className="self-stretch rounded-[5px] box-border h-[60px] overflow-hidden shrink-0 flex flex-row items-center justify-start p-xl">
                    <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên mới..."
                    className="w-full border border-primary rounded-md p-2"
                    />
                </div>
                {/* Buttons */}
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