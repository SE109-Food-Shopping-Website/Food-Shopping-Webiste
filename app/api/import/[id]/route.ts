import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  try {
    const importData = await prisma.iMPORT.findUnique({
      where: { id },
      include: {
        provider: true,
        importDetails: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!importData) {
      return NextResponse.json({ error: "Không tìm thấy đơn nhập hàng" }, { status: 404 });
    }

    return NextResponse.json(importData);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn nhập hàng:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}