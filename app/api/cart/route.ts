import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

// Lấy giỏ hàng (GET)
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const userId = session.id;
    const cart = await prisma.cART.findFirst({
      where: { user_id: userId },
      include: {
        cartDetails: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log("Cart data from DB:", cart); // Debug

    const cartItems = cart
      ? cart.cartDetails.map((detail) => ({
          id: detail.product.id,
          name: detail.product.name,
          price: detail.product.price,
          quantity: detail.quantity,
        }))
      : [];

    return NextResponse.json({ cart: cartItems }, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    return NextResponse.json(
      { message: "Lỗi khi lấy giỏ hàng", error: error.message },
      { status: 500 }
    );
  }
}

// Cập nhật giỏ hàng (POST)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const userId = session.id;
    const { items } = await req.json();

    console.log("Items nhận được:", items); // Debug

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ message: "Dữ liệu giỏ hàng không hợp lệ" }, { status: 400 });
    }

    // Thực hiện giao dịch để xóa và tạo giỏ hàng mới
    const cart = await prisma.$transaction(async (tx) => {
      // Xóa chi tiết giỏ hàng cũ
      await tx.cART_DETAILS.deleteMany({
        where: {
          cart: {
            user_id: userId,
          },
        },
      });

      // Xóa giỏ hàng cũ
      await tx.cART.deleteMany({
        where: { user_id: userId },
      });

      // Tạo giỏ hàng mới
      return await tx.cART.create({
        data: {
          user_id: userId,
          cartDetails: {
            create: items.map((item: any) => ({
              product_id: item.id,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          cartDetails: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    const cartItems = cart.cartDetails.map((detail) => ({
      id: detail.product.id,
      name: detail.product.name,
      price: detail.product.price,
      quantity: detail.quantity,
    }));

    console.log("Cart items trả về:", cartItems); // Debug

    return NextResponse.json({ cart: cartItems }, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error);
    return NextResponse.json(
      { message: "Lỗi khi cập nhật giỏ hàng", error: error.message },
      { status: 500 }
    );
  }
}