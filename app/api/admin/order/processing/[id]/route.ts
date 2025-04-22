import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    const order = await prisma.oRDER.findUnique({
      where: { id },
      include: {
        user: true,
        orderDetails: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
    }

    // Tính tổng tiền từng sản phẩm
    const products = order.orderDetails.map((detail) => ({
      id: detail.product.id,
      name: detail.product.name,
      quantity: detail.quantity,
      total: detail.salePrice * detail.quantity,
    }));

    return NextResponse.json({
      user: {
        name: order.user?.name || "Không xác định",
        phone: order.user?.phone || "Không xác định",
        address: order.user?.address || "Không xác định",
      },
      products,
      summary: {
        originalPrice: order.originalPrice,
        shippingFee: order.shippingFee,
        discountAmount: order.discountAmount,
        totalPrice: order.totalPrice,
      },
    });
  } catch (error) {
    console.error("Lỗi lấy đơn hàng:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
      }
      const { status } = await req.json()

      if (!["SHIPPING", "COMPLETED", "CANCELLED", "RETURN", "REQUEST"].includes(status)) {
        return NextResponse.json({ error: "Trạng thái không hợp lệ." }, { status: 400 })
      }

      const updatedOrder = await prisma.oRDER.update({
        where: { id },
        data: { status },
      })

      return NextResponse.json({ message: "Cập nhật trạng thái thành công", data: updatedOrder })
    } catch (error) {
      console.error("[ORDER_UPDATE_ERROR]", error)
      return NextResponse.json({ error: "Lỗi khi cập nhật đơn hàng" }, { status: 500 })
    }
  }
