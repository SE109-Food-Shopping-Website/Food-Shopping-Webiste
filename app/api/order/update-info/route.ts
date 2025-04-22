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
    const { orderId, name, phone, address } = await req.json();

    // Kiểm tra dữ liệu đầu vào
    if (!orderId || isNaN(Number(orderId))) {
      return NextResponse.json({ message: "ID đơn hàng không hợp lệ" }, { status: 400 });
    }
    if (!name || !phone || !address) {
      return NextResponse.json({ message: "Thiếu thông tin giao hàng" }, { status: 400 });
    }

    // Kiểm tra đơn hàng tồn tại và thuộc về user
    const order = await prisma.oRDER.findFirst({
      where: {
        id: Number(orderId),
        user_id: userId,
        status: "PENDING", // Chỉ cho phép cập nhật đơn hàng chưa xử lý
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Không tìm thấy đơn hàng cần cập nhật" }, { status: 404 });
    }

    // Cập nhật thông tin giao hàng
    const updatedOrder = await prisma.oRDER.update({
      where: { id: Number(orderId) },
      data: {
        name,
        phone,
        address,
        note: `Giao cho ${name}, Số điện thoại: ${phone}, Địa chỉ: ${address}`,
      },
      include: {
        orderDetails: true,
      },
    });

    // (Nếu cần) Có thể cập nhật lại thông tin giỏ hàng hoặc tạo mới orderDetails nếu đó là logic của bạn

    return NextResponse.json({ message: "Thông tin giao hàng đã được cập nhật", order: updatedOrder });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ message: "Đã xảy ra lỗi khi cập nhật đơn hàng" }, { status: 500 });
  }
}