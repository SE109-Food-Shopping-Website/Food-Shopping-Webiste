"use client"

import Image from "next/image";
import QuantitySelector from "@/components/ui/quantity";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/client/context/CartContext";
import {Star, Check, ShoppingCart} from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel";

export default function PageDetail() {
    const { cart, updateCart } = useCart();

    const handleQuantityChange = (id: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        const updatedCart = cart.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.price } : item
        );
        updateCart(updatedCart);
      };
    return (
        <div className="w-full h-full relative flex flex-col items-center justify-between py-[10px] px-[100px] box-border text-left text-11xl text-black font-inter">
            <div className="self-stretch flex flex-row items-center justify-between gap-2.5">
                {/* Left */}
                <div className="w-[700px] overflow-hidden shrink-0 flex flex-col items-center justify-start box-border gap-5">
                    <div className="w-[300px] h-[300px] flex flex-row items-center justify-center py-[30px] px-0 box-border">
                        <Image className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover" width={300} height={300} alt="" src="/cauli.png" />
                    </div>
                    <Carousel>
                        <CarouselPrevious className="absolute left-0 top-[50%] left-[-50px] -translate-y-1/2 z-10" />
                        <CarouselContent className="-ml-2 md:-ml-4">
                            <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                <div className="w-[100px] h-[100px] border-solid border-[3px] box-border overflow-hidden shrink-0 flex flex-row items-start justify-start p-3xs">
                                    <div className="self-stretch flex-1 flex flex-row items-center justify-center">
                                        <Image className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover" width={100} height={100} alt="" src="/cauli.png" />
                                    </div>
                                </div>
                            </CarouselItem>
                            <CarouselItem className=" pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                <div className="w-[100px] h-[100px] border-solid border-[3px] box-border overflow-hidden shrink-0 flex flex-row items-start justify-start p-3xs">
                                    <div className="self-stretch flex-1 flex flex-row items-center justify-center">
                                        <Image className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover" width={100} height={100} alt="" src="/cauli.png" />
                                    </div>
                                </div>
                            </CarouselItem>
                            <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                <div className="w-[100px] h-[100px] border-solid border-[3px] box-border overflow-hidden shrink-0 flex flex-row items-start justify-start p-3xs">
                                    <div className="self-stretch flex-1 flex flex-row items-center justify-center">
                                        <Image className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover" width={100} height={100} alt="" src="/cauli.png" />
                                    </div>
                                </div>
                            </CarouselItem>
                            <CarouselItem className=" pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                <div className="w-[100px] h-[100px] border-solid border-[3px] box-border overflow-hidden shrink-0 flex flex-row items-start justify-start p-3xs">
                                    <div className="self-stretch flex-1 flex flex-row items-center justify-center">
                                        <Image className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover" width={100} height={100} alt="" src="/cauli.png" />
                                    </div>
                                </div>
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselNext className="absolute right-0 top-[50%] right-[-10px] -translate-y-1/2 z-10" />
                    </Carousel>
                    <div className="self-stretch overflow-hidden flex flex-col items-start justify-start p-3xs gap-2.5">
                        <b className="relative">Mô tả sản phẩm</b>
                        <div className="relative text-[16px] font-medium">Sản phẩm sạch</div>
                    </div>
                </div>
                {/* Right */}
                <div className="flex-1 bg-white overflow-hidden flex flex-col items-start justify-start gap-2.5">
                    <b className="relative text-[30px]">Cà rốt</b>
                    <div className="flex flex-row items-start justify-start gap-2.5">
                        <div className="relative w-full flex flex-row items-start justify-start gap-2.5">
                            <Star className="text-primary" />
                            <Star className="text-primary" />
                            <Star className="text-primary" />
                            <Star className="text-primary" />
                            <Star className="text-primary" />
                        </div>
                    </div>
                    <div className="relative text-[16px] font-medium">Nhà cung cấp: ABC</div>
                    <div className="self-stretch flex flex-row items-center justify-start gap-2.5">
                        <b className="relative text-[25px] text-primary">40.000đ</b>
                        <div className="relative text-[18px] [text-decoration:line-through] font-medium text-gray-500">50.000đ</div>
                        <div className="w-auto h-auto rounded-[5px] bg-primary flex flex-row items-center justify-start p-[5px] text-white box-border">
                            <b className="relative tracking-[0.03em]">-20%</b>
                        </div>
                    </div>
                    <div className="self-stretch flex flex-col items-start justify-start py-2.5 px-0 gap-[10px]">
                        <b className="relative text-[16px]">Kích thước</b>
                        <div className="self-stretch flex flex-row items-start justify-start gap-2.5 text-base">
                        <div className="w-auto h-auto rounded-[5px] border-forestgreen border-solid border-[2px] box-border flex flex-row items-center justify-center py-[5px] px-2.5">
                            <div className="relative font-semibold">XL</div>
                        </div>
                        <div className="w-auto h-auto rounded-[5px] border-black border-solid border-[2px] box-border flex flex-row items-center justify-center py-[5px] px-2.5">
                            <div className="relative font-semibold">XL</div>
                        </div>
                    </div>
                    <div className="self-stretch flex flex-row items-center justify-start gap-[60px]">
                        <div className="relative font-bold">Số lượng</div>
                        <div className="flex flex-row items-center justify-between py-[5px] px-2.5 gap-0">
                            {cart.map((product) => (
                                <QuantitySelector
                                    key={product.id}
                                    quantity={product.quantity}
                                    onChange={(newQuantity) => handleQuantityChange(product.id, newQuantity)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="self-stretch flex flex-row items-start justify-start gap-[50px]">
                        <div className="relative font-bold">Trạng thái</div>
                        <div className="flex flex-row items-center justify-start gap-2.5 text-primary">
                            <Check className="text-primary" />
                            <b className="relative">Còn 10 sản phẩm</b>
                        </div>
                    </div>
                    </div>
                    <div className="self-stretch flex flex-row items-lefy py-2.5 box-border gap-2.5 text-11xl">
                        <Button 
                            variant="default" 
                            className="w-[400px] h-[50px] font-bold relative tracking-[0.03em]">
                            <ShoppingCart strokeWidth={3} className="text-white" />
                            THÊM VÀO GIỎ HÀNG
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}