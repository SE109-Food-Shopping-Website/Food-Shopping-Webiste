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

    // Lấy giỏ hàng
    const cart = await prisma.cART.findFirst({
      where: { user_id: userId },
      include: {
        cartDetails: {
          include: {
            product: {
              include: {
                productType: true,
              },
            },
          },
        },
      },
    });

    console.log("Cart data from DB:", cart); // Debug

    // Lấy danh sách phiếu giảm giá đang hoạt động
    const currentDate = new Date();
    const coupons = await prisma.cOUPON.findMany({
      where: {
        start_at: { lte: currentDate },
        end_at: { gte: currentDate },
      },
    });

    console.log("Coupons from DB:", coupons); // Debug

    // Xử lý giỏ hàng và áp dụng phiếu giảm giá
    const cartItems = cart
      ? cart.cartDetails.map((detail) => {
          const product = detail.product;
          const applicableCoupon = coupons.find(
            (coupon) => coupon.product_type_id === product.productType_id
          );

          const salePrice = applicableCoupon
            ? Math.round(product.price * (1 - applicableCoupon.discount_percent / 100))
            : product.price;

          return {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: detail.quantity,
            productTypeId: product.productType_id,
            salePrice,
            couponId: applicableCoupon ? applicableCoupon.id : null,
          };
        })
      : [];

    console.log("Cart items trả về:", cartItems); // Debug

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

    // Lấy danh sách phiếu giảm giá đang hoạt động
    const currentDate = new Date();
    const coupons = await prisma.cOUPON.findMany({
      where: {
        start_at: { lte: currentDate },
        end_at: { gte: currentDate },
      },
    });

    console.log("Coupons from DB:", coupons); // Debug

    // Thực hiện giao dịch để xóa và tạo giỏ hàng mới
    const cart = await prisma.$transaction(async (tx) => {
      await tx.cART_DETAILS.deleteMany({
        where: {
          cart: {
            user_id: userId,
          },
        },
      });

      await tx.cART.deleteMany({
        where: { user_id: userId },
      });

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
              product: {
                include: {
                  productType: true,
                },
              },
            },
          },
        },
      });
    });

    // Áp dụng phiếu giảm giá cho cartItems
    const cartItems = cart.cartDetails.map((detail) => {
      const product = detail.product;
      const applicableCoupon = coupons.find(
        (coupon) => coupon.product_type_id === product.productType_id
      );

      const salePrice = applicableCoupon
        ? Math.round(product.price * (1 - applicableCoupon.discount_percent / 100))
        : product.price;

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: detail.quantity,
        productTypeId: product.productType_id,
        salePrice,
        couponId: applicableCoupon ? applicableCoupon.id : null,
      };
    });

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