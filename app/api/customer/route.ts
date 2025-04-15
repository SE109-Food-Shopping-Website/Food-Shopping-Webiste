import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Lấy danh sách khách hàng
export async function GET() {
  try {
    const clients = await prisma.uSER.findMany({
      where: {
        role_id: 2,
      },
    });
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu!" }, { status: 500 });
  }
}
