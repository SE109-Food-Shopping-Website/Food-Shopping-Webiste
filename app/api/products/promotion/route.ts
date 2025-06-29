import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const now = new Date();

    const coupons = await prisma.cOUPON.findMany({
        where: {
        start_at: { lte: now },
        end_at: { gte: now },
        status: "Active",
        },
    });

    const productTypeIds = coupons.map((c) => Number(c.product_type_id)).filter(Boolean);

    const products = await prisma.pRODUCT.findMany({
        where: {
            productType_id: {
                in: productTypeIds,
            },
        },
        include: {
            productType: true,
        },
    });

    const productsWithSale = products.map((product) => {
        const matchedCoupon = coupons.find(
          (c) => Number(c.product_type_id) === product.productType_id
        );
      
        const salePrice = matchedCoupon
          ? product.price * (1 - matchedCoupon.discount_percent / 100)
          : product.price;
      
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          images: product.images ? JSON.parse(product.images) : [],
          productType_id: product.productType_id,
          salePrice: Math.round(salePrice),
          productType: product.productType, 
          coupon: matchedCoupon ?? null,    
        };
    });      

  return NextResponse.json(productsWithSale);
}