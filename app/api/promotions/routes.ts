import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const currentDate = new Date();

    const promotionList = await prisma.pROMOTION.findMany({
      where: {
        day_start: { lte: currentDate },
        day_end: { gte: currentDate },
      },
    });

    return NextResponse.json(promotionList);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu khuyến mãi!" }, { status: 500 });
  }
}