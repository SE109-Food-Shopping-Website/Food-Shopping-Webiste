"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import QuantitySelector from "@/components/ui/quantity";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/client/context/CartContext";
import { Check, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

    interface Provider {
    id: number;
    name: string;
    }

    interface Product {
    id: number;
    name: string;
    price: number;
    images: string[] | null;
    description?: string;
    unit?: string;
    quantity: number;
    sold: number;
    provider_id: number;
    productType_id: number;
    provider?: Provider;
    }

    export default function PageProductDetail() {
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const router = useRouter();
    const { cart, updateCart } = useCart();
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    // Lấy thông tin người dùng từ session
    useEffect(() => {
        const fetchUserSession = async () => {
        try {
            const res = await fetch("/api/auth");
            const data = await res.json();
            if (data.user && data.user.id) {
            setUserId(data.user.id);
            } else {
            console.warn("Không tìm thấy userId trong session:", data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy session:", error);
            toast.error("Không thể lấy thông tin người dùng");
        }
        };
        fetchUserSession();
    }, []);

    // Lấy thông tin sản phẩm
    useEffect(() => {
        const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${id}`);
            if (!res.ok) throw new Error("Không thể lấy thông tin sản phẩm");
            const data = await res.json();
            const parsedImages = Array.isArray(data.images) ? data.images : null;
            setProduct({ ...data, images: parsedImages });
            setSelectedImage(parsedImages?.[0] || null);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
            toast.error("Không thể tải thông tin sản phẩm");
        }
        };

        if (id) {
        fetchProduct();
        }
    }, [id]);

    // Xử lý thêm vào giỏ hàng
    const handleAddToCart = async () => {
        if (!product) {
        toast.error("Không có thông tin sản phẩm");
        return;
        }

        if (!userId) {
        toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
        router.push("/login");
        return;
        }

        setLoading(true);

        try {
        const existingItem = cart.find((item) => item.id === product.id);
        let newCart;

        if (existingItem) {
            const newQuantity = existingItem.quantity + selectedQuantity;
            if (newQuantity > product.quantity) {
            toast.error(`Số lượng vượt quá hàng trong kho (${product.quantity} sản phẩm)`);
            return;
            }
            newCart = cart.map((item) =>
            item.id === product.id ? { ...item, quantity: newQuantity } : item
            );
        } else {
            if (selectedQuantity > product.quantity) {
            toast.error(`Số lượng vượt quá hàng trong kho (${product.quantity} sản phẩm)`);
            return;
            }
            newCart = [
            ...cart,
            {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: selectedQuantity,
            },
            ];
        }

        console.log("Updating cart with:", newCart); // Debug
        await updateCart(newCart);
        toast.success("Thêm vào giỏ hàng thành công", {
            description: "Đã cập nhật giỏ hàng của bạn",
            action: {
            label: "Xem giỏ",
            onClick: () => router.push("/client/cart"),
            },
        });
        } catch (error: any) {
        console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
        toast.error(error.message || "Không thể thêm sản phẩm vào giỏ hàng");
        } finally {
        setLoading(false);
        }
    };

    if (!product) return <div className="p-10">Không tìm thấy sản phẩm</div>;

    return (
        <div className="w-full h-full relative flex flex-col py-[10px] px-[100px] box-border text-left text-11xl text-black font-inter overflow-auto">
        <div className="self-stretch flex flex-row gap-2.5">
            {/* Left */}
            <div className="w-[700px] overflow-hidden shrink-0 flex flex-col items-center justify-start box-border gap-5">
            {/* Ảnh chính */}
            <div className="relative w-[300px] h-[300px] flex items-center justify-center py-[30px]">
                {product.images && product.images.length > 0 ? (
                <>
                    <img
                    src={product.images[currentIndex]}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="object-cover rounded-md transition duration-300"
                    />
                    {product.images.length > 1 && (
                    <>
                        <button
                        onClick={() =>
                            setCurrentIndex((prev) =>
                            prev === 0 ? product.images!.length - 1 : prev - 1
                            )
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                        >
                        ‹
                        </button>
                        <button
                        onClick={() =>
                            setCurrentIndex((prev) =>
                            prev === product.images!.length - 1 ? 0 : prev + 1
                            )
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                        >
                        ›
                        </button>
                    </>
                    )}
                </>
                ) : (
                <span className="text-gray-500">Không có ảnh</span>
                )}
            </div>
            {/* Danh sách các ảnh */}
            {product.images && product.images.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 px-2">
                {product.images.map((img, index) => (
                    <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`border-2 rounded-md overflow-hidden w-[100px] h-[80px] p-2 transition ${
                        index === currentIndex
                        ? "border-primary"
                        : "border-gray-300 hover:border-primary"
                    }`}
                    >
                    <img
                        src={img}
                        alt={`image-${index}`}
                        width={100}
                        height={80}
                        className="object-cover w-full h-full"
                    />
                    </button>
                ))}
                </div>
            )}
            {/* Mô tả */}
            <div className="self-stretch overflow-hidden flex flex-col items-start justify-start p-3xs gap-2.5">
                <b className="relative">Mô tả sản phẩm</b>
                <div className="relative text-[16px] font-medium">
                {product.description || "Không có mô tả"}
                </div>
            </div>
            </div>
            {/* Right */}
            <div className="flex-1 bg-white overflow-hidden flex flex-col items-start justify-start py-[30px] gap-2.5">
            <b className="relative text-[25px]">{product.name}</b>
            <div className="flex flex-row text-[16px] font-medium gap-2.5">
                <div className="relative">Nhà cung cấp:</div>
                <b className="relative">{product.provider?.name || "Đang cập nhật"}</b>
            </div>
            {/* Giá sản phẩm */}
            <div className="flex flex-row items-center gap-2.5">
                <b className="relative text-[25px] text-primary">
                {product.price.toLocaleString()}đ
                </b>
            </div>
            {/* Đơn vị tính */}
            <div className="flex flex-row items-center gap-2.5">
                <div className="relative">Đơn vị tính:</div>
                <b className="relative">{product.unit || "Đang cập nhật"}</b>
            </div>
            <div className="flex flex-col items-start py-2.5 gap-[10px]">
                {/* Số lượng thêm vào giỏ hàng */}
                <div className="flex flex-row items-center gap-[60px]">
                <div className="relative">Số lượng</div>
                <div className="flex flex-row items-center py-[5px] px-2.5">
                    <QuantitySelector
                    cartQuantity={selectedQuantity}
                    onChange={(newQuantity) => {
                        if (newQuantity <= product.quantity) {
                        setSelectedQuantity(newQuantity);
                        } else {
                        toast.error(`Số lượng vượt quá hàng trong kho (${product.quantity} sản phẩm)`);
                        }
                    }}
                    />
                </div>
                </div>
                {/* Số lượng hàng trong kho */}
                <div className="flex flex-row gap-[50px]">
                <div className="relative">Hàng trong kho</div>
                <div className="flex flex-row items-center gap-2.5 text-primary">
                    <b className="relative">{product.quantity} sản phẩm</b>
                </div>
                </div>
                {/* Đã bán */}
                <div className="flex flex-row gap-[80px]">
                <div className="relative">Đã bán</div>
                <div className="flex flex-row items-center gap-2.5 text-primary">
                    <Check className="text-primary" />
                    <b className="relative">{product.sold} sản phẩm</b>
                </div>
                </div>
            </div>
            {/* Button */}
            <div className="w-full flex py-2.5 gap-2.5">
                <Button
                variant="default"
                className="w-[400px] h-[50px] font-bold tracking-tight"
                onClick={handleAddToCart}
                disabled={loading || !product || selectedQuantity <= 0}
                >
                <ShoppingCart strokeWidth={3} className="text-white mr-2" />
                {loading ? "Đang xử lý..." : "THÊM VÀO GIỎ HÀNG"}
                </Button>
            </div>
            </div>
        </div>
        </div>
    );
    }