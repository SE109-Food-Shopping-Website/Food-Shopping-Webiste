import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs-extra";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.pRODUCT.findUnique({
      where: { id: parseInt(params.id, 10) },
      include: {
        provider: { select: { id: true, name: true } },
        productType: { select: { id: true, name: true } },
        importDetails: true, 
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
    }

    const totalImportedQuantity = product.importDetails.reduce(
      (acc, detail) => acc + detail.quantity,
      0
    );

    const responseData = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      provider_name: product.provider?.name || null,
      productType_name: product.productType?.name || null,
      totalImportedQuantity,
    };

    console.log("Dữ liệu sản phẩm:", responseData);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu!" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const productType_id = formData.get("productType_id") as string;
    const provider_id = formData.get("provider_id") as string;
    const unit = formData.get("unit") as string;
    const description = formData.get("description") as string;
    const quantity = parseInt(formData.get("quantity") as string) || 0;
    const existingImages = JSON.parse(formData.get("existingImages") as string) || [];
    const images = formData.getAll("images") as File[];

    if (!name || !unit || !description || !productType_id || !provider_id || isNaN(quantity)) {
      return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });
    }

    const productId = parseInt(params.id, 10);
    const product = await prisma.pRODUCT.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Sản phẩm không tồn tại" }, { status: 404 });
    }

    // Kiểm tra số lượng ảnh tối đa
    const totalImages = existingImages.length + images.filter((img) => img.size > 0).length;
    if (totalImages > 5) {
      return NextResponse.json({ error: "Tối đa 5 ảnh được phép" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "product", productId.toString());
    await mkdir(uploadDir, { recursive: true });

    // Xử lý ảnh mới
    const newImageUrls: string[] = [];
    for (const image of images) {
      if (image.size > 0) {
        if (image.size > 5 * 1024 * 1024) {
          return NextResponse.json({ error: `Ảnh ${image.name} vượt quá 5MB` }, { status: 400 });
        }

        const buffer = Buffer.from(await image.arrayBuffer());
        const filename = image.name.replace(/\s+/g, "_");
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);
        newImageUrls.push(`/product/${productId}/${filename}`);
      }
    }

    // Kết hợp ảnh cũ và ảnh mới
    const allImages = [...existingImages, ...newImageUrls];

    // Xóa ảnh cũ không còn trong danh sách
    const oldImages = product.images ? JSON.parse(product.images) : [];
    for (const oldImage of oldImages) {
      if (!allImages.includes(oldImage)) {
        const filePath = path.join(process.cwd(), "public", oldImage);
        await fs.remove(filePath).catch((err) => console.error("Lỗi xóa ảnh cũ:", err));
      }
    }

    // Cập nhật sản phẩm
    const updatedProduct = await prisma.pRODUCT.update({
      where: { id: productId },
      data: {
        name,
        productType_id: parseInt(productType_id, 10),
        provider_id: parseInt(provider_id, 10),
        unit,
        description,
        quantity,
        images: JSON.stringify(allImages),
      },
    });

    return NextResponse.json({
      ...updatedProduct,
      images: allImages,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật dữ liệu:", error);
    return NextResponse.json({ error: "Lỗi khi cập nhật dữ liệu!" }, { status: 500 });
  }
}