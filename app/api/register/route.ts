import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Đường dẫn đến Prisma Client của bạn

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, password, name, address, gender, birthday, isActive } = body;

    // Kiểm tra yêu cầu mật khẩu trên 6 ký tự
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Mật khẩu phải dài hơn 6 ký tự" },
        { status: 400 }
      );
    }

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await prisma.uSER.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email đã được sử dụng" },
        { status: 400 }
      );
    }

    let formattedBirthday = birthday ? new Date(birthday) : null;
    if (birthday && formattedBirthday && isNaN(formattedBirthday.getTime())) {
    return NextResponse.json({ message: "Ngày sinh không hợp lệ" }, { status: 400 });
    }

    // Tạo người dùng mới
    const newUser = await prisma.uSER.create({
      data: {
        email,
        phone,
        password,
        name,
        address,
        gender,
        birthday: formattedBirthday,
        isActive: true,
        role_id: 2, // Role của người dùng là "client" (role_id = 2)
        created_at: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Đăng ký thành công", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Đăng ký lỗi:", error);
    return NextResponse.json(
      { message: "Lỗi server, vui lòng thử lại sau" },
      { status: 500 }
    );
  }
}
