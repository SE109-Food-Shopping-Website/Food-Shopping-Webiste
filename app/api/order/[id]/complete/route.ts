import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

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
      include: { user: true }, // Lấy thông tin người dùng liên quan
    });

    if (!order) {
      return NextResponse.json({ message: "Đơn hàng không tồn tại" }, { status: 404 });
    }

    // Tính điểm loyalty từ giá trị đơn hàng
    const loyaltyPointsEarned = Math.floor(order.totalPrice / 1000); // Cứ mỗi 1000 VNĐ là 1 điểm

    // Cập nhật điểm loyalty cho người dùng
    const updatedUser = await prisma.uSER.update({
      where: { id: session.id },
      data: {
        loyalty_point: (await prisma.uSER.findUnique({ where: { id: session.id } }))!.loyalty_point + loyaltyPointsEarned, // Cộng điểm vào loyalty_point của người dùng
      },
    });

    // Kiểm tra và cập nhật thứ hạng người dùng
    const userRank = await prisma.uSER_RANK.findFirst({
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
        await prisma.uSER.update({
        where: { id: session.id },
        data: {
            user_rank_id: userRank.id,
        },
        });
    }


    // Cập nhật trạng thái đơn hàng
    const updatedOrder = await prisma.oRDER.update({
      where: { id: orderId, user_id: session.id },
      data: {
        status: "COMPLETED",
        paid_at: new Date(),
      },
    });

    return NextResponse.json({ message: "Cập nhật thành công", order: updatedOrder });
  } catch (error: any) {
    console.error("Lỗi cập nhật:", error);
    return NextResponse.json({ message: "Lỗi server", error: error.message }, { status: 500 });
  }
}
