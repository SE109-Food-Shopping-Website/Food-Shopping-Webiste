import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // giả lập lấy dữ liệu từ DB
  const coupon = await prisma.cOUPON.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!coupon) {
    return NextResponse.json({ error: "Không tìm thấy coupon" }, { status: 404 });
  }

  return NextResponse.json(coupon);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const body = await req.json();
      const { name, start_at, end_at, discount_percent } = body;

      const parsedId = Number(id);

      // Kiểm tra nếu có giá trị không hợp lệ
      if (isNaN(parsedId)) {
        return NextResponse.json({ error: "ID hoặc giá trị phần trăm không hợp lệ" }, { status: 400 });
      }

      const updatedrankList = await prisma.cOUPON.update({
        where: { id: parsedId },
        data: {
            name,
            start_at,
            end_at,
            discount_percent,
        },
      });

      if (new Date(end_at) < new Date(start_at)) {
        return NextResponse.json({ error: "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu." }, { status: 400 });
      }

      return NextResponse.json(updatedrankList);
    } catch (error) {
        console.error("Lỗi khi cập nhật dữ liệu:", error instanceof Error ? error.message : error);
        return NextResponse.json({ error: "Lỗi khi cập nhật dữ liệu!" }, { status: 500 });
    }
  }