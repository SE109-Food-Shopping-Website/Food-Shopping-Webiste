import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Lấy danh sách đơn bị hủy
export async function GET() {
  try {
    const clients = await prisma.oRDER.findMany({
        where: {
            status: 'CANCELLED', // Lọc đơn hàng có status là 'CANCELLED'
          },
    });
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu!" }, { status: 500 });
  }
}
