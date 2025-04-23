"use client";

import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useForm, FormProvider} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  reason: z.string().min(1, "Hãy chọn lý do"),
});

async function cancelOrder(orderId: string, reason: string) {
  const res = await fetch("/api/order/cancel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, reason }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Hủy đơn thất bại");
  }

  return await res.json();
}

export default function PageOrderCancel() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  });

  const [selectedReason, setSelectedReason] = useState("Chọn lý do hủy đơn hàng");
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  function handleSelectReason(reason: string) {
    setSelectedReason(reason);
    form.setValue("reason", reason);
  }

  const formatPrice = (price?: number) => price?.toLocaleString() ?? "0";

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      toast.loading("Đang gửi yêu cầu hủy...");
      await cancelOrder(id as string, values.reason);
      toast.success("Đã gửi yêu cầu hủy đơn thành công!");
      setTimeout(() => {
        router.push("/client/history/cancelled");
      }, 1500);
    } catch (error: any) {
      console.error("Lỗi khi gửi yêu cầu hủy:", error);
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
        <b className="relative">Yêu cầu Hủy đơn</b>
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
          <FormField
            control={form.control}
            name="reason"
            render={() => (
              <FormItem>
                <FormLabel>Lý do hủy đơn hàng</FormLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full border border-gray-300 rounded px-4 py-2 flex justify-between items-center">
                    <span>{selectedReason}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[1200px]">
                    {["Không có nhu cầu mua nữa", "Ghi nhầm địa chỉ", "Đặt nhầm", "Lý do khác"].map((item) => (
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
        </form>
      </FormProvider>
      <div className="self-stretch overflow-hidden flex flex-row items-start justify-center p-3xs text-white">
        <Button type="submit" onClick={form.handleSubmit(onSubmit)} className="rounded-[5px] w-[300px] h-[50px] flex items-center justify-center text-lg font-bold">
          GỬI YÊU CẦU
        </Button>
      </div>
    </div>
  );
}