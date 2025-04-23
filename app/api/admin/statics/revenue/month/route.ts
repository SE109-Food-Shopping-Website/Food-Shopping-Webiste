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
    const year = 2025;

    if (month < 1 || month > 12) {
      return NextResponse.json({ error: "Tháng không hợp lệ!" }, { status: 400 });
    }

    const start = toZonedTime(startOfMonth(new Date(year, month - 1)), timeZone);
    const end = toZonedTime(endOfMonth(start), timeZone);

    // FETCH income (đơn hàng hoàn thành)
    const incomeOrders = await prisma.oRDER.findMany({
      where: {
        status: "COMPLETED",
        paid_at: {
          gte: start,
          lte: end,
        },
      },
    });

    // FETCH expense (nhập hàng)
    const expenseOrders = await prisma.iMPORT.findMany({
      where: {
        updated_at: {
          gte: start,
          lte: end,
        },
      },
    });

    const getTotal = (items: any[]) =>
      items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);

    const income = getTotal(incomeOrders);
    const expense = getTotal(expenseOrders);
    const profit = income - expense;

    return NextResponse.json({
      month,
      year,
      income,
      expense,
      profit,
    });
  } catch (error) {
    console.error("Lỗi khi tính doanh thu và chi phí:", error);
    return NextResponse.json({ error: "Lỗi server!" }, { status: 500 });
  }
}
