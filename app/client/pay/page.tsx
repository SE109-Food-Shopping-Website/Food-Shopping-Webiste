"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/client/context/CartContext";
import { toast } from "sonner";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  productTypeId?: number;
  salePrice?: number;
  couponId?: number | null;
};

type Promotion = {
  id: number;
  name: string;
  value: number;
  order_min: number;
  discount_max: number;
  day_start: string;
  day_end: string;
  status: string;
};

export default function PagePayment() {
  const { cart, shippingFee, updateCart } = useCart();
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingSession, setFetchingSession] = useState<boolean>(true);
  const [isCartSynced, setIsCartSynced] = useState<boolean>(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loyaltyPromotions, setLoyaltyPromotions] = useState<Promotion[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<string | null>(null);
  const [discountedCart, setDiscountedCart] = useState<CartItem[]>([]);
  const [promotionDiscount, setPromotionDiscount] = useState<number>(0);

  // Log giỏ hàng
  useEffect(() => {
    console.log("Cart in PagePayment:", JSON.stringify(cart, null, 2));
    if (cart && Array.isArray(cart) && cart.length > 0) {
      setIsCartSynced(true);
    }
  }, [cart]);

  // Lấy thông tin người dùng từ session
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();
        if (data.user) {
          setName(data.user.name || "");
          setPhone(data.user.phone || "");
          setAddress(data.user.address || "");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin session:", error);
        toast.error("Không thể lấy thông tin người dùng");
      } finally {
        setFetchingSession(false);
      }
    };
    fetchUserSession();
  }, []);

  // Lấy danh sách khuyến mãi thông thường
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("/api/promotions");
        if (!res.ok) throw new Error("Không tìm thấy API khuyến mãi");
        const data = await res.json();
        setPromotions(data);
      } catch (error) {
        console.error("Lỗi khi lấy khuyến mãi:", error);
        toast.error("Không thể tải danh sách khuyến mãi");
        setPromotions([]);
      }
    };
    fetchPromotions();
  }, []);

  // Lấy và cấp khuyến mãi hạng
  useEffect(() => {
    const fetchAndAssignLoyaltyPromotions = async () => {
      try {
        // Cấp khuyến mãi tự động
        const assignRes = await fetch("/api/loyalty-promotions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!assignRes.ok) {
          const errorData = await assignRes.json();
          console.warn("Không cấp được khuyến mãi:", errorData.message);
        }

        // Lấy danh sách khuyến mãi
        const fetchRes = await fetch("/api/loyalty-promotions");
        if (!fetchRes.ok) throw new Error("Không tìm thấy API khuyến mãi hạng");
        const data = await fetchRes.json();
        setLoyaltyPromotions(data.loyaltyPromotions);
      } catch (error) {
        console.error("Lỗi khi xử lý khuyến mãi hạng:", error);
        toast.error("Không thể tải danh sách khuyến mãi hạng");
        setLoyaltyPromotions([]);
      }
    };
    fetchAndAssignLoyaltyPromotions();
  }, []);

  // Áp dụng salePrice từ giỏ hàng
  useEffect(() => {
    if (cart && cart.length > 0) {
      const newDiscountedCart = cart.map((item: CartItem) => ({
        ...item,
        salePrice: item.salePrice ?? item.price,
        couponId: item.couponId ?? null,
      }));
      setDiscountedCart(newDiscountedCart);
      console.log("DiscountedCart:", JSON.stringify(newDiscountedCart, null, 2));
    } else {
      setDiscountedCart([]);
    }
  }, [cart]);

  // Tính giảm giá khuyến mãi
  const calculatePromotionDiscount = async (): Promise<number> => {
    if (!selectedPromotion) return 0;

    const promotion = [...promotions, ...loyaltyPromotions].find((p) => p.id === parseInt(selectedPromotion));
    if (!promotion) {
      toast.warning("Khuyến mãi không hợp lệ");
      setSelectedPromotion(null);
      return 0;
    }

    const totalAmount = discountedCart.reduce(
      (sum, product) => sum + (product.salePrice ?? product.price) * product.quantity,
      0
    );

    if (totalAmount < promotion.order_min) {
      toast.warning(`Đơn hàng chưa đạt ${promotion.order_min.toLocaleString()}đ`);
      setSelectedPromotion(null);
      return 0;
    }

    const discount = (totalAmount * promotion.value) / 100;
    return Math.min(discount, promotion.discount_max);
  };

  // Cập nhật promotionDiscount
  useEffect(() => {
    const updatePromotionDiscount = async () => {
      const discount = await calculatePromotionDiscount();
      setPromotionDiscount(discount);
    };
    updatePromotionDiscount();
  }, [selectedPromotion, discountedCart]);

  // Xác thực đầu vào
  const validateInputs = (): boolean => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên");
      return false;
    }
    if (!phone.match(/^[0-9]{10,11}$/)) {
      toast.error("Số điện thoại không hợp lệ");
      return false;
    }
    if (!address.trim()) {
      toast.error("Vui lòng nhập địa chỉ");
      return false;
    }
    if (!discountedCart.length) {
      toast.error("Giỏ hàng trống");
      return false;
    }
    return true;
  };

  // Xử lý đặt hàng
  const handlePlaceOrder = async () => {
    if (!validateInputs()) return;

    const originalTotal = discountedCart.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const discountedTotal = discountedCart.reduce(
      (sum, product) => sum + (product.salePrice ?? product.price) * product.quantity,
      0
    );
    const shippingFeeValue = typeof shippingFee === "number" ? shippingFee : 30000;
    const totalPayment = discountedTotal + shippingFeeValue - promotionDiscount;

    try {
      setLoading(true);

      const payload = {
        cartItems: discountedCart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          salePrice: item.salePrice ?? item.price,
          couponId: item.couponId ?? null,
        })),
        promotionId: selectedPromotion ? parseInt(selectedPromotion) : null,
        address,
        name,
        phone,
      };

      console.log("Payload gửi lên API:", JSON.stringify(payload, null, 2));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi đặt hàng");

      await updateCart([]);
      toast.success("Đặt hàng thành công", {
        action: {
          label: "Xem",
          onClick: () => router.push(`/client/view?orderId=${data.order.id}`),
        },
      });
      router.push(`/client/view?orderId=${data.order.id}`);
    } catch (err: any) {
      console.error("Lỗi khi đặt hàng:", err);
      toast.error(err.message || "Không thể đặt hàng");
    } finally {
      setLoading(false);
    }
  };

  // Tính toán giá trị hiển thị
  const originalTotal = discountedCart.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );
  const discountedTotal = discountedCart.reduce(
    (sum, product) => sum + (product.salePrice ?? product.price) * product.quantity,
    0
  );
  const totalPayment = discountedTotal + (shippingFee ?? 0) - promotionDiscount;

  console.log("OriginalTotal:", originalTotal);
  console.log("DiscountedTotal:", discountedTotal);
  console.log("PromotionDiscount:", promotionDiscount);
  console.log("TotalPayment:", totalPayment);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex flex-row items-start justify-start py-[30px] px-[100px] gap-[60px] text-left font-inter">
        <div className="w-[500px] flex flex-col gap-4 text-lg text-black">
          <b className="text-[18px]">Thông tin nhận hàng</b>
          {fetchingSession ? (
            <p>Đang tải...</p>
          ) : (
            <>
              <div className="flex flex-col w-full">
                <label className="font-semibold mb-1 text-[16px]">Tên người nhận</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-[60px] w-full text-sm"
                  placeholder="Nhập tên người nhận"
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="font-semibold mb-1 text-[16px]">Số điện thoại người nhận</label>
                <Input
                  className="w-full h-[60px] text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại người nhận"
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="font-semibold mb-1 text-[16px]">Địa chỉ giao hàng</label>
                <Textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full min-h-[80px] resize-none px-4"
                  placeholder="Nhập địa chỉ giao hàng"
                  disabled={loading}
                />
              </div>
            </>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-4 text-base text-black">
          <b className="text-[18px]">Đơn hàng</b>
          {discountedCart.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-2">Sản phẩm</th>
                  <th className="px-4 py-2">Số lượng</th>
                  <th className="px-4 py-2">Đơn giá</th>
                  <th className="px-4 py-2">Giá sau giảm</th>
                  <th className="px-4 py-2">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {discountedCart.map((product) => (
                  <tr key={product.id} className="border">
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">{product.quantity}</td>
                    <td className="px-4 py-2">{product.price.toLocaleString()}đ</td>
                    <td className="px-4 py-2">{(product.salePrice ?? product.price).toLocaleString()}đ</td>
                    <td className="px-4 py-2">{((product.salePrice ?? product.price) * product.quantity).toLocaleString()}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">Giỏ hàng trống</p>
          )}
          <div className="px-5 flex flex-col gap-2.5">
            <label className="font-semibold text-[16px]">Chọn khuyến mãi</label>
            <Select
              value={selectedPromotion || ""}
              onValueChange={setSelectedPromotion}
              disabled={loading || (!promotions.length && !loyaltyPromotions.length)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn khuyến mãi" />
              </SelectTrigger>
              <SelectContent>
                {[...loyaltyPromotions, ...promotions]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .filter((promo, index, self) => index === self.findIndex((p) => p.name === promo.name))
                  .map((promo) => (
                    <SelectItem key={promo.id} value={promo.id.toString()}>
                      {promo.name} - Giảm {promo.value}% (Tối đa {promo.discount_max.toLocaleString()}đ, Đơn tối thiểu {promo.order_min.toLocaleString()}đ)
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="px-5 flex flex-col gap-2.5">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{discountedTotal.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between">
              <span>Giảm giá sản phẩm</span>
              <span>{(originalTotal - discountedTotal).toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between">
              <span>Giảm giá khuyến mãi</span>
              <span>{promotionDiscount.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>{(shippingFee ?? 0).toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between text-[18px]">
              <span className="font-bold">Tổng cộng</span>
              <span className="font-bold text-primary">{totalPayment.toLocaleString()}đ</span>
            </div>
          </div>
          <div className="px-5 flex justify-between items-center mt-4">
            <div className="flex items-center gap-2 hover:scale-105 transition-all">
              <ArrowLeft className="text-primary" />
              <Link href="/client/cart" className="text-primary">
                Quay về giỏ hàng
              </Link>
            </div>
            <Button
              onClick={handlePlaceOrder}
              disabled={loading || !discountedCart.length || fetchingSession}
              className="border-2 border-primary bg-primary text-white px-5 py-2.5 font-semibold hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "ĐẶT HÀNG"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}