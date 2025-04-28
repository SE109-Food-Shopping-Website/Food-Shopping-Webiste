import { NextResponse } from "next/server";
import  {prisma } from "@/lib/prisma"; 

export async function GET() {
  try {
    const feedbacks = await prisma.fEEDBACK.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        order: {
          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json({ feedbacks }, { status: 200 });
  } catch (error) {
    console.error("[FEEDBACK_GET]", error);
    return NextResponse.json({ message: "Lỗi khi lấy feedback" }, { status: 500 });
  }
}