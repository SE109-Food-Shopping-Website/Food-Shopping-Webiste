import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const sessionData = await getSession();

  // Nếu không có session, yêu cầu người dùng đăng nhập
  if (!sessionData) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  return NextResponse.json({ user: sessionData });
}
