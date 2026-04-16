// src/app/api/wishlist/[productId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/helpers";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const { user, error } = await requireAuth();
  if (error) return error;
  try {
    await prisma.wishlist.delete({
      where: {
        userId_productId: { userId: user.id, productId: params.productId },
      },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 });
  }
}
