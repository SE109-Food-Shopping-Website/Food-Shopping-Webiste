import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const body = await req.json();
  const { oldPassword, newPassword } = body;

  if (!oldPassword || !newPassword) {
    return NextResponse.json({ error: "Thiếu mật khẩu" }, { status: 400 });
  }

  const user = await prisma.uSER.findUnique({
    where: { id: session.id },
  });

  if (!user) {
    return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
  }

  if (user.password !== oldPassword) {
    return NextResponse.json({ error: "Mật khẩu cũ không đúng" }, { status: 400 });
  }

  await prisma.uSER.update({
    where: { id: session.id },
    data: {
      password: newPassword,
    },
  });

  return NextResponse.json({ message: "Đổi mật khẩu thành công!" });
}
