import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const sessionData = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
  }

  const { phone } = await req.json();

  if (!phone || phone.trim().length === 0) {
    return NextResponse.json({ message: "Số điện thoại không hợp lệ" }, { status: 400 });
  }

  try {
    await prisma.uSER.update({
      where: { id: sessionData.id },
      data: { phone },
    });

    return NextResponse.json({ message: "Đã cập nhật số điện thoại thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật số điện thoại:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}