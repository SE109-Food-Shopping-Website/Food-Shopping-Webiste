import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";
import { toZonedTime } from "date-fns-tz";  // Import thêm thư viện để xử lý timezone

// Định nghĩa múi giờ của Việt Nam
const timeZone = "Asia/Ho_Chi_Minh";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const monthStr = searchParams.get("month"); // ví dụ: "4" cho tháng 4

    if (!monthStr) {
      return NextResponse.json({ error: "Thiếu tham số tháng!" }, { status: 400 });
    }

    const month = parseInt(monthStr);
    if (month < 1 || month > 12) {
      return NextResponse.json({ error: "Tháng không hợp lệ!" }, { status: 400 });
    }

    const year = 2025;

    // Tính toán thời gian cho tháng trước
    const prevStart = toZonedTime(startOfMonth(new Date(year, month - 2)), timeZone);
    const prevEnd = toZonedTime(endOfMonth(prevStart), timeZone);

    // Tính toán thời gian cho tháng hiện tại
    const currentStart = toZonedTime(startOfMonth(new Date(year, month - 1)), timeZone);
    const currentEnd = toZonedTime(endOfMonth(currentStart), timeZone);

    // Lấy đơn hàng của tháng hiện tại
    const currentOrders = await prisma.oRDER.findMany({
      where: {
        status: "COMPLETED",
        paid_at: {
          gte: currentStart,
          lte: currentEnd,
        },
      },
    });

    // Lấy đơn hàng của tháng trước
    const previousOrders = await prisma.oRDER.findMany({
      where: {
        status: "COMPLETED",
        paid_at: {
          gte: prevStart,
          lte: prevEnd,
        },
      },
    });

    // Hàm tính tổng tiền của các đơn hàng
    const getTotal = (orders: any[]) =>
      orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);

    const currentRevenue = getTotal(currentOrders);
    const previousRevenue = getTotal(previousOrders);

    // Tính sự thay đổi phần trăm giữa doanh thu tháng hiện tại và tháng trước
    const percentChange = previousRevenue
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : null;

    // Trả kết quả dưới dạng JSON
    return NextResponse.json({
      month,
      year,
      revenue: currentRevenue,
      previousRevenue,
      percentChange,
      trend: currentRevenue > previousRevenue ? "up" : currentRevenue < previousRevenue ? "down" : "equal",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi khi tính doanh thu!" }, { status: 500 });
  }
}
