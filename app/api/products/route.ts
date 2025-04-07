import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs-extra";
import path from "path";

export async function GET() {
    try {
      const products = await prisma.pRODUCT.findMany();
      return NextResponse.json(products);
    } catch (error) {
      return NextResponse.json({ error: "Lỗi lấy sản phẩm" }, { status: 500 });
    }
  }

  // Thêm sản phẩm
  export async function POST(req: NextRequest) {
    try {
      const formData = await req.formData();
      const name = formData.get("name") as string;
      const price = Number(formData.get("price"));
      const description = formData.get("description") as string;
      const unit = formData.get("unit") as string;
      const images = formData.getAll("images") as File[];

      if (!name || !price || !description || !unit || images.length === 0) {
        return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });
      }

      const newProduct = await prisma.pRODUCT.create({
        data: {
          name,
          price,
          images: "",
          description,
          unit,
        },
      });

      const productId = newProduct.id.toString();

      // Tạo thư mục lưu ảnh
      const uploadDir = path.join(process.cwd(), "public", productId, "imgs");
      await fs.ensureDir(uploadDir);

      const imagePaths: string[] = [];

      for (const image of images) {
        // Kiểm tra dung lượng ảnh (<= 5MB)
        if (image.size > 5 * 1024 * 1024) {
          return NextResponse.json({ error: "Ảnh không được vượt quá 5MB" }, { status: 400 });
        }

        const buffer = Buffer.from(await image.arrayBuffer());
        const fileName = `${Date.now()}-${image.name.replace(/\s+/g, "_")}`;
        const filePath = path.join(uploadDir, fileName);
        await fs.writeFile(filePath, buffer);

        // Lưu đường dẫn ảnh
        imagePaths.push(`/product/${productId}/${fileName}`);
      }

      // Cập nhật lại đường dẫn ảnh
      await prisma.pRODUCT.update({
        where: { id: newProduct.id },
        data: { images: JSON.stringify(imagePaths) }, // JSON string
      });

      return NextResponse.json({ ...newProduct, images: imagePaths }, { status: 201 });
    } catch (error) {
      console.error("Lỗi khi thêm dữ liệu:", error);
      return NextResponse.json({ error: "Lỗi khi thêm dữ liệu!" }, { status: 500 });
    }
  }
