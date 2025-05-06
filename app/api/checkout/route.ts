import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

async function assignLoyaltyPromotion(userId: number) {
  try {
    const user = await prisma.uSER.findUnique({
      where: { id: userId },
      include: { user_rank: true },
    });

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    const ranks = await prisma.uSER_RANK.findMany({
      orderBy: { min_point: "desc" },
    });

    let newRank = ranks.find((rank) => user.loyalty_point >= rank.min_point);
    if (!newRank) {
      return { success: false, message: "Không đủ điểm để nhận khuyến mãi hạng" };
    }

    if (user.user_rank_id !== newRank.id) {
      await prisma.uSER.update({
        where: { id: userId },
        data: { user_rank_id: newRank.id },
      });
    }

    const totalPromotions = await prisma.pROMOTION_USER.count({
      where: {
        user_id: userId,
        promotion: { 
          status: "LOYALTY",
          name: { contains: `Khuyến mãi hạng ${newRank.name}` },
        },
      },
    });

    if (totalPromotions >= newRank.max_promotion) {
      return { success: false, message: "Đã đạt giới hạn khuyến mãi cho hạng này" };
    }

    const promotion = await prisma.pROMOTION.findFirst({
      where: {
        status: "LOYALTY",
        name: { contains: `Khuyến mãi hạng ${newRank.name}` },
      },
    });

    if (!promotion) {
      throw new Error(`Không tìm thấy khuyến mãi cho hạng ${newRank.name}`);
    }

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

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const userId = session.id;
    const { cartItems, promotionId, address, name, phone } = await req.json();

    if (!cartItems || !Array.isArray(cartItems) || !address || !name || !phone) {
      return NextResponse.json({ message: "Dữ liệu không hợp lệ" }, { status: 400 });
    }

    const products = await prisma.pRODUCT.findMany({
      where: { id: { in: cartItems.map((item: any) => item.id) } },
    });

    const outOfStock = cartItems.filter((item: any) => {
      const product = products.find((p) => p.id === item.id);
      return !product || product.quantity < item.quantity;
    });

    if (outOfStock.length > 0) {
      const details = outOfStock.map((item: any) => ({
        name: item.name,
        availableQuantity: products.find((p) => p.id === item.id)?.quantity || 0,
      }));
      return NextResponse.json({ message: "Không đủ hàng trong kho", details }, { status: 400 });
    }

    let originalPrice = 0;
    let discountAmount = 0;

    const items = cartItems.map((item: any) => {
      const salePrice = item.salePrice ?? item.price;
      originalPrice += item.price * item.quantity;
      discountAmount += (item.price - salePrice) * item.quantity;
      return {
        product_id: item.id,
        quantity: item.quantity,
        originalPrice: item.price,
        salePrice: salePrice,
        price: salePrice,
      };
    });

    let promotion = null;
    if (promotionId) {
      promotion = await prisma.pROMOTION.findUnique({
        where: { id: promotionId },
      });

      if (!promotion || (promotion.day_end && promotion.day_end < new Date()) || (promotion.day_start && promotion.day_start > new Date())) {
        return NextResponse.json({ message: "Khuyến mãi không hợp lệ hoặc đã hết hạn" }, { status: 400 });
      }

      if (promotion.status === "Active") {
        const existingPromotionUser = await prisma.pROMOTION_USER.findFirst({
          where: {
            promotion_id: promotionId,
            user_id: userId,
          },
        });

        if (existingPromotionUser) {
          return NextResponse.json({ message: "Khuyến mãi này đã được sử dụng" }, { status: 400 });
        }

        await prisma.pROMOTION_USER.create({
          data: {
            user_id: userId,
            promotion_id: promotionId,
            used_at: new Date(),
          },
        });
      }
      else if (promotion.status === "LOYALTY") {
        const promotionUser = await prisma.pROMOTION_USER.findFirst({
          where: {
            promotion_id: promotionId,
            user_id: userId,
            used_at: null,
          },
          include: { promotion: true },
        });

        if (!promotionUser) {
          return NextResponse.json({ message: "Khuyến mãi loyalty không hợp lệ hoặc đã sử dụng" }, { status: 400 });
        }

        const user = await prisma.uSER.findUnique({
          where: { id: userId },
          include: { user_rank: true },
        });

        const totalPromotions = await prisma.pROMOTION_USER.count({
          where: {
            user_id: userId,
            promotion: { 
              status: "LOYALTY",
              name: { contains: `Khuyến mãi hạng ${user?.user_rank?.name}` },
            },
            used_at: { not: null }, // Chỉ đếm các bản ghi đã sử dụng
          },
        });

        if (totalPromotions >= (user?.user_rank?.max_promotion || 0)) {
          return NextResponse.json({ message: "Đã vượt quá số lượng khuyến mãi hạng cho phép" }, { status: 400 });
        }

        await prisma.pROMOTION_USER.update({
          where: { id: promotionUser.id },
          data: { used_at: new Date() },
        });
      } else {
        return NextResponse.json({ message: "Loại khuyến mãi không được hỗ trợ" }, { status: 400 });
      }

      if (originalPrice < (promotion.order_min || 0)) {
        return NextResponse.json({ message: `Đơn hàng chưa đạt ${promotion.order_min?.toLocaleString()}đ` }, { status: 400 });
      }

      const promotionDiscount = Math.min(
        ((promotion.value || 0) / 100) * originalPrice,
        promotion.discount_max || Infinity
      );
      discountAmount += promotionDiscount;
    }

    const shippingFee = 30000;
    const totalPrice = originalPrice - discountAmount + shippingFee;

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.oRDER.create({
        data: {
          user_id: userId,
          name,
          phone,
          address,
          note: `Giao cho ${name}, Số điện thoại: ${phone}, Địa chỉ: ${address}`,
          status: "PENDING",
          originalPrice,
          discountAmount,
          totalPrice,
          shippingFee,
          promotion_id: promotion?.id,
          orderDetails: {
            create: items,
          },
        },
      });

      for (const item of items) {
        await tx.pRODUCT.update({
          where: { id: item.product_id },
          data: {
            quantity: { decrement: item.quantity },
            sold: { increment: item.quantity },
          },
        });
      }

      await tx.cART_DETAILS.deleteMany({
        where: { cart: { user_id: userId } },
      });
      await tx.cART.deleteMany({
        where: { user_id: userId },
      });

      const newPoints = Math.floor(totalPrice / 10000);
      await tx.uSER.update({
        where: { id: userId },
        data: {
          loyalty_point: { increment: newPoints },
        },
      });

      await assignLoyaltyPromotion(userId);

      return newOrder;
    });

    return NextResponse.json({ message: "Tạo đơn hàng thành công", order }, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    return NextResponse.json({ message: "Lỗi khi tạo đơn hàng", error: error.message }, { status: 500 });
  }
}