"use client"

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import QuantitySelector from "@/components/ui/quantity";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/client/context/CartContext";
import {Star, Check, ShoppingCart} from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel";

interface Provider {
    id: number;
    name: string;
  }

interface Product {
    id: number;
    name: string;
    price: number;
    images: string;
    description?: string;
    unit?: string;
    quantity: number;
    sold: number;
    provider_id?: number;
    productType_id?: number;
    provider?: Provider;
}
  
  const mockProducts: Product[] = [
    { id: 1, name: "Rau chân vịt", price: 4000, images: "/spinach_3.jpg", description: "Sản phẩm sạch", quantity: 3, sold: 1, provider: { id: 1, name: "Bách hóa xanh" }},
    { id: 2, name: "Súp lơ", price: 3500, images: "/cauli.png", description: "Sản phẩm sạch", quantity: 3, sold: 10, provider: { id: 1, name: "Bách hóa xanh" } },
    { id: 3, name: "Sữa milo", price: 45000, images: "/milo_3.jpg", description: "Sản phẩm sạch", quantity: 3, sold: 2, provider: { id: 1, name: "Milo" }},
    { id: 4, name: "Sữa TH True Milk", price: 50000, images: "/truemilk.jpg", description: "Sản phẩm sạch", quantity: 3,  sold: 5, provider: { id: 1, name: "TH True Milk" } },
    { id: 5, name: "Trứng gà", price: 25000, images: "/egg.jpg", description: "Sản phẩm sạch", quantity: 3, sold: 7, provider: { id: 1, name: "Trang trại gà" } },
    { id: 6, name: "Trứng vịt", price: 20000, images: "/duck.jpg", description: "Sản phẩm sạch", quantity: 3, sold: 6, provider: { id: 1, name: "Trang trại vịt" }},
  ];
  
