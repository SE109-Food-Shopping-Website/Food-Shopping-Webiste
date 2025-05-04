// app/api/feedback/public/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const feedbacks = await prisma.fEEDBACK.findMany({
      where: {
        comment: {
          not: null,
        },
      },
      include: {
        user: true,
        order: {
          include: {
            orderDetails: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(feedbacks);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
