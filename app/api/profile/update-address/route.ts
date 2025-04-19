import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const sessionData = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
  }

  const { address } = await req.json();

  if (!address || address.trim().length === 0) {
    return NextResponse.json({ message: "Địa chỉ không hợp lệ" }, { status: 400 });
  }

  try {
    await prisma.uSER.update({
      where: { id: sessionData.id },
      data: { address },
    });

    return NextResponse.json({ message: "Đã cập nhật địa chỉ thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật địa chỉ:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}