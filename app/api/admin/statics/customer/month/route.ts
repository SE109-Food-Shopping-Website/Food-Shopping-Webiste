// File: app/api/admin/statics/customer/month/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const timeZone = "Asia/Ho_Chi_Minh";

export async function GET(req: NextRequest) {
  try {
    const year = 2025;
    const result = [];

    for (let month = 0; month < 12; month++) {
      const start = toZonedTime(startOfMonth(new Date(year, month)), timeZone);
      const end = toZonedTime(endOfMonth(start), timeZone);

      const count = await prisma.uSER.count({
        where: {
          role_id: 2,
          created_at: {
            gte: start,
            lte: end,
          },
        },
      });

      result.push({
        month: month + 1,
        users: count,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Lỗi khi thống kê khách hàng theo tháng:", error);
    return NextResponse.json({ error: "Lỗi server!" }, { status: 500 });
  }
}
