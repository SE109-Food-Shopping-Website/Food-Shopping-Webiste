"use client"; 

import { useEffect, useState } from "react";
import { Orders } from "./data";
import { Order } from "./type"; 

export default function PageCancelled() {
  const [orders, setOrders] = useState<Order[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setOrders(Orders);
      setLoading(false);
    }, 1000);
  }, [Orders]);  

  return (
    <div className="w-full min-h-screen flex flex-col py-6 bg-[#F9FAFB] shadow-md border border-gray-200 rounded-md">
      {/* Body */}
      <div className="flex-1 flex flex-col items-center gap-[10px] text-left text-white font-inter">
        {/* Menu */}
        <div className="w-[1240px] bg-white flex flex-row items-center justify-between py-2 px-2">
          {["Chưa soạn", "Đã soạn", "Đang giao", "Đã giao", "Đã hủy", "Trả hàng"].map((item, index) => (
            <div
              key={index}
              className={`px-4 py-2 rounded-md text-[16px] font-semibold transition-all
                ${index === 0 ? "bg-primary text-white shadow-md" : "text-foreground hover:bg-accent hover:text-white cursor-pointer"}`}
              >
              {item}
            </div>
          ))}
        </div>
        {/* Danh sách đơn hàng */}
        <div className="w-full h-full relative px-4 py-6 flex flex-col items-center gap-[30px]">
          {loading ? (
            <div className="text-gray-500 text-lg">Đang tải dữ liệu...</div>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="w-[1240px] bg-white rounded-[3px] px-4 py-6 flex flex-col gap-4 border border-gray-200 shadow-sm">
                  <div className="w-full flex px-2 py-2 bg-[#F9FAFB] border border-gray-200 rounded-md flex-col gap-5">
                    {/* Thông tin đơn hàng */}
                    <div className="w-full rounded-[5px] flex flex-row items-center justify-between flex-wrap p-3 gap-y-4">
                      <div className="flex flex-row items-center gap-5">
                        <img className="w-[50px] h-[50px] rounded-full" src={order.image} alt={order.name} />
                        <div className="flex flex-col">
                          <b className="text-[18px] text-primary">{order.name}</b>
                          <div className="text-[16px] text-muted">Phân loại: {order.category}</div>
                          <div className="text-base text-foreground">x {order.quantity}</div>
                        </div>
                      </div>
                      {/* Giá tiền */}
                      <div className="flex flex-col items-end text-base">
                        <div className="text-muted line-through font-medium">{order.oldPrice.toLocaleString()}đ</div>
                        <b className="text-primary text-[18px]">{order.price.toLocaleString()}đ</b>
                      </div>
                    </div>
                    {/* Tổng tiền */}
                    <div className="w-full flex flex-row items-center justify-end gap-2 text-base">
                      <div className="font-medium text-foreground">Tổng số tiền: <b className="text-primary">{(order.price * order.quantity).toLocaleString()}đ</b></div>
                    </div>
                  </div>
                  {/* Button */}
                  <div className="w-full flex flex-row items-center justify-end gap-3 text-white">
                    <button className="rounded-[5px] bg-secondary px-5 py-2.5 text-white font-bold shadow-sm hover:bg-red-600">
                      Hủy đơn
                    </button>
                    <button className="rounded-[5px] border-2 border-primary text-primary px-5 py-2.5 font-semibold hover:bg-primary hover:text-white">
                      Thay đổi thông tin
                    </button>
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
