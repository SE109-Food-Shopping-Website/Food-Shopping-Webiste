import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { orderId, reason, description, img_links, date, address } = await req.json();
  console.log("Trả hàng:", orderId, "Lý do:", reason, "Mô tả:", description, "Ảnh liên kết:", img_links, "Ngày:", date, "Địa chỉ:", address);

  // Giả lập response
  return NextResponse.json({ message: "Yêu cầu trả hàng đã được ghi nhận" });
}