import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// Lấy danh sách
export async function GET() {
  try {
    const promotionList = await prisma.pROMOTION.findMany();
    return NextResponse.json(promotionList);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu!" }, { status: 500 });
  }
}

// Thêm phiếu giảm giá
export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { name, day_start, day_end, value, order_min, discount_max} = body;

      // Kiểm tra các trường dữ liệu không trống
      if (!name || !day_start || !day_end || !value || !order_min || !discount_max) {
        return new Response(
          JSON.stringify({ error: "Thiếu dữ liệu" }),
          { status: 400 }
        );
      }

      // Tạo mới nhà cung cấp nếu không có lỗi
      const newPromotion = await prisma.pROMOTION.create({
        data: {
          name,
            day_start,
            day_end,
            value,
            order_min,
            discount_max
        },
      });

      return new Response(JSON.stringify(newPromotion), { status: 201 });
    } catch (error: any) {
      console.error("Lỗi khi thêm dữ liệu:", error);
      return new Response(
        JSON.stringify({ error: error.message || "Lỗi khi thêm dữ liệu!" }),
        { status: 500 }
      );
    }
  }
