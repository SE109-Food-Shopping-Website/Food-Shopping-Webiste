import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const orderId = formData.get("orderId") as string;
    const comment = formData.get("comment") as string;
    const rating = Number(formData.get("rating"));
    const images = formData.getAll("images") as File[];

    if (!orderId || !rating) {
      return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });
    }

    const order = await prisma.oRDER.findUnique({
      where: { id: Number(orderId) },
      select: { user_id: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
    }

    const orderDetail = await prisma.oRDER_DETAILS.findFirst({
      where: { order_id: Number(orderId) },
      select: { product_id: true },
    });

    if (!orderDetail) {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm trong đơn hàng" }, { status: 404 });
    }

    const newFeedback = await prisma.fEEDBACK.create({
      data: {
        order_id: Number(orderId),
        product_id: orderDetail.product_id,
        user_id: order.user_id!,
        comment: comment || "",
        images: "",
        rating: rating,
      },
    });

    const feedbackId = newFeedback.id.toString().replace(/[^a-zA-Z0-9_-]/g, "");

    const uploadDir = path.join(process.cwd(), "public", "feedback", feedbackId);
    await mkdir(uploadDir, { recursive: true });

    const imagePaths: string[] = [];

    for (const image of images) {
      if (image.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Ảnh không được vượt quá 5MB" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await image.arrayBuffer());
      const fileName = `${image.name.replace(/\s+/g, "_")}`;
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      imagePaths.push(`/feedback/${feedbackId}/${fileName}`);
    }

    await prisma.fEEDBACK.update({
      where: { id: newFeedback.id },
      data: { images: JSON.stringify(imagePaths) },
    });

    return NextResponse.json(
      { ...newFeedback, images: imagePaths },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi upload feedback:", error);
    return NextResponse.json({ error: "Lỗi server!" }, { status: 500 });
  }
}