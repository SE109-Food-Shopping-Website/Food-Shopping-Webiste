import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const timeZone = "Asia/Ho_Chi_Minh";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const monthStr = searchParams.get("month");

    if (!monthStr) {
      return NextResponse.json({ error: "Thiếu tham số tháng!" }, { status: 400 });
    }

    const month = parseInt(monthStr);
    if (month < 1 || month > 12) {
      return NextResponse.json({ error: "Tháng không hợp lệ!" }, { status: 400 });
    }

    const year = 2025;

    const prevStart = toZonedTime(startOfMonth(new Date(year, month - 2)), timeZone);
    const prevEnd = toZonedTime(endOfMonth(prevStart), timeZone);

    const currentStart = toZonedTime(startOfMonth(new Date(year, month - 1)), timeZone);
    const currentEnd = toZonedTime(endOfMonth(currentStart), timeZone);

    // Lấy số lượng người dùng đăng ký mới trong tháng hiện tại
    const currentCount = await prisma.uSER.count({
      where: {
        role_id: 2,
        created_at: {
          gte: currentStart,
          lte: currentEnd,
        },
      },
    });

    // Lấy số lượng người dùng tháng trước
    const previousCount = await prisma.uSER.count({
      where: {
        role_id: 2,
        created_at: {
          gte: prevStart,
          lte: prevEnd,
        },
      },
    });

    const percentChange = previousCount
      ? ((currentCount - previousCount) / previousCount) * 100
      : null;

    return NextResponse.json({
      month,
      year,
      count: currentCount,
      previousCount,
      percentChange,
      trend: currentCount > previousCount ? "up" : currentCount < previousCount ? "down" : "equal",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi khi thống kê khách hàng!" }, { status: 500 });
  }
}
