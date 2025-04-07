import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// Lấy danh sách
export async function GET() {
  try {
    const productTypes = await prisma.pRODUCT_TYPE.findMany();
    return NextResponse.json(productTypes);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu!" }, { status: 500 });
  }
}

// Thêm loại sản phẩm
export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { name, priceMarginPct } = body;

      if (!name || priceMarginPct === undefined) {
        return new Response(
          JSON.stringify({ error: "Thiếu dữ liệu" }),
          { status: 400 }
        );
      }

      const newProductType = await prisma.pRODUCT_TYPE.create({
        data: {
          name,
          priceMarginPct: parseFloat(priceMarginPct),
        },
      });

      // Trả về phản hồi JSON hợp lệ
      return new Response(JSON.stringify(newProductType), { status: 201 });
    } catch (error) {
      console.error("Lỗi khi thêm dữ liệu:", error);
      return new Response(
        JSON.stringify({ error: "Lỗi khi thêm dữ liệu!" }),
        { status: 500 }
      );
    }
  }

//Xóa loại phẩm
// export async function DELETE(req: Request) {
//     try {
//       const { id } = await req.json();
//       const deletedProductType = await prisma.pRODUCT_TYPE.delete({
//         where: { id },
//       });
//       return NextResponse.json(deletedProductType);
//     } catch (error) {
//       return NextResponse.json({ error: "Lỗi khi xóa dữ liệu!" }, { status: 500 });
//     }
//   }
