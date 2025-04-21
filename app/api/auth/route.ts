import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session || !session.id) {
        return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    try {
        const user = await prisma.uSER.findUnique({
        where: { id: session.id },
        select: { id: true, name: true, phone: true, address: true },
        });
        if (!user) {
        return NextResponse.json({ message: "Không tìm thấy người dùng" }, { status: 404 });
        }
        return NextResponse.json({ userId: user.id, user });
    } catch (error: any) {
        console.error("Lỗi khi lấy session:", error);
        return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
    }
    }