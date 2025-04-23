import { NextRequest, NextResponse } from "next/server";

// Hàm gọi API nội bộ
async function fetchInternalAPI(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Lỗi khi fetch ${url}`);
  return res.json();
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const month = searchParams.get("month");

    if (!month) {
      return NextResponse.json({ error: "Thiếu tham số tháng!" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const [incomeData, expenseData] = await Promise.all([
      fetchInternalAPI(`${baseUrl}/api/admin/statics/income?month=${month}`),
      fetchInternalAPI(`${baseUrl}/api/admin/statics/expense?month=${month}`),
    ]);

    const revenue = Number(incomeData.revenue || 0);
    const expense = Number(expenseData.revenue || 0); // "revenue" trong route của expense là tổng chi
    const profit = revenue - expense;

    const trend = profit > 0 ? "up" : profit < 0 ? "down" : "equal";

    return NextResponse.json({
      month,
      profit,
      trend,
      income: revenue,
      expense,
    });
  } catch (error) {
    console.error("Lỗi khi tính lợi nhuận:", error);
    return NextResponse.json({ error: "Lỗi khi tính lợi nhuận!" }, { status: 500 });
  }
}
