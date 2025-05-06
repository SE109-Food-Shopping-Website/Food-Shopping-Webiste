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

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const orderId = parseInt(params.id);

    // Lấy thông tin đơn hàng và người dùng
    const order = await prisma.oRDER.findUnique({
      where: { id: orderId, user_id: session.id },
      include: { user: true },
    });

    if (!order) {
      return NextResponse.json({ message: "Đơn hàng không tồn tại" }, { status: 404 });
    }

    // Tính điểm loyalty từ giá trị đơn hàng
    const loyaltyPointsEarned = Math.floor(order.totalPrice / 1000); // 1 điểm cho mỗi 1000 VNĐ

    // Cập nhật điểm loyalty và thứ hạng trong transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Cập nhật loyalty_point
      const updatedUser = await tx.uSER.update({
        where: { id: session.id },
        data: {
          loyalty_point: {
            increment: loyaltyPointsEarned,
          },
        },
      });

      // Kiểm tra và cập nhật thứ hạng
      const userRank = await tx.uSER_RANK.findFirst({
        where: {
          min_point: {
            lte: updatedUser.loyalty_point,
          },
        },
        orderBy: {
          min_point: "desc",
        },
      });

      if (userRank && updatedUser.user_rank_id !== userRank.id) {
        await tx.uSER.update({
          where: { id: session.id },
          data: {
            user_rank_id: userRank.id,
          },
        });
      }

      // Cấp khuyến mãi tự động
      const promotionResult = await assignLoyaltyPromotion(session.id);

      // Cập nhật trạng thái đơn hàng
      const newOrder = await tx.oRDER.update({
        where: { id: orderId, user_id: session.id },
        data: {
          status: "COMPLETED",
          paid_at: new Date(),
        },
      });

      return { order: newOrder, promotionResult };
    });

    const response: {
      message: string;
      order: typeof updatedOrder.order;
      promotion?: typeof updatedOrder.promotionResult.promotion;
    } = {
      message: "Cập nhật thành công",
      order: updatedOrder.order,
    };

    if (updatedOrder.promotionResult.success) {
      response.message += ". Khuyến mãi đã được cấp.";
      response.promotion = updatedOrder.promotionResult.promotion;
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Lỗi cập nhật:", error);
    return NextResponse.json({ message: "Lỗi server", error: error.message }, { status: 500 });
  }
}
