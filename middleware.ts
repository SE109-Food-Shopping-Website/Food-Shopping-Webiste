import { NextRequest, NextResponse } from "next/server";
import { sessionOptions } from "@/lib/session";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(sessionOptions.cookieName);
  let role: number | undefined;

  try {
    if (sessionCookie?.value) {
      const parsed = JSON.parse(sessionCookie.value);
      role = parsed.role;
    }
  } catch {
    // log lỗi nếu session không hợp lệ
    console.error("Error reading session");
  }

  const pathname = request.nextUrl.pathname;
  console.log(`Path: ${pathname}, Role: ${role}`);  // Log ra thông tin để debug

  // Kiểm tra session
  if (!role && !pathname.startsWith("/login")) {
    console.log("Redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));  // Chuyển hướng nếu không có session
  }

  if (role === 1 && pathname.startsWith("/client")) {
    console.log("Admin trying to access client page");
    return NextResponse.redirect(new URL("/admin/manage/provider", request.url)); // Admin không được vào client
  }

  if (role === 2 && pathname.startsWith("/admin")) {
    console.log("Client trying to access admin page");
    return NextResponse.redirect(new URL("/client/collection/dashboard", request.url)); // Client không được vào admin
  }

  return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/client/:path*"],  // Đảm bảo các đường dẫn đúng
  };

