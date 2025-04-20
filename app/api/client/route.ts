// app/api/client/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const sessionData = await getSession();

  if (!sessionData) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  // Truy vấn chi tiết user bằng id từ session
  const user = await prisma.uSER.findUnique({
    where: { id: sessionData.id },
    include: { role: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      birthday: user.birthday,
      gender: user.gender,
      address: user.address,
      role: user.role?.name,
        password: user.password,
        created_at: user.created_at,
    },
  });
}
