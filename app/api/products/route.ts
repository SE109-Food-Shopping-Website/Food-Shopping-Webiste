import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.pRODUCT.findMany({
      include: {
        productType: true, // Lấy thông tin loại sản phẩm
        provider: true,    // Lấy thông tin nhà cung cấp
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Lỗi lấy danh sách sản phẩm:", error);
    return NextResponse.json({ error: "Không thể lấy sản phẩm" }, { status: 500 });
  }
}