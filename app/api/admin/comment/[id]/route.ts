import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
 
interface Params {
  params: {
    id: string;
  };
}
 
export async function GET(req: NextRequest, { params }: { params:  {id:string} }) {
  try {
    const feedbackId = parseInt(params.id);
 
    if (isNaN(feedbackId)) {
      return NextResponse.json({ message: "ID không hợp lệ" }, { status: 400 });
    }
 
    const feedback = await prisma.fEEDBACK.findUnique({
      where: { id: feedbackId },
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
 
    if (!feedback) {
      return NextResponse.json({ message: "Không tìm thấy feedback" }, { status: 404 });
    }
 
     // Trả về feedback với trường images
    return NextResponse.json({ feedback }, { status: 200 });
  } catch (error) {
    console.error("[FEEDBACK_DETAIL_GET]", error);
    return NextResponse.json({ message: "Lỗi khi lấy chi tiết feedback" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const feedbackId = parseInt(params.id);

    // Kiểm tra nếu ID hợp lệ
    if (isNaN(feedbackId)) {
      return NextResponse.json({ message: "ID không hợp lệ" }, { status: 400 });
    }

    // Lấy dữ liệu phản hồi từ request body
    const { reply } = await req.json();

    // Kiểm tra nếu phản hồi không rỗng
    if (!reply || reply.trim().length === 0) {
      return NextResponse.json({ message: "Phản hồi không được để trống" }, { status: 400 });
    }

    // Cập nhật phản hồi cho feedback
    const updatedFeedback = await prisma.fEEDBACK.update({
      where: { id: feedbackId },
      data: { reply }, 
    });

    return NextResponse.json({ feedback: updatedFeedback }, { status: 200 });
  } catch (error) {
    console.error("[FEEDBACK_REPLY_PUT]", error);
    return NextResponse.json({ message: "Lỗi khi gửi phản hồi" }, { status: 500 });
  }
}