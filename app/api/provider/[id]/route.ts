import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// Lấy thông tin loại sản phẩm theo ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const providerList = await prisma.pROVIDER.findUnique({
      where: { id: parseInt(id, 10) }, // Đổi ID thành số nguyên
    });

    if (!providerList) {
      return NextResponse.json({ error: "Không tìm thấy nhà cung cấp" }, { status: 404 });
    }

    return NextResponse.json(providerList);
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
      const { name, address, email } = body;

      const parsedId = Number(id);

      // Kiểm tra nếu có giá trị không hợp lệ
      if (isNaN(parsedId)) {
        return NextResponse.json({ error: "ID hoặc giá trị phần trăm không hợp lệ" }, { status: 400 });
      }

      const updatedproviderList = await prisma.pROVIDER.update({
        where: { id: parsedId },
        data: {
          name,
          address,
            email,
        },
      });

      return NextResponse.json(updatedproviderList);
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
      return NextResponse.json({ error: "Lỗi khi cập nhật dữ liệu!" }, { status: 500 });
    }
  }
