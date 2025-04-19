import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const session = await getSession(); // Lấy session từ token / cookie
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.id;

    const body = await req.json();
    const { name, phone, address, cart, shippingFee, discount, totalPayment } = body;

    const originalPrice = cart.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const result = await prisma.$transaction(async (prisma) => {
      // Tạo đơn hàng
      const order = await prisma.oRDER.create({
        data: {
          user_id: userId,
          originalPrice,
          shippingFee,
          discountAmount: discount,
          totalPrice: totalPayment,
          note: `Giao cho ${name}, sdt: ${phone}, địa chỉ: ${address}`,
          orderDetails: {
            create: cart.map((item: any) => ({
              product_id: item.id,
              quantity: item.quantity,
              originalPrice: item.price,
              salePrice: item.price,
            })),
          },
        },
        include: {
          orderDetails: true,
        },
      });

      // Cập nhật số lượng tồn kho và đã bán
      for (const item of cart) {
        await prisma.pRODUCT.update({
          where: { id: item.id },
          data: {
            quantity: {
              decrement: item.quantity,
            },
            sold: {
              increment: item.quantity,
            },
          },
        });
      }

      // Xóa giỏ hàng
      await prisma.cART.deleteMany({
        where: { user_id: userId },
      });

      return order;
    });

    return NextResponse.json({ message: "Order created", order: result });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}