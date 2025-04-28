import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// Lấy danh sách
export async function GET() {
  try {
    const pointList = await prisma.uSER_RANK.findMany();
    return NextResponse.json(pointList);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu!" }, { status: 500 });
  }
}

// Thêm phiếu giảm giá
export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { name, min_point, max_promotion, discount_percent, max_discount} = body;

      // Kiểm tra các trường dữ liệu không trống
      if (!name || !min_point || !max_promotion || !max_discount || !discount_percent) {
        return new Response(
          JSON.stringify({ error: "Thiếu dữ liệu" }),
          { status: 400 }
        );
      }

      // Tạo mới phiếu giảm sản phẩm nếu không có lỗi
      const newRank = await prisma.uSER_RANK.create({
        data: {
          name,
            min_point,
            max_promotion,
            max_discount,
          discount_percent,
        },
      });

      return new Response(JSON.stringify(newRank), { status: 201 });
    } catch (error: any) {
      console.error("Lỗi khi thêm dữ liệu:", error);
      return new Response(
        JSON.stringify({ error: error.message || "Lỗi khi thêm dữ liệu!" }),
        { status: 500 }
      );
    }
  }
