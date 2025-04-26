import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function POST(req: NextRequest) {
  try {
    const { orderId, reason } = await req.json();

    if (!orderId || !reason) {
      return NextResponse.json({ message: "Thiếu orderId hoặc lý do" }, { status: 400 });
    }

    const existingOrder = await prisma.oRDER.findUnique({
      where: { id: Number(orderId) },
    });

    if (!existingOrder) {
      return NextResponse.json({ message: "Không tìm thấy đơn hàng" }, { status: 404 });
    }

    if (existingOrder.status === "REQUEST") {
      return NextResponse.json({ message: "Đơn hàng đã được yêu cầu trả hàng trước đó" }, { status: 400 });
    }

    if (existingOrder.status !== "COMPLETED") {
      return NextResponse.json({
        message: "Chỉ có thể yêu cầu trả hàng khi đơn hàng đã hoàn thành (COMPLETED)",
      }, { status: 400 });
    }
    
    await prisma.oRDER.update({
      where: { id: Number(orderId) },
      data: {
        status: "REQUEST",
        reason: reason,
        form_submitted_at: new Date(),
      },
    });

    return NextResponse.json({ message: "Yêu cầu trả hàng thành công" });
  } catch (error) {
    console.error("Lỗi API yêu cầu trả hàng:", error);
    return NextResponse.json({ message: "Lỗi máy chủ khi yêu cầu trả hàng" }, { status: 500 });
  }
}