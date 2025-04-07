import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// Lấy danh sách
export async function GET() {
  try {
    const providerList = await prisma.pROVIDER.findMany();
    return NextResponse.json(providerList);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu!" }, { status: 500 });
  }
}

// Thêm nhà cung cấp
export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { name, address, email } = body;

      // Kiểm tra các trường dữ liệu không trống
      if (!name || !address || !email) {
        return new Response(
          JSON.stringify({ error: "Thiếu dữ liệu" }),
          { status: 400 }
        );
      }

      // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu hay chưa
      const existingProvider = await prisma.pROVIDER.findUnique({
        where: { email },  // Kiểm tra tính duy nhất của email
      });

      if (existingProvider) {
        return new Response(
          JSON.stringify({ error: "Email đã tồn tại trong hệ thống" }),
          { status: 400 }
        );
      }

      // Tạo mới nhà cung cấp nếu không có lỗi
      const newProvider = await prisma.pROVIDER.create({
        data: {
          name,
          address,
          email,
        },
      });

      return new Response(JSON.stringify(newProvider), { status: 201 });
    } catch (error: any) {
      console.error("Lỗi khi thêm dữ liệu:", error);
      return new Response(
        JSON.stringify({ error: error.message || "Lỗi khi thêm dữ liệu!" }),
        { status: 500 }
      );
    }
  }



