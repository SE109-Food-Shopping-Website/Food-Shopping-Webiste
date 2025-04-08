"use client"; 

import { useEffect, useState } from "react";
import { Unprepareds } from "./data";
import { Unprepared } from "./type"; 
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function PageUnprepared() {
  const [unpres, setUnprepareds] = useState<Unprepared[]>([]); 
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUnprepareds(Unprepareds);
      setLoading(false);
    }, 1000);
  }, [Unprepareds]);  

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Body */}
      <div className="flex-1 flex flex-col items-center text-left text-white font-inter">
        {/* Danh sách đơn hàng */}
        <div className="w-full h-full relative px-4 py-4 flex flex-col items-center gap-[30px]">
          {loading ? (
            <div className="text-gray-500 text-lg">Đang tải dữ liệu...</div>
            ) : unpres.length > 0 ? (
              unpres.map((unpre) => (
                <div key={unpre.id} className="w-[1240px] bg-white rounded-[3px] px-4 py-6 flex flex-col gap-4 border border-gray-200 shadow-sm">
                  <div className="w-full flex px-2 py-2 bg-[#F9FAFB] border border-gray-200 rounded-md flex-col gap-5">
                    {/* Thông tin đơn hàng */}
                    <Link href={`/client/history/order_detail/${unpre.id}`}>
                      <div className="w-full rounded-[5px] flex flex-row items-center justify-between flex-wrap p-3 gap-y-4">
                        <div className="flex flex-row items-center gap-5">
                          <img className="w-[50px] h-[50px] rounded-full" src={unpre.image} alt={unpre.name} />
                          <div className="flex flex-col">
                            <b className="text-[18px] text-primary">{unpre.name}</b>
                            <div className="text-[16px] text-muted">Phân loại: {unpre.category}</div>
                            <div className="text-base text-foreground">x {unpre.quantity}</div>
                          </div>
                        </div>
                        {/* Giá tiền */}
                        <div className="flex flex-col items-end text-base">
                          <div className="text-muted line-through font-medium">{unpre.oldPrice.toLocaleString()}đ</div>
                          <b className="text-primary text-[18px]">{unpre.price.toLocaleString()}đ</b>
                        </div>
                      </div>
                      {/* Tổng tiền */}
                      <div className="w-full flex flex-row items-center justify-end gap-2 text-base">
                        <div className="font-medium text-foreground">Tổng số tiền: <b className="text-primary">{(unpre.price * unpre.quantity).toLocaleString()}đ</b></div>
                      </div>
                    </Link>
                  </div>
                  {/* Button */}
                  <div className="w-full flex flex-row items-center justify-end gap-3 text-white">                  
                    <Button asChild variant="secondary">
                      <Link href="/client/history/order_cancel/[id]" as={`/client/history/order_cancel/${unpre.id}`}>
                        Hủy đơn
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-white border border-primary text-black shadow-none">
                      <Link href={`/client/history/unprepared/change_info/${unpre.id}`}>
                      Thay đổi thông tin
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-lg">Không có đơn hàng nào</div>
            )}
        </div>
      </div>
    </div>
  );
}
