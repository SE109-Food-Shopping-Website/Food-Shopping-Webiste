import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // const session = await getServerSession(authOptions);
    // const userId = session?.user?.id;

    const userId = 1;  // Giả lập userId cho việc test

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, address, cart, shippingFee, discount, totalPayment } = body;

    const originalPrice = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const order = await prisma.oRDER.create({
      data: {
        user_id: userId,
        originalPrice,
        shippingFee,
        discountAmount: discount,
        totalPrice: totalPayment,
        note: `Giao cho ${name}, sdt: ${phone}, địa chỉ: ${address}`,
        orderDetails: {
          create: cart.map((item: any) => ({
            product_id: item.id,
            quantity: item.quantity,
            originalPrice: item.price,
            salePrice: item.price,
          })),
        },
      },
      include: {
        orderDetails: true,
      },
    });
    
    return NextResponse.json({ message: "Order created", order });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     // const session = await getServerSession(authOptions);
//     // const userId = session?.user?.id;

//     const userId = 1;  // Giả lập userId cho việc test

//     if (!userId) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const { name, phone, address, cart, shippingFee, discount, totalPayment } = body;

//     const originalPrice = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

//     // Tạo đơn hàng
//     const order = await prisma.oRDER.create({
//       data: {
//         user_id: userId,
//         originalPrice,
//         shippingFee,
//         discountAmount: discount,
//         totalPrice: totalPayment,
//         note: `Giao cho ${name}, sdt: ${phone}, địa chỉ: ${address}`,
//         orderDetails: {
//           create: cart.map((item: any) => ({
//             product_id: item.id,
//             quantity: item.quantity,
//             originalPrice: item.price,
//             salePrice: item.price,
//           })),
//         },
//       },
//       include: {
//         orderDetails: true,
//       },
//     });

//     // Cập nhật số lượng tồn kho
//     await Promise.all(
//       cart.map((item: any) =>
//         prisma.product.update({
//           where: { id: item.id },
//           data: { quantity: { decrement: item.quantity } },  // Giảm số lượng trong kho
//         })
//       )
//     );

//     return NextResponse.json({ message: "Order created", order });
//   } catch (error) {
//     console.error("Order error:", error);
//     return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
//   }
// }
