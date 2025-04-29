import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// Lấy thông tin loại sản phẩm theo ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const promotionList = await prisma.pROMOTION.findUnique({
      where: { id: parseInt(id, 10) }, // Đổi ID thành số nguyên
    });

    if (!promotionList) {
      return NextResponse.json({ error: "Không tìm thấy nhà cung cấp" }, { status: 404 });
    }

    return NextResponse.json(promotionList);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu!" }, { status: 500 });
  }
}

// Cập nhật promotion theo ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const body = await req.json();
      const { name, day_start, day_end, value, order_min, discount_max } = body;

      const parsedId = Number(id);

      // Kiểm tra nếu có giá trị không hợp lệ
      if (isNaN(parsedId)) {
        return NextResponse.json({ error: "ID hoặc giá trị phần trăm không hợp lệ" }, { status: 400 });
      }

      const updatedpromotionList = await prisma.pROMOTION.update({
        where: { id: parsedId },
        data: {
          name,
          day_end: new Date(day_end),
          day_start: new Date(day_start),
          value: parseFloat(value), // Chuyển đổi giá trị phần trăm thành số
          order_min: parseInt(order_min, 10), // Chuyển đổi giá trị đơn hàng tối thiểu thành số nguyên
          discount_max: parseInt(discount_max, 10), // Chuyển đổi giá trị giảm tối đa thành số nguyên
        },
      });

      return NextResponse.json(updatedpromotionList);
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
      return NextResponse.json({ error: "Lỗi khi cập nhật dữ liệu!" }, { status: 500 });
    }
  }
