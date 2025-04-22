import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

// Lấy đơn hàng theo status (GET)
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.id;
  type ORDER_status_enum = "PENDING" | "PROCESSING" | "SHIPPING" | "COMPLETED" | "CANCELLED"; 
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
    const { name, phone, address, cart, shippingFee, discount, totalPayment } = await req.json();

    console.log("Body nhận được:", { name, phone, address, cart, shippingFee, discount, totalPayment });

    // Kiểm tra dữ liệu đầu vào
    if (!name || !phone || !address || !cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ message: "Dữ liệu không hợp lệ" }, { status: 400 });
    }
    if (typeof shippingFee !== "number" || typeof discount !== "number" || typeof totalPayment !== "number") {
      return NextResponse.json({ message: "Thông tin thanh toán không hợp lệ" }, { status: 400 });
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
      return NextResponse.json(
        { message: "Không đủ hàng trong kho", details },
        { status: 400 }
      );
    }

    // Tính originalPrice (tổng giá gốc của các sản phẩm)
    const originalPrice = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    // Tạo đơn hàng và xóa giỏ hàng trong một giao dịch
    const order = await prisma.$transaction(async (tx) => {
      // Tạo đơn hàng
      const newOrder = await tx.oRDER.create({
        data: {
          user_id: userId,
          name,
          phone,
          address,
          status: "PENDING",
          originalPrice,
          discountAmount: discount,
          totalPrice: totalPayment,
          shippingFee,
          orderDetails: {
            create: cart.map((item: any) => ({
              product_id: item.id,
              quantity: item.quantity,
              price: item.price,
              originalPrice: item.price, // Giả định giá gốc
              salePrice: item.price,     // Giả định giá bán
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

      return newOrder;
    });

    return NextResponse.json({ message: "Tạo đơn hàng thành công", order }, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    return NextResponse.json(
      { message: "Lỗi khi tạo đơn hàng", error: error.message },
      { status: 500 }
    );
  }
}