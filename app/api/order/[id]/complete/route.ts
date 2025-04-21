import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const orderId = parseInt(params.id);

    const order = await prisma.oRDER.update({
      where: { id: orderId, user_id: session.id },
      data: {
        status: "COMPLETED",
        paid_at: new Date(),
      },
    });

    return NextResponse.json({ message: "Cập nhật thành công", order });
  } catch (error: any) {
    console.error("Lỗi cập nhật:", error);
    return NextResponse.json({ message: "Lỗi server", error: error.message }, { status: 500 });
  }
}