"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { ChevronDown} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import {toast} from "sonner";
import { useEffect } from "react";

const formSchema = z.object({
  reason: z.string().min(1, "Hãy chọn lý do"),
  description: z.string().optional(),
  img_links: z.string().array().optional(),
  date: z.string().min(1, "Hãy chọn thời gian"),
  address: z.string().min(1, "Hãy nhập địa chỉ"),
});

async function returnOrder(orderId: string, reason: string, date: string, address: string, description?: string, img_links?: string[]) {
    const res = await fetch("/api/order/return", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, reason, description, img_links, date, address }),
    });
  
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Yêu cầu trả hàng/hoàn tiền thất bại");
    }
  
    return await res.json();
}

export default function PageOrderReturn() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        reason: "",
        description: "",
        img_links: [],
        date: "",
        address: "",
        },
    });

    const {id} = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [selectedReason, setSelectedReason] = useState("Chọn lý do trả hàng");
    const [selectedImages, setSelectedImages] = useState<File[]>([]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
    
        let newImages: File[] = [...selectedImages];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > 5 * 1024 * 1024) {
                alert(`File ${file.name} vượt quá 5MB!`);
                continue;
            }
            if (newImages.length >= 5) {
                alert("Chỉ được chọn tối đa 5 ảnh.");
                break;
            }
        
            newImages.push(file);
        }
        setSelectedImages(newImages);
      };
    
    const removeImage = (index: number) => {
        setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    function handleSelectReason(reason: string) {
        setSelectedReason(reason);
        form.setValue("reason", reason);
      }
    
    const formatPrice = (price?: number) => price?.toLocaleString() ?? "0";
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
          toast.loading("Đang gửi yêu cầu trả hàng...");
          await returnOrder(id as string, values.reason, values.date, values.address, values.description, values.img_links);
          toast.success("Đã gửi yêu cầu trả hàng thành công!");
          setTimeout(() => {
            router.push("/client/history/request");
          }, 1500);
        } catch (error: any) {
          console.error("Lỗi khi gửi yêu cầu trả hàng:", error);
          toast.error(error.message || "Đã xảy ra lỗi khi gửi yêu cầu");
        } finally {
          toast.dismiss();
        }
    }

    useEffect(() => {
        const fetchOrder = async () => {
            try {
              const res = await fetch(`/api/order/${id}`);
              const json = await res.json();
              if (json.message) throw new Error(json.message);
              setOrder(json.order);
            } catch (error: any) {
              console.error("Lỗi khi lấy đơn hàng:", error);
              toast.error(error.message || "Không thể tải thông tin đơn hàng!");
            } finally {
              setLoading(false);
            }
          };
      
          if (id) fetchOrder();
    }, [id]);
      
    if (loading) {
        return <div className="w-full text-center py-10 text-gray-500">Đang tải đơn hàng...</div>;
    }
      
    if (!order) {
        return <div className="w-full text-center py-10 text-red-500">Không tìm thấy đơn hàng!</div>;
    }

    return (
        <div className="w-[1240px] relative overflow-hidden flex flex-col items-start justify-start text-left text-black font-inter gap-[10px]">
            <div className="self-stretch overflow-hidden flex flex-row items-start justify-center text-[25px]">
                <b className="relative">Yêu cầu Trả hàng/Hoàn tiền</b>
            </div>
            <div className="self-stretch rounded-[5px] flex flex-col items-start justify-start px-[20px] gap-2.5">
                {order?.orderDetails?.map((detail: any) => {
                let imageSrc = "/ava.png";
                try {
                    const parsedImages = JSON.parse(detail.product.images);
                    if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                    imageSrc = parsedImages[0];
                    }
                } catch (error) {
                    console.error("Error parsing product images:", error);
                }
                return (
                    <div key={detail.id} className="w-full flex flex-row items-center justify-between border-b rounded-md p-3 hover:bg-gray-50">
                    <div className="flex flex-row items-center gap-5">
                        <img className="w-[50px] h-[50px] rounded-full" src={imageSrc} alt={detail.product.name} />
                        <div className="flex flex-col">
                        <b className="text-[18px] text-primary">{detail.product.name}</b>
                        <div className="text-[16px] text-foreground">Đơn vị tính: {detail.product.unit}</div>
                        <div className="text-base text-foreground">x {detail.quantity}</div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end text-base">
                        <b className="text-primary text-[18px]">{formatPrice(detail.salePrice)}đ</b>
                    </div>
                    </div>
                );
            })}
            <div className="self-stretch rounded-[5px] bg-white flex flex-col items-start justify-start py-[10px] gap-2.5">
                <div className="flex justify-between w-full">
                    <div className="font-medium">Tạm tính</div>
                    <b className="text-[16px]">{formatPrice(order.originalPrice)}đ</b>
                </div>
                <div className="flex justify-between w-full">
                    <div className="font-medium">Phí ship</div>
                    <b>{formatPrice(order.shippingFee)}đ</b>
                </div>
                <div className="flex justify-between w-full">
                    <div className="font-medium">Giảm giá</div>
                    <b>{formatPrice(order.discountAmount)}đ</b>
                </div>
                <div className="flex justify-between w-full text-[18px]">
                    <b>Tổng cộng</b>
                    <b className="text-primary">{formatPrice(order.totalPrice)}đ</b>
                </div>
            </div>
        </div>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[1240px] mx-auto p-4 space-y-4 text-black">
                    {/* Dropdown lý do */}
                    <div>
                    <FormField
                        control={form.control}
                        name="reason"
                        render={() => (
                        <FormItem>
                            <FormLabel>Lý do trả hàng</FormLabel>
                            <DropdownMenu>
                            <DropdownMenuTrigger className="w-full border border-gray-300 rounded px-4 py-2 flex justify-between items-center">
                                <span>{selectedReason}</span>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[1200px]">
                                {["Sai sản phẩm", "Hỏng hóc", "Không đúng mô tả", "Lý do khác"].map((item) => (
                                <DropdownMenuItem key={item} onClick={() => handleSelectReason(item)}>
                                    {item}
                                </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                            </DropdownMenu>
                            <FormMessage className="text-red-600 font-semibold mt-1 flex items-center gap-1" />                               
                        </FormItem>
                        )}
                    />
                    </div>
                    {/* Mô tả */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Mô tả lỗi sản phẩm</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Nhập mô tả lý do hoàn trả..."
                                className="h-28 resize-none"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Upload hình ảnh */}
                    <div className="w-full flex flex-col justify-start items-start mt-[10px] gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="text-sm file:text-sm file:font-medium file:bg-primary file:text-white 
                                        file:py-2 file:px-4 file:rounded-md file:border-none
                                        focus:outline-none focus:ring-0 focus:border-transparent 
                                        bg-transparent w-full"
                        />
                            {selectedImages.map((image, index) => (
                                <div key={index}>
                                    <img
                                    src={URL.createObjectURL(image)}
                                    alt="preview"
                                    width={100}
                                    height={100}
                                />
                                <button type="button" onClick={() => removeImage(index)}>
                                    Xóa
                                </button>
                            </div>
                            ))}
                    </div>                   
                    {/* Hiển thị ảnh đã chọn */}
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {selectedImages.map((image, index) => (
                            <div key={index} className="relative w-24 h-24">
                                <Image
                                    src={URL.createObjectURL(image)}
                                    alt={`Selected ${index}`}
                                    width={96}
                                    height={96}
                                    className="rounded-lg object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* Ngày nhận */}
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => {
                            const today = new Date().toISOString().split("T")[0]; 
                            return (
                            <FormItem className="space-y-2 flex flex-col">
                                <FormLabel className="text-sm font-medium text-gray-700">Thời gian nhận hàng</FormLabel>
                                <FormControl>
                                <input
                                    type="date"
                                    {...field}
                                    min={today}
                                    className="w-[150px] h-10 px-3 py-2 text-sm rounded-md border border-primary 
                                            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                                            transition duration-200"
                                />
                                </FormControl>
                                <FormMessage className="text-red-600 font-semibold mt-1 flex items-center gap-1" />
                            </FormItem>
                            );
                        }}
                    />
                    {/* Địa điểm */}
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Địa chỉ nhận hàng</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Nhập địa chỉ nhận hàng"
                                className="h-14 resize-none"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-600 font-semibold mt-1 flex items-center gap-1" />
                            </FormItem>
                        )}
                    />
                    {/* Submit */}
                    <div className="self-stretch overflow-hidden flex flex-row items-start justify-center p-3xs text-white">
                        <Button type="submit" variant="default" className="rounded-[5px] w-[250px] h-[50px] flex items-center justify-center text-lg font-bold">
                            GỬI YÊU CẦU
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}