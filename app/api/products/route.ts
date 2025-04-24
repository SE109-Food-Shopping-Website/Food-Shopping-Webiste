import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs-extra";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
//import { mkdir } from "fs";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get("provider_id");

    const products = await prisma.pRODUCT.findMany({
      where: providerId ? { provider_id: Number(providerId) } : {},
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        productType_id: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    return NextResponse.json({ error: "Lỗi lấy sản phẩm" }, { status: 500 });
  }
}

// Thêm sản phẩm
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const unit = formData.get("unit") as string;
    const productType_id = Number(formData.get("productType_id"));
    const provider_id = Number(formData.get("provider_id"));
    const images = formData.getAll("images") as File[];

    if (
      !name ||
      !description ||
      !unit ||
      !productType_id ||
      !provider_id ||
      images.length === 0
    ) {
      return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });
    }

    const newProduct = await prisma.pRODUCT.create({
      data: {
        name,
        price: 0, // Giá sản phẩm mặc định là 0
        unit,
        description,
        productType_id,
        provider_id,
        images: "",
      },
    });

    const productId = newProduct.id.toString().replace(/[^a-zA-Z0-9_-]/g, "");

    // Tạo thư mục lưu ảnh
    // const uploadDir = path.join(process.cwd(), "public", productId, "imgs");
    // await fs.ensureDir(uploadDir);
    const uploadDir = path.join(process.cwd(), "public", "product", productId);
    await mkdir(uploadDir, { recursive: true });

    const imagePaths: string[] = [];

    for (const image of images) {

      // Kiểm tra dung lượng ảnh (<= 5MB)
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

      // Lưu đường dẫn ảnh
      imagePaths.push(`/product/${productId}/${fileName}`);
    }

    // Cập nhật lại đường dẫn ảnh
    await prisma.pRODUCT.update({
      where: { id: newProduct.id },
      data: { images: JSON.stringify(imagePaths) }, // JSON string
    });

    return NextResponse.json(
      { ...newProduct, images: imagePaths },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi thêm dữ liệu:", error);
    return NextResponse.json(
      { error: "Lỗi khi thêm dữ liệu!" },
      { status: 500 }
    );
  }
}
