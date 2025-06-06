"use client"
 
import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function PageRequest() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/order/?status=REQUEST");
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
        };

        fetchOrders();
    }, []);

    return (
        <div className="w-full min-h-screen flex flex-col">
            <div className="flex-1 flex flex-col items-center text-left text-white font-inter">
                <div className="w-full h-full relative px-4 py-4 flex flex-col items-center gap-[30px]">
                {loading ? (
                    <div className="text-gray-500 text-lg">Đang tải dữ liệu...</div>
                ) : orders.length > 0 ? (
                    orders.map((order) => {
                    const displayedItems = order.orderDetails.slice(0, 2);
                    const remainingCount = order.orderDetails.length - displayedItems.length;
                    return (
                        <div
                        key={order.id}
                        className="w-[1240px] bg-white rounded-[3px] px-4 py-6 flex flex-col gap-4 border border-gray-200 shadow-sm"
                        >
                        <div className="w-full flex px-2 py-2 bg-[#F9FAFB] border border-gray-200 rounded-md flex-col gap-4">
                            {displayedItems.map((detail: OrderDetail) => {
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
                                <Link
                                    key={detail.id}
                                    href={`/client/history/order_detail/${order.id}`}
                                    className="w-full rounded-[5px] flex flex-row items-center justify-between flex-wrap p-3 gap-y-4 hover:bg-gray-50"
                                >
                                    <div className="flex flex-row items-center gap-5">
                                        <img
                                        className="w-[50px] h-[50px] rounded-full"
                                        src={imageSrc}
                                        alt={detail.product.name}
                                        />
                                        <div className="flex flex-col">
                                        <b className="text-[18px] text-primary">
                                            {detail.product.name}
                                        </b>
                                        <div className="text-[16px] text-foreground">
                                            Đơn vị tính: {detail.product.unit}
                                        </div>
                                        <div className="text-base text-foreground">
                                            x {detail.quantity}
                                        </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end text-base">
                                        <b className="text-primary text-[18px]">
                                        {detail.salePrice.toLocaleString()}đ
                                        </b>
                                    </div>
                                </Link>
                            );
                            })}
                            {remainingCount > 0 && (
                            <div className="px-3 text-base text-foreground text-[14px]">
                                ...và {remainingCount} sản phẩm khác
                            </div>
                            )}
                            <div className="w-full flex flex-row items-center justify-end gap-2 text-base px-3">
                                <div className="font-medium text-foreground">
                                    Tổng số tiền:{" "}
                                    <b className="text-primary">
                                    {order.totalPrice.toLocaleString()}đ
                                    </b>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex flex-row items-center justify-end gap-3 text-base">
                            <b className="font-medium italic text-foreground text-[14px]">Yêu cầu trả hàng đang được xét duyệt</b>
                        </div>
                        </div>
                    );
                    })
                ) : (
                    <div className="text-gray-500 text-lg">Không có đơn hàng nào</div>
                )}
                </div>
            </div>
        </div>
    );
}