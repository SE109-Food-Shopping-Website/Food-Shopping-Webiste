import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// Lấy thông tin loại sản phẩm theo ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const productType = await prisma.pRODUCT_TYPE.findUnique({
      where: { id: parseInt(id, 10) }, // Đổi ID thành số nguyên
    });

    if (!productType) {
      return NextResponse.json({ error: "Không tìm thấy loại sản phẩm" }, { status: 404 });
    }

    return NextResponse.json(productType);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu!" }, { status: 500 });
  }
}

// Cập nhật loại sản phẩm theo ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const body = await req.json();
      const { name, priceMarginPct } = body;

      // Debug kiểu dữ liệu
      console.log("Received id:", id, "Type:", typeof id);
      console.log("Received priceMarginPct:", priceMarginPct, "Type:", typeof priceMarginPct);

      const parsedId = Number(id);
      const parsedPriceMarginPct = Number(priceMarginPct);

      // Kiểm tra nếu có giá trị không hợp lệ
      if (isNaN(parsedId) || isNaN(parsedPriceMarginPct)) {
        return NextResponse.json({ error: "ID hoặc giá trị phần trăm không hợp lệ" }, { status: 400 });
      }

      const updatedProductType = await prisma.pRODUCT_TYPE.update({
        where: { id: parsedId },
        data: {
          name,
          priceMarginPct: parsedPriceMarginPct,
        },
      });

      return NextResponse.json(updatedProductType);
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
      return NextResponse.json({ error: "Lỗi khi cập nhật dữ liệu!" }, { status: 500 });
    }
  }

// Xóa loại sản phẩm theo ID
// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const { id } = params;
//     await prisma.pRODUCT_TYPE.delete({
//       where: { id: parseInt(id, 10) },
//     });

//     return NextResponse.json({ message: "Xóa thành công" });
//   } catch (error) {
//     console.error("Lỗi khi xóa dữ liệu:", error);
//     return NextResponse.json({ error: "Lỗi khi xóa dữ liệu!" }, { status: 500 });
//   }
// }
