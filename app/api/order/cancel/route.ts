import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { orderId, reason } = await req.json();
  console.log("Hủy đơn:", orderId, "Lý do:", reason);

  // Giả lập response
  return NextResponse.json({ message: "Yêu cầu hủy đơn đã được ghi nhận" });
}


// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const { orderId, reason } = await req.json();

//     // Kiểm tra đơn hàng, quyền người dùng... nếu cần

//     await prisma.oRDER.update({
//       where: { id: orderId },
//       data: {
//         status: "CANCELLED",
//         cancelReason: reason,
//         cancelledAt: new Date(),
//       },
//     });

//     return NextResponse.json({ message: "Đã hủy đơn thành công" });
//   } catch (err: any) {
//     return NextResponse.json(
//       { message: "Lỗi khi hủy đơn hàng", error: err.message },
//       { status: 500 }
//     );
//   }
// }