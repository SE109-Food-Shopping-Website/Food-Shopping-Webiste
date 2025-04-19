import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    // Lấy session của người dùng (ví dụ từ cookie)
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }
    const userId = session.id;

    // Lấy dữ liệu gửi lên
    const { name, phone, address, cart, shippingFee, discount, totalPayment } = await req.json();

    // Tìm đơn hàng chưa xử lý của user (giả định: đơn hàng có status "PENDING")
    const order = await prisma.oRDER.findFirst({
      where: {
        user_id: userId,
        status: "PENDING", // hoặc trạng thái phù hợp với logic của bạn
      },
      orderBy: { created_at: "desc" },
    });

    if (!order) {
      return NextResponse.json({ message: "Không tìm thấy đơn hàng cần cập nhật" }, { status: 404 });
    }

    // Cập nhật thông tin đơn hàng (ví dụ: note lưu thông tin giao hàng)
    const updatedOrder = await prisma.oRDER.update({
      where: { id: order.id },
      data: {
        note: `Giao cho ${name}, sđt: ${phone}, địa chỉ: ${address}`,
        shippingFee,
        discountAmount: discount,
        totalPrice: totalPayment,
      },
    });

    // (Nếu cần) Có thể cập nhật lại thông tin giỏ hàng hoặc tạo mới orderDetails nếu đó là logic của bạn

    return NextResponse.json({ message: "Đơn hàng đã được cập nhật", order: updatedOrder });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ message: "Đã xảy ra lỗi khi cập nhật đơn hàng" }, { status: 500 });
  }
}