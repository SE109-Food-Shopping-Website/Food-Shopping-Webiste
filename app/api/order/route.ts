import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

// Tạo đơn hàng (POST)
export async function POST(req: Request) {
  try {
    const session = await getSession();
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

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.oRDER.create({
        data: {
          user_id: userId,
          originalPrice,
          shippingFee,
          discountAmount: discount,
          totalPrice: totalPayment,
          note: `Giao cho ${name}, sđt: ${phone}, địa chỉ: ${address}`,
          status: "PENDING",
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

      for (const item of cart) {
        await tx.pRODUCT.update({
          where: { id: item.id },
          data: {
            quantity: { decrement: item.quantity },
            sold: { increment: item.quantity },
          },
        });
      }

      await tx.cART.deleteMany({
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

// Lấy đơn hàng theo status (GET)
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.id;
  type ORDER_status_enum = "PENDING" | "PROCESSING" | "SHIPPING" | "COMPLETED" | "CANCELLED"; 
  const status = req.nextUrl.searchParams.get("status") as ORDER_status_enum | undefined; 

  try {
    const orders = await prisma.oRDER.findMany({
      where: {
        user_id: userId,
        ...(status ? { status } : {}), 
      },
      include: {
        orderDetails: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ message: "Error fetching orders" }, { status: 500 });
  }
}