export default function ProductDetail() {
    const {cart, updateCart} = useCart();
    const handleQuantityChange = (id: number, newQuantity: number) => {
        if (newQuantity < 1) return;
    
        const updatedCart = cart.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.price } : item
        );
        updateCart(updatedCart);
    };

    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    useEffect(() => {
      if (id) {
        const found = mockProducts.find((p) => p.id === Number(id));
        setProduct(found || null);
      }
    }, [id]);
  
    if (!product) return <div className="p-10">Không tìm thấy sản phẩm</div>;
    return (
        <div className="w-full h-full relative flex flex-col py-[10px] px-[100px] box-border text-left text-11xl text-black font-inter">
            <div className="self-stretch flex flex-row gap-2.5">
                {/* Left */}
                <div className="w-[700px] overflow-hidden shrink-0 flex flex-col items-center justify-start box-border gap-5">
                    <div className="w-[300px] h-[300px] flex flex-row items-center justify-center py-[30px] px-0 box-border">
                        <Image
                            src={product.images || "/ava.png"}
                            alt={product.name}
                            width={300}
                            height={300}
                            className="object-cover rounded-md"
                        />
                    </div>
                    <Carousel>
                        <CarouselPrevious className="absolute left-0 top-[50%] left-[-50px] -translate-y-1/2 z-10" />
                        <CarouselContent className="-ml-2 md:-ml-4">
                            <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                <div className="w-[100px] h-[100px] border-solid border-[3px] box-border overflow-hidden shrink-0 flex flex-row items-start justify-start p-3xs">
                                    <div className="self-stretch flex-1 flex flex-row items-center justify-center">
                                        <Image
                                            src={product.images || "/ava.png"}
                                            alt={product.name}
                                            width={100}
                                            height={100}
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                </div>
                            </CarouselItem>
                            <CarouselItem className=" pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                <div className="w-[100px] h-[100px] border-solid border-[3px] box-border overflow-hidden shrink-0 flex flex-row items-start justify-start p-3xs">
                                    <div className="self-stretch flex-1 flex flex-row items-center justify-center">
                                        <Image
                                            src={product.images || "/ava.png"}
                                            alt={product.name}
                                            width={100}
                                            height={100}
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                </div>
                            </CarouselItem>
                            <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                <div className="w-[100px] h-[100px] border-solid border-[3px] box-border overflow-hidden shrink-0 flex flex-row items-start justify-start p-3xs">
                                    <div className="self-stretch flex-1 flex flex-row items-center justify-center">
                                        <Image
                                            src={product.images || "/ava.png"}
                                            alt={product.name}
                                            width={100}
                                            height={100}
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                </div>
                            </CarouselItem>
                            <CarouselItem className=" pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                <div className="w-[100px] h-[100px] border-solid border-[3px] box-border overflow-hidden shrink-0 flex flex-row items-start justify-start p-3xs">
                                    <div className="self-stretch flex-1 flex flex-row items-center justify-center">
                                        <Image
                                            src={product.images || "/ava.png"}
                                            alt={product.name}
                                            width={100}
                                            height={100}
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                </div>
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselNext className="absolute right-0 top-[50%] right-[-10px] -translate-y-1/2 z-10" />
                    </Carousel>
                    <div className="self-stretch overflow-hidden flex flex-col items-start justify-start p-3xs gap-2.5">
                        <b className="relative">Mô tả sản phẩm</b>
                        <div className="relative text-[16px] font-medium">{product.description}</div>
                    </div>
                </div>
                {/* Right */}
                <div className="flex-1 bg-white overflow-hidden flex flex-col items-start justify-start py-[30px] gap-2.5">
                    <b className="relative text-[30px]">{product.name}</b>
                    <div className="flex flex-row items-start justify-start gap-2.5">
                        <div className="relative w-full flex flex-row items-start justify-start gap-2.5">
                            <Star className="text-primary" />
                            <Star className="text-primary" />
                            <Star className="text-primary" />
                            <Star className="text-primary" />
                            <Star className="text-primary" />
                        </div>
                    </div>
                    <div className=" self-stretch flex flex-row text-[16px] font-medium gap-2.5">
                        <div className="relative">Nhà cung cấp:</div>     
                        <b className="relative">{product.provider?.name}</b>
                    </div>
                    <div className="self-stretch flex flex-row items-center justify-start gap-2.5">
                        <b className="relative text-[25px] text-primary">{product.price.toLocaleString()}đ</b>
                        <div className="relative text-[18px] [text-decoration:line-through] font-medium text-gray-500">50.000đ</div>
                        <div className="w-auto h-auto rounded-[5px] bg-primary flex flex-row items-center justify-start p-[5px] text-white box-border">
                            <b className="relative tracking-[0.03em]">-20%</b>
                        </div>
                    </div>
                    <div className="self-stretch flex flex-col items-start justify-start py-2.5 px-0 gap-[10px]">
                        <div className="self-stretch flex flex-row items-center justify-start gap-[60px]">
                            <div className="relative">Số lượng</div>
                            <div className="flex flex-row items-center justify-between py-[5px] px-2.5 gap-0">
                            {cart.map((product) => (
                                <QuantitySelector
                                key={product.id}
                                cartQuantity={product.quantity}
                                onChange={(newQuantity) => handleQuantityChange(product.id, newQuantity)}
                                />
                            ))}
                            </div>
                    </div>
                    <div className="self-stretch flex flex-row items-start justify-start gap-[50px]">
                        <div className="relative">Đã bán</div>
                        <div className="flex flex-row items-center justify-start gap-2.5 text-primary">
                            <Check className="text-primary" />
                            <b className="relative">{product.sold} sản phẩm</b>
                        </div>
                    </div>
                    </div>
                    <div className="self-stretch flex flex-row items-left py-2.5 box-border gap-2.5 text-11xl">
                        <Button 
                            variant="default" 
                            className="w-[400px] h-[50px] font-bold relative tracking-tight">
                            <ShoppingCart strokeWidth={3} className="text-white" />
                            THÊM VÀO GIỎ HÀNG
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
