import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// Lấy thông tin sản phẩm theo ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const product = await prisma.pRODUCT.findUnique({
      where: { id: parseInt(id, 10) }, // Đổi ID thành số nguyên
      include: {
        provider: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu!" }, { status: 500 });
  }
}

// Cập nhật sản phẩm theo ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const body = await req.json();
      const { name, price, images, description, unit, quantity, sold } = body;

      const parsedId = Number(id);
      const parsedPrice = Number(price);
      const parseQuantity = Number(quantity);
      const parseSold = Number(sold);

      // Kiểm tra nếu có giá trị không hợp lệ
      if (isNaN(parsedId) || isNaN(parsedPrice)) {
        return NextResponse.json({ error: "ID hoặc giá trị phần trăm không hợp lệ" }, { status: 400 });
      }

      const updatedProduct = await prisma.pRODUCT.update({
        where: { id: parsedId },
        data: {
          name,
          price: parsedPrice,
          images,
          description,
          unit,
          quantity: parseQuantity,
          sold: parseSold,
          provider: body.provider ?? null,
        },
      });

      return NextResponse.json(updatedProduct);
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
      return NextResponse.json({ error: "Lỗi khi cập nhật dữ liệu!" }, { status: 500 });
    }
}