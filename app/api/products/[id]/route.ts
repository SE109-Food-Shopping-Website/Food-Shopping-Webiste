import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

// Lấy thông tin sản phẩm theo ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }
    const product = await prisma.pRODUCT.findUnique({
      where: { id: parseInt(id, 10) }, // Đổi ID thành số nguyên
      include: {
        provider: {
          select: {
            id: true,
            name: true,
          },
        },
        productType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    // Format lại dữ liệu trả về
    const responseData = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [], // Chuyển đổi chuỗi JSON thành mảng
      provider_name: product.provider?.name || null,
      productType_name: product.productType?.name || null,
    };
    console.log("Dữ liệu sản phẩm:", responseData); // Console log dữ liệu
    return NextResponse.json(responseData );
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy dữ liệu!" },
      { status: 500 }
    );
  }
}

// Cập nhật sản phẩm theo ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }
    const formData = await req.formData();

    // Lấy dữ liệu từ formData
    const name = formData.get("name") as string;
    const productType_id = formData.get("productType_id") as string;
    const provider_id = formData.get("provider_id") as string;
    const unit = formData.get("unit") as string;
    const description = formData.get("description") as string;
    const existingImages =
      JSON.parse(formData.get("existingImages") as string) || [];

    // Kiểm tra dữ liệu đầu vào
    if (!name || !unit || !description) {
      return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });
    }

    // Xử lý ảnh mới
    const newImageUrls: string[] = [];
    const images = formData.getAll("images") as File[];
    for (const image of images) {
      if (image.size > 0) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const filename = image.name.replace(/\s+/g, "_"); // Thay thế khoảng trắng bằng dấu gạch dưới
        const uploadDir = path.join(process.cwd(), "public", "product", id);
        try {
          await writeFile(uploadDir, buffer);
          newImageUrls.push(`/product/${id}/${filename}`); // Lưu đường dẫn ảnh mới
        } catch (error) {
          console.error("Lỗi khi lưu ảnh:", error);
        }
      }
    }

    // Kết hợp ảnh cũ và ảnh mới
    const allImages = [...existingImages, ...newImageUrls];

    // Cập nhật lại thông tin sản phẩm trong cơ sở dữ liệu
    const updatedProduct = await prisma.pRODUCT.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        productType_id: productType_id ? parseInt(productType_id, 10) : null,
        provider_id: provider_id ? parseInt(provider_id, 10) : null,
        unit,
        description,
        images: JSON.stringify(allImages), // Lưu đường dẫn ảnh dưới dạng JSON string
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Lỗi khi cập nhật dữ liệu:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật dữ liệu!" },
      { status: 500 }
    );
  }
}
