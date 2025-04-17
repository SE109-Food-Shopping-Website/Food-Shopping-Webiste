// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  // Tìm người dùng trong DB
  const user = await prisma.uSER.findUnique({
    where: { email },
    include: { role: true },
  });

  // Kiểm tra thông tin đăng nhập
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Sai tài khoản hoặc mật khẩu" }, { status: 401 });
  }

  // Lưu session thông tin người dùng
  const sessionData = {
    id: user.id,
    role: user.role_id,
  };

  await setSession(sessionData);  // Lưu thông tin vào session

  return NextResponse.json({ role: user.role_id });
}
