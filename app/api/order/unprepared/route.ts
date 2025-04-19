import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import { getSession } from "@/lib/session";

export async function GET() {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

  try {
    const orders = await prisma.oRDER.findMany({
      where: {
        user_id: session.id,
        status: "PENDING",
      },
      include: {
        orderDetails: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching orders" }, { status: 500 });
  }
}