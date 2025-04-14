import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Lấy giỏ hàng (GET)
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  // Nếu không có userId thì return giỏ hàng trống
  if (!userId) {
    return NextResponse.json({ cart: [] });
  }

  const cart = await prisma.cART.findFirst({
    where: { user_id: Number(userId) },
    include: {
      cartDetails: {
        include: { product: true },
      },
    },
  });

  // Lấy cartId từ useId
  // if (cart) {
  //   await prisma.cART_DETAILS.deleteMany({ where: { cart_id: cart.id } });
  //   await prisma.cART.delete({ where: { id: cart.id } });
  // }  

  return NextResponse.json(cart || { cart: [] });
}

// Lưu giỏ hàng (POST)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, items } = body;

  if (!items || !Array.isArray(items)) {
    return NextResponse.json({ error: "Invalid cart items" }, { status: 400 });
  }

  // Nếu không có userId thì lưu giỏ hàng mà không gắn user
  if (!userId) {
    const tempCart = await prisma.cART.create({
      data: {
        user: undefined, // không liên kết user
        cartDetails: {
          create: items.map((item: any) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        },
      },
    });

    return NextResponse.json({ message: "Guest cart saved", cartId: tempCart.id });
  }

  // Có userId → xử lý như bình thường
  let cart = await prisma.cART.findFirst({
    where: { user_id: userId },
  });

  if (!cart) {
    cart = await prisma.cART.create({
      data: {
        user_id: userId,
        cartDetails: {
          create: items.map((item: any) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        },
      },
    });
  } else {
    await prisma.cART_DETAILS.deleteMany({
      where: { cart_id: cart.id },
    });

    await prisma.cART_DETAILS.createMany({
      data: items.map((item: any) => ({
        cart_id: cart!.id,
        product_id: item.id,
        quantity: item.quantity,
      })),
    });
  }

  return NextResponse.json({ message: "Cart saved" });
}

// Lấy giỏ hàng (GET)
// export async function GET(req: NextRequest) {
//   const userId = req.nextUrl.searchParams.get("userId");

//   if (!userId) {
//     return NextResponse.json({ cart: [] });
//   }

//   const cart = await prisma.cART.findFirst({
//     where: { user_id: Number(userId) },
//     include: {
//       cartDetails: {
//         include: { product: true },
//       },
//     },
//   });

//   return NextResponse.json(cart || { cart: [] });
// }

// Lưu giỏ hàng (POST)
// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { userId, items } = body;

//   if (!items || !Array.isArray(items)) {
//     return NextResponse.json({ error: "Invalid cart items" }, { status: 400 });
//   }

//   // Kiểm tra và giảm số lượng tồn kho
//   const insufficientStockItems = [];

//   // Kiểm tra số lượng tồn kho
//   for (const item of items) {
//     const product = await prisma.pRODUCT.findUnique({
//       where: { id: item.id },
//     });

//     if (product && product.quantity < item.quantity) {
//       insufficientStockItems.push({ productId: item.id, availableQuantity: product.quantity });
//     }
//   }

//   if (insufficientStockItems.length > 0) {
//     return NextResponse.json(
//       { error: "Insufficient stock", details: insufficientStockItems },
//       { message: `Sản phẩm ${item.name} không đủ hàng.` }
//       { status: 400 }
//     );
//   }

//   // Nếu không có userId thì lưu giỏ hàng mà không gắn user
//   if (!userId) {
//     const tempCart = await prisma.cART.create({
//       data: {
//         user: undefined, // không liên kết user
//         cartDetails: {
//           create: items.map((item: any) => ({
//             product_id: item.id,
//             quantity: item.quantity,
//           })),
//         },
//       },
//     });

//     // Giảm số lượng tồn kho sau khi lưu giỏ hàng
//     await Promise.all(
//       items.map((item: any) =>
//         prisma.pRODUCT.update({
//           where: { id: item.id },
//           data: { quantity: { decrement: item.quantity } },
//         })
//       )
//     );

//     return NextResponse.json({ message: "Guest cart saved", cartId: tempCart.id });
//   }

//   // Có userId → xử lý như bình thường
//   let cart = await prisma.cART.findFirst({
//     where: { user_id: userId },
//   });

//   if (!cart) {
//     cart = await prisma.cART.create({
//       data: {
//         user_id: userId,
//         cartDetails: {
//           create: items.map((item: any) => ({
//             product_id: item.id,
//             quantity: item.quantity,
//           })),
//         },
//       },
//     });
//   } else {
//     await prisma.cART_DETAILS.deleteMany({
//       where: { cart_id: cart.id },
//     });

//     await prisma.cART_DETAILS.createMany({
//       data: items.map((item: any) => ({
//         cart_id: cart!.id,
//         product_id: item.id,
//         quantity: item.quantity,
//       })),
//     });
//   }

//   // Giảm số lượng tồn kho sau khi lưu giỏ hàng
//   await Promise.all(
//     items.map((item: any) =>
//       prisma.pRODUCT.update({
//         where: { id: item.id },
//         data: { quantity: { decrement: item.quantity } },
//       })
//     )
//   );

//   return NextResponse.json({ message: "Cart saved" });
// }
