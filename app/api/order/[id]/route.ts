// src/app/api/order/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const orderId = parseInt(params.id);

  if (isNaN(orderId)) {
    return NextResponse.json({ message: "Invalid orderId" }, { status: 400 });
  }

  const order = await prisma.oRDER.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      created_at: true,
    },
  });

  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}