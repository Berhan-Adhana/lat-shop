// src/app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/helpers";

// POST /api/reviews — submit a review
export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { productId, rating, comment } = await req.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Product ID and rating (1-5) are required" }, { status: 400 });
    }

    // Check user actually purchased this product
    const purchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: { userId: user.id, paymentStatus: "PAID" },
      },
    });

    if (!purchased) {
      return NextResponse.json(
        { error: "You can only review products you have purchased" },
        { status: 403 }
      );
    }

    // Upsert — one review per user per product
    const review = await prisma.review.upsert({
      where: { userId_productId: { userId: user.id, productId } },
      update: { rating, comment: comment ?? null },
      create: {
        userId: user.id,
        productId,
        rating,
        comment: comment ?? null,
        isVisible: true,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
