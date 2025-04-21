"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/client/context/CartContext";
import { toast } from "sonner";

export default function PagePayment() {
  const { cart, shippingFee, discount, totalPayment, updateCart } = useCart();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingSession, setFetchingSession] = useState(true);
  const [isCartSynced, setIsCartSynced] = useState(false);

  // Log giỏ hàng để debug
  useEffect(() => {
    console.log("Cart in PagePayment:", cart);
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
        toast.error("Không thể lấy thông tin người dùng, vui lòng nhập thủ công");
      } finally {
        setFetchingSession(false);
      }
    };
    fetchUserSession();
  }, []);

  // Chỉ hiển thị thông báo giỏ hàng trống khi đã đồng bộ
  useEffect(() => {
    if (!fetchingSession && isCartSynced && (!cart || cart.length === 0)) {
      toast.warning("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.");
    }
  }, [cart, fetchingSession, isCartSynced]);

  // Xác thực dữ liệu đầu vào
  const validateInputs = () => {
    console.log("Validate inputs:", { name, phone, address, cart, shippingFee, discount, totalPayment });

    if (!name || !name.trim()) {
      console.log("Lỗi validate: Thiếu tên người nhận");
      toast.error("Vui lòng nhập tên người nhận");
      return false;
    }
    if (!phone || !phone.match(/^[0-9]{10,11}$/)) {
      console.log("Lỗi validate: Số điện thoại không hợp lệ");
      toast.error("Số điện thoại phải có 10 hoặc 11 chữ số");
      return false;
    }
    if (!address || !address.trim()) {
      console.log("Lỗi validate: Thiếu địa chỉ giao hàng");
      toast.error("Vui lòng nhập địa chỉ giao hàng");
      return false;
    }
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      console.log("Lỗi validate: Giỏ hàng trống hoặc không hợp lệ", { cart });
      toast.error("Giỏ hàng trống hoặc không hợp lệ");
      return false;
    }
    if (
      shippingFee === undefined ||
      shippingFee === null ||
      discount === undefined ||
      discount === null ||
      totalPayment === undefined ||
      totalPayment === null
    ) {
      console.log("Lỗi validate: Thông tin thanh toán không hợp lệ", {
        shippingFee,
        discount,
        totalPayment,
      });
      toast.error("Thông tin thanh toán không hợp lệ");
      return false;
    }
    // Kiểm tra từng sản phẩm trong giỏ hàng
    for (const item of cart) {
      if (!item.id || !item.name || !item.price || !item.quantity) {
        console.log("Lỗi validate: Sản phẩm không hợp lệ", { item });
        toast.error("Dữ liệu sản phẩm trong giỏ hàng không hợp lệ");
        return false;
      }
    }
    return true;
  };

  // Xử lý đặt hàng
  const handlePlaceOrder = async () => {
    if (!validateInputs()) return;

    try {
      setLoading(true);
      const payload = { name, phone, address, cart, shippingFee, discount, totalPayment };
      console.log("Payload gửi đến /api/order:", payload);

      if (!payload || typeof payload !== "object") {
        throw new Error("Payload không hợp lệ");
      }

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "Không đủ hàng trong kho") {
          const details = data.details
            .map((item: any) => `${item.name}: chỉ còn ${item.availableQuantity}`)
            .join(", ");
          throw new Error(`Không đủ hàng: ${details}`);
        }
        throw new Error(data.message || "Không thể tạo đơn hàng");
      }

      // Xóa giỏ hàng phía client
      await updateCart([]);

      toast.success("Đặt hàng thành công", {
        description: "Đơn hàng của bạn đã được tạo",
        action: {
          label: "Xem đơn hàng",
          onClick: () => router.push(`/client/view?orderId=${data.order.id}`),
        },
      });

      router.push(`/client/view?orderId=${data.order.id}`);
    } catch (err: any) {
      console.error("Đặt hàng thất bại:", err);
      if (err.message.includes("Không đủ hàng")) {
        toast.error(err.message);
      } else if (err.message.includes("Chưa đăng nhập")) {
        toast.error("Vui lòng đăng nhập để đặt hàng");
        router.push("/login");
      } else {
        toast.error("Không thể tạo đơn hàng, vui lòng thử lại sau");
      }
    } finally {
      setLoading(false);
    }
  };

  // Tính tổng tiền tạm tính (tổng giá sản phẩm)
  const totalAmount = cart ? cart.reduce((sum, product) => sum + product.price * product.quantity, 0) : 0;

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex flex-row items-start justify-start py-[30px] px-[100px] gap-[60px] text-left font-inter">
        {/* Left */}
        <div className="w-[500px] flex flex-col gap-4 text-lg text-black">
          <b className="text-[18px]">Thông tin nhận hàng</b>
          {fetchingSession ? (
            <p className="text-gray-500">Đang tải thông tin...</p>
          ) : (
            <>
              <div>
                <label className="font-semibold">Tên người nhận</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-[60px] mt-1"
                  placeholder="Nhập tên người nhận"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="font-semibold">Số điện thoại người nhận</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-[60px] mt-1"
                  placeholder="Nhập số điện thoại"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="font-semibold">Địa chỉ giao hàng</label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-[60px] mt-1"
                  placeholder="Nhập địa chỉ giao hàng"
                  disabled={loading}
                />
              </div>
            </>
          )}
        </div>

        {/* Right */}
        <div className="flex-1 flex flex-col gap-4 text-base text-black">
          <b className="text-[18px]">Đơn hàng</b>
          {cart && cart.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-left">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="px-4 py-2">Sản phẩm</th>
                    <th className="px-4 py-2">Số lượng</th>
                    <th className="px-4 py-2">Đơn giá</th>
                    <th className="px-4 py-2">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((product) => (
                    <tr key={product.id} className="text-foreground border">
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">{product.quantity}</td>
                      <td className="px-4 py-2">{product.price.toLocaleString()}đ</td>
                      <td className="px-4 py-2">{(product.price * product.quantity).toLocaleString()}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">Giỏ hàng trống</p>
          )}

          {/* Tổng hợp */}
          <div className="px-5 flex flex-col gap-2.5">
            <div className="flex justify-between">
              <span className="font-medium">Tạm tính</span>
              <span className="font-medium">{totalAmount.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Phí vận chuyển</span>
              <span className="font-medium">{shippingFee.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Giảm giá</span>
              <span className="font-medium">{discount.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between text-[18px]">
              <span className="font-bold">Tổng cộng</span>
              <span className="font-bold text-primary">{totalPayment.toLocaleString()}đ</span>
            </div>
          </div>

          {/* Button */}
          <div className="px-5 flex justify-between items-center mt-4">
            <div className="flex items-center gap-2 hover:scale-105 transition-all">
              <ArrowLeft className="text-primary" />
              <Link href="/client/cart" className="text-primary">
                Quay về giỏ hàng
              </Link>
            </div>
            <Button
              onClick={handlePlaceOrder}
              disabled={loading || !cart || cart.length === 0 || fetchingSession}
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