import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const userId = session.id;
    const promotionId = req.nextUrl.searchParams.get("promotionId");

    if (!promotionId) {
      return NextResponse.json({ message: "Thiếu promotionId" }, { status: 400 });
    }

    // Kiểm tra xem người dùng đã sử dụng khuyến mãi chưa
    const promotionUser = await prisma.pROMOTION_USER.findFirst({
      where: {
        user_id: userId,
        promotion_id: parseInt(promotionId),
        used_at: { not: null }, // Chỉ tính các khuyến mãi đã sử dụng
      },
    });

    if (promotionUser) {
      return NextResponse.json({ canUse: false, message: "Bạn đã sử dụng khuyến mãi này" }, { status: 200 });
    }

    return NextResponse.json({ canUse: true }, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi khi kiểm tra khuyến mãi:", error);
    return NextResponse.json({ message: "Lỗi khi kiểm tra khuyến mãi", error: error.message }, { status: 500 });
  }
}