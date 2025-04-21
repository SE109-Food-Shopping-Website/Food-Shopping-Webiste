"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  shippingFee: number;
  discount: number;
  totalPayment: number;
  updateCart: (items: CartItem[]) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingFee] = useState(30000); // Giả định
  const [discount] = useState(0); // Giả định
  const [totalPayment, setTotalPayment] = useState(0);

  // Đồng bộ giỏ hàng với backend
  const syncCartWithBackend = async (retries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await fetch("/api/cart", { cache: "no-store" });
        console.log(`Phản hồi từ /api/cart (thử lần ${attempt}):`, {
          status: res.status,
          statusText: res.statusText,
        });

        // Kiểm tra trạng thái phản hồi
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Chưa đăng nhập");
          }
          throw new Error(`Lỗi HTTP: ${res.status} ${res.statusText}`);
        }

        // Kiểm tra xem body có tồn tại không
        const text = await res.text();
        if (!text) {
          console.warn(`Phản hồi từ /api/cart rỗng (thử lần ${attempt})`);
          setCart([]);
          toast.warning("Giỏ hàng trống hoặc không thể tải");
          return;
        }

        // Cố gắng parse JSON
        let data;
        try {
          data = JSON.parse(text);
        } catch (error) {
          console.error(`Lỗi parse JSON (thử lần ${attempt}):`, error);
          throw new Error("Phản hồi từ server không phải JSON hợp lệ");
        }

        console.log(`Data từ /api/cart (thử lần ${attempt}):`, data);

        if (data.cart && Array.isArray(data.cart)) {
          setCart(data.cart);
          const totalAmount = data.cart.reduce(
            (sum: number, item: CartItem) => sum + item.price * item.quantity,
            0
          );
          setTotalPayment(totalAmount + shippingFee - discount);
          return;
        } else {
          console.warn(`Giỏ hàng không hợp lệ từ /api/cart:`, data);
          setCart([]);
          toast.warning("Giỏ hàng trống hoặc không hợp lệ");
        }
      } catch (error: any) {
        console.error(`Lỗi khi đồng bộ giỏ hàng (thử lần ${attempt}):`, error);
        if (attempt === retries) {
          setCart([]);
          toast.error(error.message || "Không thể tải giỏ hàng, vui lòng thử lại sau");
        }
      }
      // Đợi trước khi thử lại
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  };

  // Cập nhật giỏ hàng
  const updateCart = async (items: CartItem[]) => {
    try {
      if (!items || !Array.isArray(items)) {
        throw new Error("Dữ liệu giỏ hàng không hợp lệ");
      }
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const text = await res.text();
      if (!res.ok) {
        let errorData;
        try {
          errorData = text ? JSON.parse(text) : {};
        } catch {
          throw new Error(`Lỗi HTTP: ${res.status} ${res.statusText}`);
        }
        throw new Error(errorData.error || "Không thể cập nhật giỏ hàng");
      }

      let data;
      try {
        data = text ? JSON.parse(text) : { cart: [] };
      } catch {
        throw new Error("Phản hồi từ server không phải JSON hợp lệ");
      }

      console.log("Data từ POST /api/cart:", data);

      if (data.cart && Array.isArray(data.cart)) {
        setCart(data.cart);
        const totalAmount = data.cart.reduce(
          (sum: number, item: CartItem) => sum + item.price * item.quantity,
          0
        );
        setTotalPayment(totalAmount + shippingFee - discount);
        toast.success("Đã cập nhật giỏ hàng");
      } else {
        throw new Error("Dữ liệu giỏ hàng trả về không hợp lệ");
      }
    } catch (error: any) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
      toast.error(error.message || "Không thể cập nhật giỏ hàng, vui lòng thử lại");
      // Đồng bộ lại giỏ hàng nếu cập nhật thất bại
      await syncCartWithBackend();
    }
  };

  // Tải giỏ hàng khi mount
  useEffect(() => {
    syncCartWithBackend();
  }, []);

  return (
    <CartContext.Provider value={{ cart, shippingFee, discount, totalPayment, updateCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}