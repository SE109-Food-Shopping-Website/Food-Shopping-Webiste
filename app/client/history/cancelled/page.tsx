import React from "react";

export default function pageCancelled() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-light">
    {/* Body */}
    <div className="flex-1 flex flex-col items-center text-left text-white font-inter">
      {/* Menu */}
        <div className="w-full rounded-[5px] relative flex flex-row items-center justify-between py-[20px] px-[100px] box-border gap-0 text-left text-[16px] text-black font-inter">
            <div className="h-auto relative rounded-[10px] bg-primary w-auto flex flex-row items-center justify-start py-1.5 px-3 box-border text-left text-[16px] text-white font-inter">
                <b className="relative leading-[20px]">Chưa soạn</b>
            </div>
            <b className="relative">Đã soạn</b>
            <b className="relative">Đang giao</b>
            <b className="relative">Đã giao</b>
            <b className="relative">Đã hủy</b>
            <b className="relative">Trả hàng</b>
        </div>
      {/* Item */}
        <div className="w-[1240px] relative shadow-[2px_2px_2px_rgba(0,_0,_0,_0.25)] rounded-[5px] px-[10px] py-[20px] flex flex-col items-start justify-start box-border gap-[10px] text-left text-[14px] text-black font-inter">
          <div className="self-stretch flex flex-col items-start justify-start gap-[30px]">
          <div className="self-stretch rounded-[5px] flex flex-row items-center justify-between flex-wrap content-center p-3xs gap-x-0 gap-y-[273px]">
          <div className="w-[346px] flex flex-row items-center justify-between gap-5">
            <img className="w-[30px] h-[130px] grow shrink basis-0 self-stretch" src="/ava.png" alt="image"/>
          <div className="w-[183px] flex flex-col items-start justify-start gap-2.5">
          <b className="self-stretch relative text-[18px] leading-[20px]">Cà rốt</b>
          <div className="self-stretch relative text-[16px] leading-[20px] font-medium">Phân loại: màu trắng</div>
          <div className="self-stretch relative text-base leading-[20px] text-darkslategray-100">x 1</div>
          </div>
          </div>
          <div className="flex flex-col items-start justify-center text-base text-darkslategray-200">
          <div className="relative [text-decoration:line-through] leading-[20px] font-medium">50.000đ</div>
          <b className="relative text-black">40.000đ</b>
          </div>
          </div>
          <div className="self-stretch flex flex-row items-center justify-end flex-wrap content-center gap-[5px] text-base">

          <div className="relative leading-[20px]">
          <span className="font-medium">{`Tổng số tiền: `}</span>
          <b className="text-primary">40.000đ</b>
          </div>
          </div>
          </div>
          <div className="self-stretch h-[50px] flex flex-row items-start justify-end gap-2.5 text-white">
          <div className="self-stretch flex flex-row items-start justify-start">
          <div className="self-stretch w-auto rounded-[5px] bg-secondary flex flex-row items-center justify-center py-2.5 px-5 box-border">
          <b className="relative tracking-[0.03em]">Hủy đơn</b>
          </div>
          </div>
          <div className="self-stretch flex flex-row items-center justify-center text-black">
          <div className="self-stretch rounded-[5px] border-forestgreen border-solid border-[3px] flex flex-row items-center justify-center py-2.5 px-5">
          <div className="w-auto relative tracking-[0.03em] font-semibold flex items-center shrink-0">Thay đổi thông tin</div>
          </div>
          </div>
          </div>
        </div>
    </div>
</div>

  );
}