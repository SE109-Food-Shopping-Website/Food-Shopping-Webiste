import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// Lấy thông tin loại sản phẩm theo ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const rankList = await prisma.uSER_RANK.findUnique({
      where: { id: parseInt(id, 10) }, // Đổi ID thành số nguyên
    });

    if (!rankList) {
      return NextResponse.json({ error: "Không tìm thấy xếp hạng" }, { status: 404 });
    }

    return NextResponse.json(rankList);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu!" }, { status: 500 });
  }
}

// Cập nhật rank theo ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const body = await req.json();
      const { name, min_point, max_promotion, discount_percent, max_discount } = body;

      const parsedId = Number(id);

      // Kiểm tra nếu có giá trị không hợp lệ
      if (isNaN(parsedId)) {
        return NextResponse.json({ error: "ID hoặc giá trị phần trăm không hợp lệ" }, { status: 400 });
      }

      const updatedrankList = await prisma.uSER_RANK.update({
        where: { id: parsedId },
        data: {
          name,
            min_point,
            max_promotion,
            max_discount,
            discount_percent,
        },
      });

      return NextResponse.json(updatedrankList);
    } catch (error) {
        console.error("Lỗi khi cập nhật dữ liệu:", error instanceof Error ? error.message : error);
        return NextResponse.json({ error: "Lỗi khi cập nhật dữ liệu!" }, { status: 500 });
    }
  }
