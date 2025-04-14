import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) return NextResponse.json([]);

    const suggestions = await prisma.pRODUCT.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 10,
      select: {
        id: true,
        name: true,
        images: true,
      },
    });

    const parsed = suggestions.map((item) => ({
      ...item,
      images: item.images ? JSON.parse(item.images) : [],
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Lỗi API gợi ý:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}