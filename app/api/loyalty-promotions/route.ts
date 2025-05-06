import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

// Hàm cấp khuyến mãi dựa trên loyalty_point
async function assignLoyaltyPromotion(userId: number) {
  try {
    // Lấy thông tin người dùng
    const user = await prisma.uSER.findUnique({
      where: { id: userId },
      include: { user_rank: true },
    });

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    // Xác định hạng dựa trên loyalty_point
    const ranks = await prisma.uSER_RANK.findMany({
      orderBy: { min_point: "desc" },
    });

    let newRank = ranks.find((rank) => user.loyalty_point >= rank.min_point);
    if (!newRank) {
      return { success: false, message: "Không đủ điểm để nhận khuyến mãi hạng" };
    }

    // Cập nhật user_rank_id nếu cần
    if (user.user_rank_id !== newRank.id) {
      await prisma.uSER.update({
        where: { id: userId },
        data: { user_rank_id: newRank.id },
      });
    }

    // Kiểm tra tổng số bản ghi PROMOTION_USER (bao gồm cả chưa sử dụng)
    const totalPromotions = await prisma.pROMOTION_USER.count({
      where: {
        user_id: userId,
        promotion: { status: "LOYALTY" },
      },
    });

    if (totalPromotions >= newRank.max_promotion) {
      return { success: false, message: "Đã đạt giới hạn khuyến mãi cho hạng này" };
    }

    // Tìm khuyến mãi loyalty hiện có cho hạng
    const promotion = await prisma.pROMOTION.findFirst({
      where: {
        status: "LOYALTY",
        name: `Khuyến mãi hạng ${newRank.name}`,
      },
    });

    if (!promotion) {
      throw new Error(`Không tìm thấy khuyến mãi cho hạng ${newRank.name}`);
    }

    // Tạo liên kết PROMOTION_USER
    const promotionUser = await prisma.pROMOTION_USER.create({
      data: {
        user_id: userId,
        promotion_id: promotion.id,
      },
    });

    return { success: true, promotion };
  } catch (error: any) {
    console.error("Lỗi khi cấp khuyến mãi:", error);
    return { success: false, message: error.message };
  }
}

// Lấy danh sách khuyến mãi hạng (GET)
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const userId = session.id;

    // Lấy thông tin người dùng
    const user = await prisma.uSER.findUnique({
      where: { id: userId },
      include: { user_rank: true },
    });

    if (!user) {
      return NextResponse.json({ message: "Không tìm thấy người dùng" }, { status: 404 });
    }

    // Lấy danh sách khuyến mãi chưa sử dụng, loại bỏ trùng lặp dựa trên promotion_id
    const promotions = await prisma.pROMOTION_USER.findMany({
      where: {
        user_id: userId,
        used_at: null,
        promotion: { status: "LOYALTY" },
      },
      include: {
        promotion: true,
      },
      distinct: ['promotion_id'], // Chỉ lấy một bản ghi cho mỗi promotion_id
    });

    return NextResponse.json({
      loyaltyPromotions: promotions.map((p) => ({
        id: p.promotion.id,
        name: p.promotion.name,
        value: p.promotion.value,
        discount_max: p.promotion.discount_max,
        order_min: p.promotion.order_min || 0,
      })),
      max_promotion: user.user_rank?.max_promotion || 0,
    }, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi khi lấy khuyến mãi hạng:", error);
    return NextResponse.json({ message: "Lỗi khi lấy khuyến mãi", error: error.message }, { status: 500 });
  }
}

// Cấp khuyến mãi dựa trên loyalty_point (POST)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const userId = session.id;
    const result = await assignLoyaltyPromotion(userId);

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Cấp khuyến mãi thành công", promotion: result.promotion }, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi khi cấp khuyến mãi:", error);
    return NextResponse.json({ message: "Lỗi khi cấp khuyến mãi", error: error.message }, { status: 500 });
  }
}
