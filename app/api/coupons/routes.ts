import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const currentDate = new Date();

    const couponList = await prisma.cOUPON.findMany({
      where: {
        start_at: { lte: currentDate },
        end_at: { gte: currentDate },
      },
    });

    return NextResponse.json(couponList);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu phiếu giảm giá!" }, { status: 500 });
  }
}