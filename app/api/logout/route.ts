// app/api/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();

  // Xóa session cookie
  (await
        // Xóa session cookie
        cookieStore).delete(sessionOptions.cookieName);

  return NextResponse.json({ message: "Đã đăng xuất thành công" });
}
