"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Định nghĩa kiểu dữ liệu sản phẩm trong giỏ hàng
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

interface CartContextType {
  cart: CartItem[];
  updateCart: (newCart: CartItem[]) => void;
  shippingFee: number;
  discount: number;
  setShippingFee: (fee: number) => void;
  setDiscount: (amount: number) => void;
  totalPayment: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingFee, setShippingFee] = useState<number>(30000); // Mặc định phí ship 30,000đ
  const [discount, setDiscount] = useState<number>(0); // Mặc định không có giảm giá

  // Lấy dữ liệu từ localStorage hoặc API khi component được mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
      localStorage.setItem("cart", JSON.stringify(JSON.parse(storedCart)));
    }
  }, []);

  // Hàm cập nhật giỏ hàng
  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Tính tổng tiền trước khi áp dụng phí ship và giảm giá
  const totalBeforeDiscount = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  // Tính tổng thanh toán
  const totalPayment = totalBeforeDiscount + shippingFee - discount;

  return (
    <CartContext.Provider value={{ cart, updateCart, shippingFee, discount, setShippingFee, setDiscount, totalPayment }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook để sử dụng giỏ hàng
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được dùng bên trong CartProvider");
  }
  return context;
};