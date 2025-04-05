import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; 

export async function GET() {
  try {
    const productTypes = await prisma.pRODUCT_TYPE.findMany();
    return NextResponse.json(productTypes);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu!" }, { status: 500 });
  }
}