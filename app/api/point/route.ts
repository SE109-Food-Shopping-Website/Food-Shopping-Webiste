import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.id) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const user = await prisma.uSER.findUnique({
      where: { id: session.id },
      include: {
        user_rank: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Không tìm thấy người dùng" }, { status: 404 });
    }

    const loyalty_point = user.loyalty_point;
    const currentRank = user.user_rank;

    // Tìm rank tiếp theo (lớn hơn điểm hiện tại)
    const nextRank = await prisma.uSER_RANK.findFirst({
      where: {
        min_point: { gt: loyalty_point },
      },
      orderBy: {
        min_point: "asc",
      },
    });

    return NextResponse.json({
      loyalty_point,
      currentRank: currentRank
        ? { name: currentRank.name, min_point: currentRank.min_point }
        : null,
      nextRank: nextRank
        ? {
            name: nextRank.name,
            required_point: nextRank.min_point - loyalty_point,
          }
        : null,
    });
  } catch (error: any) {
    console.error("Lỗi:", error);
    return NextResponse.json({ message: "Lỗi server", error: error.message }, { status: 500 });
  }
}
