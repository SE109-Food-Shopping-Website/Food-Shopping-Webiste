import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

// Lấy đơn hàng theo status (GET)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.id;
  type ORDER_status_enum = "PENDING" | "PROCESSING" | "SHIPPING" | "COMPLETED" | "REQUEST" | "RETURN" | "CANCELLED"; 
  const status = req.nextUrl.searchParams.get("status") as ORDER_status_enum | undefined; 

  try {
    const orders = await prisma.oRDER.findMany({
      where: {
        user_id: userId,
        ...(status ? { status } : {}), 
      },
      include: {
        orderDetails: {
          include: {
            product: true,
          },
        },
        feedbacks: {
          include: {
            product: true,
            user: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
    console.log("Orders:", JSON.stringify(orders, null, 2));
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ message: "Error fetching orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const userId = session.id;
    const { name, phone, address, cart, shippingFee, promotionId, promotionDiscount, totalPayment } = await req.json();

    console.log("Body nhận được:", { name, phone, address, cart, shippingFee, promotionId, promotionDiscount, totalPayment });

    // Kiểm tra dữ liệu đầu vào
    if (!name || !phone || !address || !cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ message: "Dữ liệu không hợp lệ" }, { status: 400 });
    }
    if (typeof shippingFee !== "number" || typeof promotionDiscount !== "number" || typeof totalPayment !== "number") {
      return NextResponse.json({ message: "Thông tin thanh toán không hợp lệ" }, { status: 400 });
    }

    // Kiểm tra quyền sử dụng khuyến mãi (nếu có)
    if (promotionId) {
      const promotionUser = await prisma.pROMOTION_USER.findFirst({
        where: {
          user_id: userId,
          promotion_id: promotionId,
          used_at: { not: null },
        },
      });

      if (promotionUser) {
        return NextResponse.json({ message: "Bạn đã sử dụng khuyến mãi này" }, { status: 400 });
      }
    }

    // Kiểm tra số lượng hàng trong kho
    const products = await prisma.pRODUCT.findMany({
      where: { id: { in: cart.map((item: any) => item.id) } },
    });

    const outOfStock = cart.filter((item: any) => {
      const product = products.find((p) => p.id === item.id);
      return !product || product.quantity < item.quantity;
    });

    if (outOfStock.length > 0) {
      const details = outOfStock.map((item: any) => {
        const product = products.find((p) => p.id === item.id);
        return {
          name: item.name,
          availableQuantity: product ? product.quantity : 0,
        };
      });
      return NextResponse.json({ message: "Không đủ hàng trong kho", details }, { status: 400 });
    }

    // Tính originalPrice
    const originalPrice = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    // Tạo đơn hàng và cập nhật PROMOTION_USER trong một giao dịch
    const order = await prisma.$transaction(async (tx) => {
      // Tạo đơn hàng
      const newOrder = await tx.oRDER.create({
        data: {
          user_id: userId,
          name,
          phone,
          address,
          note: `Giao cho ${name}, Số điện thoại: ${phone}, Địa chỉ: ${address}`,
          status: "PENDING",
          originalPrice,
          discountAmount: promotionDiscount,
          totalPrice: totalPayment,
          shippingFee,
          promotion_id: promotionId || null, // Ghi nhận promotionId
          orderDetails: {
            create: cart.map((item: any) => ({
              product_id: item.id,
              quantity: item.quantity,
              price: item.salePrice || item.price,
              originalPrice: item.price,
              salePrice: item.salePrice || item.price,
            })),
          },
        },
        include: {
          orderDetails: true,
        },
      });

      // Cập nhật số lượng hàng trong kho
      for (const item of cart) {
        await tx.pRODUCT.update({
          where: { id: item.id },
          data: {
            quantity: { decrement: item.quantity },
            sold: { increment: item.quantity },
          },
        });
      }

      // Xóa chi tiết giỏ hàng
      await tx.cART_DETAILS.deleteMany({
        where: {
          cart: {
            user_id: userId,
          },
        },
      });

      // Xóa giỏ hàng
      await tx.cART.deleteMany({
        where: { user_id: userId },
      });

      // Cập nhật PROMOTION_USER nếu có promotionId
      if (promotionId) {
        // Kiểm tra xem đã có bản ghi PROMOTION_USER chưa
        const existingPromotionUser = await tx.pROMOTION_USER.findFirst({
          where: {
            user_id: userId,
            promotion_id: promotionId,
          },
        });

        if (existingPromotionUser) {
          // Cập nhật used_at nếu bản ghi tồn tại
          await tx.pROMOTION_USER.update({
            where: { id: existingPromotionUser.id },
            data: { used_at: new Date() },
          });
        } else {
          // Tạo bản ghi mới
          await tx.pROMOTION_USER.create({
            data: {
              user_id: userId,
              promotion_id: promotionId,
              used_at: new Date(),
            },
          });
        }
      }

      return newOrder;
    });

    return NextResponse.json({ message: "Tạo đơn hàng thành công", order }, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    return NextResponse.json({ message: "Lỗi khi tạo đơn hàng", error: error.message }, { status: 500 });
  }
}