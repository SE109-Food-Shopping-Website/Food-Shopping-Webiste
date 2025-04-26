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

    if (existingOrder.status === "CANCELLED") {
      return NextResponse.json({ message: "Đơn hàng đã bị hủy trước đó" }, { status: 400 });
    }

    if (existingOrder.status !== "PENDING") {
      return NextResponse.json({
        message: "Chỉ có thể hủy đơn hàng đang chờ xử lý (PENDING)",
      }, { status: 400 });
    }
    
    await prisma.oRDER.update({
      where: { id: Number(orderId) },
      data: {
        status: "CANCELLED",
        reason: reason,
        form_submitted_at: new Date(),
      },
    });

    return NextResponse.json({ message: "Hủy đơn hàng thành công" });
  } catch (error) {
    console.error("Lỗi API hủy đơn:", error);
    return NextResponse.json({ message: "Lỗi máy chủ khi hủy đơn" }, { status: 500 });
  }
}