"use client";

import { X, Printer, SquarePen, ChevronRight } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import QuantitySelector from "@/components/ui/quantity";
import { useCart } from "@/app/client/context/CartContext";
import { toast } from "sonner";

export default function PageCart() {
  const { cart, updateCart } = useCart();

  // Cập nhật số lượng sản phẩm
  const handleQuantityChange = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    console.log("Before update - Cart:", JSON.stringify(cart, null, 2));

    // Tạo updatedCart với quantity mới, giữ nguyên salePrice
    const updatedCart = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: newQuantity,
            salePrice: item.salePrice ?? item.price,
          }
        : item
    );

    console.log("Updated Cart (before API):", JSON.stringify(updatedCart, null, 2));

    try {
      // Gửi cập nhật giỏ hàng lên API
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: updatedCart,
        }),
      });

      if (!res.ok) {
        throw new Error("Lỗi khi đồng bộ giỏ hàng");
      }

      const data = await res.json();
      console.log("API response - Updated cart:", JSON.stringify(data, null, 2));

      // Cập nhật cart từ API
      updateCart(data.cart || updatedCart);
    } catch (err) {
      console.error("Lỗi khi đồng bộ giỏ hàng:", err);
      toast.error("Lỗi khi cập nhật số lượng, vui lòng thử lại");
      updateCart(updatedCart); // Fallback: cập nhật local
    }
  };

  // Xóa sản phẩm
  const handleRemoveItem = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    updateCart(updatedCart);
  };

  // Tính tổng tiền dựa trên salePrice
  const totalAmount = cart.reduce(
    (sum, product) => sum + (product.salePrice ?? product.price) * product.quantity,
    0
  );

  // Xử lý thanh toán
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
        }),
      });

      if (!res.ok) {
        throw new Error("Lỗi khi gửi giỏ hàng");
      }

      const data = await res.json();
      console.log("Đã lưu giỏ hàng:", data);
      toast.success("Giỏ hàng đã được lưu, chuyển hướng đến thanh toán");

      // Chuyển hướng đến trang thanh toán
      window.location.href = "/client/pay";
    } catch (err) {
      console.error("Lỗi khi gửi giỏ hàng:", err);
      toast.error("Lỗi khi gửi giỏ hàng, vui lòng thử lại");
    }
  };

  // Log cart để debug
  console.log("Current Cart:", JSON.stringify(cart, null, 2));

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex flex-row items-start justify-start py-[30px] px-[100px] gap-[60px]">
        {/* Giỏ hàng */}
        <div className="flex-1 w-[700px] p-2.5 gap-2.5">
          <b className="text-[18px]">Giỏ hàng</b>
          {cart.length === 0 ? (
            <div className="text-gray-500 mt-4">Không có sản phẩm nào trong giỏ hàng</div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-white table-fixed min-w-[700px] border-collapse">
                <thead>
                  <tr className="bg-primary">
                    <th className="px-4 py-2 w-[30%]">Sản phẩm</th>
                    <th className="px-4 py-2 w-[15%]">Đơn giá</th>
                    <th className="px-4 py-2 w-[15%]">Giá sau giảm</th>
                    <th className="px-4 py-2 w-[20%]">Số lượng</th>
                    <th className="px-4 py-2 w-[20%]">Tạm tính</th>
                    <th className="px-2 py-2 w-[10%]"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((product) => (
                    <tr key={product.id} className="text-foreground border-t border-gray-300 min-h-[60px]">
                      <td className="px-4 py-2 w-auto">{product.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{product.price.toLocaleString()}đ</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {(product.salePrice ?? product.price).toLocaleString()}đ
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex justify-center min-w-[80px]">
                          <QuantitySelector
                            cartQuantity={product.quantity}
                            onChange={(newQuantity) => handleQuantityChange(product.id, newQuantity)}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {((product.salePrice ?? product.price) * product.quantity).toLocaleString()}đ
                      </td>
                      <td className="px-2 py-2">
                        <button onClick={() => handleRemoveItem(product.id)}>
                          <X className="text-black cursor-pointer hover:opacity-70" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Thanh toán */}
        {cart.length > 0 && (
          <div className="w-[400px] relative rounded-[5px] border-primary border-solid border-[3px] box-border overflow-hidden shrink-0 flex flex-col items-start justify-start py-4 px-2 gap-[10px] text-left text-base font-inter">
            <div className="self-stretch flex flex-row items-start justify-between py-0 px-5 gap-0 text-[16px] text-black">
              <b className="relative leading-[130%]">TỔNG CỘNG</b>
              <b className="relative leading-[130%] text-primary">{totalAmount.toLocaleString()}đ</b>
            </div>
            <div className="self-stretch flex flex-col items-center justify-start text-[20px] text-white">
              <Button
                asChild
                className="w-full rounded-[5px] bg-primary h-[50px] gap-5 cursor-pointer"
                onClick={handleCheckout}
              >
                <b className="text-white">THANH TOÁN</b>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}