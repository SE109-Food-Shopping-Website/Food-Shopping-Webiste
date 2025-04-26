import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// Lấy danh sách
export async function GET() {
  try {
    const pointList = await prisma.uSER_RANK.findMany();
    return NextResponse.json(pointList);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu!" }, { status: 500 });
  }
}
