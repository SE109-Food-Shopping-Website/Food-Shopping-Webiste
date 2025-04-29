"use client"
 
import React from "react";

export default function PageAllRating() {
    return (
        <div className="self-stretch flex-1 bg-white overflow-hidden flex flex-col items-start justify-start py-2.5 px-[100px] gap-2.5 text-[40px]">
<div className="self-stretch overflow-hidden flex flex-col items-center justify-start p-3xs">
<b className="relative">Đánh giá sản phẩm</b>
</div>
<div className="flex flex-row items-start justify-start text-sm">
<div className="w-40 rounded-8xs border-black border-solid border-[1px] box-border flex flex-row items-center justify-between py-1.5 px-3 gap-0">
<div className="relative leading-[24px]">{`Select an option `}</div>

</div>
</div>
<div className="self-stretch flex-1 flex flex-col items-start justify-start gap-2.5 text-xl">
<div className="self-stretch flex flex-row items-center justify-start gap-2.5 text-center">

<div className="self-stretch w-[103px] relative flex items-center justify-center shrink-0">Ngoc Minh</div>
</div>
<div className="self-stretch flex flex-row items-start justify-start py-0 px-[50px] gap-2.5">

</div>
<div className="self-stretch flex flex-row items-center justify-start py-0 px-[50px] text-gray-200">
<div className="self-stretch flex-1 relative flex items-center">12:20:20 26/4/2025</div>
</div>
<div className="self-stretch rounded-3xs bg-white flex flex-col items-start justify-start py-2.5 px-[50px] text-base">
<div className="self-stretch relative leading-[130%] font-medium">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
</div>
<div className="self-stretch rounded-3xs bg-white flex flex-col items-start justify-start p-3xs">
<div className="self-stretch rounded-3xs flex flex-row items-center justify-between flex-wrap content-center p-3xs">
<div className="w-[346px] flex flex-row items-center justify-between">
</div>
</div>
</div>
</div>
</div>
    );
}