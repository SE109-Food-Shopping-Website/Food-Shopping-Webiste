import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// Lấy danh sách
export async function GET() {
  try {
    const couponList = await prisma.cOUPON.findMany();
    return NextResponse.json(couponList);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu!" }, { status: 500 });
  }
}

// Thêm phiếu giảm giá
export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { name, start_at, end_at, discount_percent, product_type_id } = body;

      // Kiểm tra các trường dữ liệu không trống
      if (!name || !start_at || !end_at || !discount_percent || !product_type_id) {
        return new Response(
          JSON.stringify({ error: "Thiếu dữ liệu" }),
          { status: 400 }
        );
      }

      // Tạo mới phiếu giảm sản phẩm nếu không có lỗi
      const newCoupon = await prisma.cOUPON.create({
        data: {
          name,
          start_at: new Date(start_at),
          end_at: new Date(end_at),
          discount_percent,
          status: "Active",
          product_type_id: Number(product_type_id),
        },
      });

      return new Response(JSON.stringify(newCoupon), { status: 201 });
    } catch (error: any) {
      console.error("Lỗi khi thêm dữ liệu:", error);
      return new Response(
        JSON.stringify({ error: error.message || "Lỗi khi thêm dữ liệu!" }),
        { status: 500 }
      );
    }
  }
