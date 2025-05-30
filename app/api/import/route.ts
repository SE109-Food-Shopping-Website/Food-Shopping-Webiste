import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Lấy danh sách đơn nhập hàng
export async function GET() {
  try {
    const imports = await prisma.iMPORT.findMany({
      include: {
        provider: true, // Lấy thông tin nhà cung cấp
      },
      orderBy: {
        id: "asc", // Sắp xếp theo ngày tạo giảm dần
      },
    });
    return NextResponse.json(imports);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy dữ liệu!" },
      { status: 500 }
    );
  }
}

// POST: Thêm đơn nhập hàng
export async function POST(req: Request) {
  try {
    const { provider_id, products } = await req.json();

    // Kiểm tra dữ liệu đầu vào
    if (!provider_id || !products || products.length === 0) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    // Kiểm tra provider tồn tại
    const existingProvider = await prisma.pROVIDER.findUnique({
      where: { id: Number(provider_id) },
    });
    if (!existingProvider) {
      return NextResponse.json(
        { error: "Nhà cung cấp không tồn tại" },
        { status: 404 }
      );
    }

    // Kiểm tra sản phẩm hợp lệ
    for (const product of products) {
      if (!product.product_id || !product.price || !product.quantity) {
        return NextResponse.json(
          { error: "Thông tin sản phẩm không hợp lệ" },
          { status: 400 }
        );
      }
      const existingProduct = await prisma.pRODUCT.findUnique({
        where: { id: Number(product.product_id) },
      });
      if (!existingProduct) {
        return NextResponse.json(
          { error: `Sản phẩm ID ${product.product_id} không tồn tại` },
          { status: 404 }
        );
      }
    }

    // Tính tổng tiền hàng
    const totalPrice = products.reduce(
      (sum: number, product: any) =>
        sum + Number(product.price) * Number(product.quantity),
      0
    );

    // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
    const result = await prisma.$transaction(async (prisma) => {
      // Tạo đơn nhập hàng
      const newImport = await prisma.iMPORT.create({
        data: {
          totalPrice,
          provider_id: Number(provider_id),
          importDetails: {
            create: products.map((product: any) => ({
              product: {
                connect: { id: Number(product.product_id) },
              },
              price: Number(product.price),
              quantity: Number(product.quantity),
            })),
          },
        },
        include: {
          importDetails: true,
        },
      });

      // Cập nhật số lượng và giá sản phẩm
      for (const product of products) {
        // Lấy productType của sản phẩm
        const productData = await prisma.pRODUCT.findUnique({
          where: { id: Number(product.product_id) },
          select: { productType_id: true },
        });

        if (!productData || !productData.productType_id) {
          throw new Error(`Sản phẩm ID ${product.product_id} không có productType_id`);
        }

        const productType = await prisma.pRODUCT_TYPE.findUnique({
          where: { id: productData.productType_id },
          select: { priceMarginPct: true },
        });

        if (!productType) {
          throw new Error(`ProductType ID ${productData.productType_id} không tồn tại`);
        }

        // Tính giá mới: price = IMPORT_DETAILS.price * (1 + PRODUCT_TYPE.priceMarginPct / 100)
        const newPrice = Number(product.price) * (1 + Number(productType.priceMarginPct) / 100);

        // Cập nhật số lượng và giá sản phẩm
        await prisma.pRODUCT.update({
          where: { id: Number(product.product_id) },
          data: {
            quantity: {
              increment: Number(product.quantity), // Tăng số lượng trong kho
            },
            price: newPrice, // Cập nhật giá
          },
        });
      }

      return newImport;
    });

    return NextResponse.json({
      message: "Thêm đơn nhập hàng thành công",
      data: result,
    });
  } catch (error) {
    console.error("Lỗi khi thêm đơn nhập hàng:", error);
    return NextResponse.json(
      { message: "Lỗi khi thêm đơn nhập hàng!", error: String(error) },
      { status: 500 }
    );
  }
}