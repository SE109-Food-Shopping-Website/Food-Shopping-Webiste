"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type OrderDetail = {
  id: string;
  product: {
    images: string;
    name: string;
    unit: string;
  };
  quantity: number;
  salePrice: number;
};

export default function PageMyRating() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/order/?status=COMPLETED");
        const data = await res.json();
        const filtered = data.filter(
          (order: any) => order.feedbacks && order.feedbacks.length > 0
        );
        setOrders(filtered);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="w-full min-h-screen p-6">
        <h1 className="text-[25px] font-bold mb-6 text-center">Đánh giá của tôi</h1>
        {loading ? (
            <div className="text-center text-gray-500 text-lg">Đang tải dữ liệu...</div>
        ) : orders.length > 0 ? (
            <Accordion type="multiple" className="w-full space-y-4">
                {orders.map((order) => (
                    <AccordionItem
                    key={order.id}
                    value={order.id}
                    className="border border-gray-200 rounded-lg"
                    >
                    <AccordionTrigger className="text-lg px-4 py-3 bg-gray-100 rounded-t-lg font-medium flex justify-between items-center">
                        <span>
                        Đơn hàng #{String(order.id).slice(0, 8)}-{" "}
                        <span className="text-primary">
                            {order.totalPrice.toLocaleString()}đ
                        </span>
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="bg-white px-4 py-4 space-y-4">
                        {/* Sản phẩm */}
                        {order.orderDetails.map((detail: OrderDetail) => {
                        let imageSrc = "/ava.png";
                        try {
                            const parsedImages = JSON.parse(detail.product.images);
                            if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                            imageSrc = parsedImages[0];
                            }
                        } catch {}

                        return (
                            <Link
                            key={detail.id}
                            href={`/client/history/order_detail/${order.id}`}
                            className="flex items-center gap-4 p-3 border rounded-md hover:bg-gray-50"
                            >
                            <img
                                src={imageSrc}
                                alt={detail.product.name}
                                className="w-[40px] h-[40px] rounded object-cover"
                            />
                            <div className="flex flex-col text-sm">
                                <span className="font-semibold text-primary">
                                {detail.product.name}
                                </span>
                                <span>Đơn vị: {detail.product.unit}</span>
                                <span>Số lượng: x{detail.quantity}</span>
                                <span className="text-[13px] text-muted-foreground">
                                {detail.salePrice.toLocaleString()}đ
                                </span>
                            </div>
                            </Link>
                        );
                        })}
                        {/* Accordion cho Feedback */}
                        <Accordion type="single" collapsible className="pt-4">
                            <AccordionItem value={`feedback-${order.id}`}>
                                <AccordionTrigger className="text-base font-medium text-foreground text-[14px]">
                                    Hiển thị đánh giá ({order.feedbacks.length})
                                </AccordionTrigger>
                                <AccordionContent className="space-y-3 pt-2">
                                {order.feedbacks.map((fb: any) => (
                                    <div
                                    key={fb.id}
                                    className="border-l-4 border-yellow-400 bg-yellow-50 p-3 rounded-md text-sm"
                                    >
                                    <div>
                                        <b>Rating:</b>{" "}
                                        <span className="text-yellow-600">{fb.rating}/5</span>
                                    </div>
                                    <div>
                                        <b>Bình luận:</b> {fb.comment || "Không có nội dung"}
                                    </div>
                                    {fb.images && (
                                        <div className="flex gap-2 mt-2">
                                        {JSON.parse(fb.images).map(
                                            (img: string, i: number) => (
                                            <img
                                                key={i}
                                                src={img}
                                                className="w-[60px] h-[60px] object-cover rounded"
                                                alt={`feedback-img-${i}`}
                                            />
                                            )
                                        )}
                                        </div>
                                    )}
                                    </div>
                                ))}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        ) : (
            <div className="text-gray-500 text-lg">Không có đơn hàng nào</div>
        )}
    </div>
  );
}