import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Lấy danh sách đơn đặt hàng
export async function GET() {
  try {
    const clients = await prisma.oRDER.findMany({
        where: {
            status: 'RETURN', // Lọc đơn hàng có status là 'RETURN'
          },
    });
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu!" }, { status: 500 });
  }
}
