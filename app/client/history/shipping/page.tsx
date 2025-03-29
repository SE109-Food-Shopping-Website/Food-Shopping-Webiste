"use client"; 

import { useEffect, useState } from "react";
import { Shippings } from "./data";
import { Shipping } from "./type"; 
import {Button} from "@/components/ui/button";

export default function PageShipping() {
  const [shippings, setShippings] = useState<Shipping[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setShippings(Shippings);
      setLoading(false);
    }, 1000);
  }, [Shippings]);  

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Body */}
      <div className="flex-1 flex flex-col items-center text-left text-white font-inter">
        {/* Danh sách đơn hàng */}
        <div className="w-full h-full relative px-4 py-4 flex flex-col items-center gap-[30px]">
          {loading ? (
            <div className="text-gray-500 text-lg">Đang tải dữ liệu...</div>
            ) : shippings.length > 0 ? (
              shippings.map((shipping) => (
                <div key={shipping.id} className="w-[1240px] bg-white rounded-[3px] px-4 py-6 flex flex-col gap-4 border border-gray-200 shadow-sm">
                  <div className="w-full flex px-2 py-2 bg-[#F9FAFB] border border-gray-200 rounded-md flex-col gap-5">
                    {/* Thông tin đơn hàng */}
                    <div className="w-full rounded-[5px] flex flex-row items-center justify-between flex-wrap p-3 gap-y-4">
                      <div className="flex flex-row items-center gap-5">
                        <img className="w-[50px] h-[50px] rounded-full" src={shipping.image} alt={shipping.name} />
                        <div className="flex flex-col">
                          <b className="text-[18px] text-primary">{shipping.name}</b>
                          <div className="text-[16px] text-muted">Phân loại: {shipping.category}</div>
                          <div className="text-base text-foreground">x {shipping.quantity}</div>
                        </div>
                      </div>
                      {/* Giá tiền */}
                      <div className="flex flex-col items-end text-base">
                        <div className="text-muted line-through font-medium">{shipping.oldPrice.toLocaleString()}đ</div>
                        <b className="text-primary text-[18px]">{shipping.price.toLocaleString()}đ</b>
                      </div>
                    </div>
                    {/* Tổng tiền */}
                    <div className="w-full flex flex-row items-center justify-end gap-2 text-base">
                      <div className="font-medium text-foreground">Tổng số tiền: <b className="text-primary">{(shipping.price * shipping.quantity).toLocaleString()}đ</b></div>
                    </div>
                  </div>
                  {/* Button */}
                  <div className="w-full flex flex-row items-center justify-end gap-3 text-white">
                    <Button variant="secondary">
                      Đã nhận hàng
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
