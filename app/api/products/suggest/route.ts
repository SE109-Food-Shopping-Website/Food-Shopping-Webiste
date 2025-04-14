import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const productType = searchParams.get("productType");

    if (!query) return NextResponse.json([]);

    const suggestions = await prisma.pRODUCT.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
        ...(productType && productType !== "Danh mục sản phẩm"
          ? {
              productType: {
                // đây là quan hệ tới PRODUCT_TYPE nên truy theo tên ở bảng đó
                name: {
                  equals: productType,
                  mode: "insensitive",
                },
              },
            }
          : {}),
      },
      take: 10,
      select: {
        id: true,
        name: true,
        images: true,
        productType: true, // thêm productType vào select nếu cần
      },
    });

    const parsed = suggestions.map((item) => ({
      ...item,
      images: item.images ? JSON.parse(item.images) : [],
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("❌ Lỗi API gợi ý:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}