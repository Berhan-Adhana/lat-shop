// src/app/api/cart/route.ts
// Syncs the client-side Zustand cart to the database
// Called when user logs in or cart changes while logged in

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/helpers";

// GET /api/cart — load user's saved cart from DB
export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
        },
      },
    });

    if (!cart) {
      // Create empty cart if none exists
      const newCart = await prisma.cart.create({
        data: { userId: user.id },
        include: { items: { include: { product: { include: { category: true } } } } },
      });
      return NextResponse.json(newCart);
    }

    return NextResponse.json(cart);
  } catch {
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// POST /api/cart — sync entire cart from client to DB
export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { items } = await req.json();

    // Get or create cart
    let cart = await prisma.cart.findUnique({ where: { userId: user.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: user.id } });
    }

    // Clear existing items and replace with current client cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    if (items && items.length > 0) {
      await prisma.cartItem.createMany({
        data: items.map((item: any) => ({
          cartId: cart!.id,
          productId: item.productId,
          quantity: item.quantity,
        })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 });
  }
}

// DELETE /api/cart — clear the cart in DB (called after order placed)
export async function DELETE() {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}
