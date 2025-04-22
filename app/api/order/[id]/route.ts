import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
  }

  const orderId = Number(params.id);
  if (isNaN(orderId)) {
    return NextResponse.json({ message: "Invalid orderId" }, { status: 400 });
  }

  const order = await prisma.oRDER.findUnique({
    where: { id: orderId },
    include: {
      orderDetails: {
        include: {
          product: true,
        },
      },
    }
  });

  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  if (order.user_id !== session.id && session.role !== 'admin') {
    return NextResponse.json({ message: "Không có quyền truy cập đơn hàng này" }, { status: 403 });
  }

  return NextResponse.json({ order });
}