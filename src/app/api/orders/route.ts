// src/app/api/orders/route.ts
// Orders are created BEFORE payment with PENDING status
// The Stripe webhook then marks them as PAID

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/helpers";

// POST /api/orders — create a new order (called at checkout before payment)
export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();
    const {
      items, address, paymentMethod, stripeSessionId, paypalOrderId,
      subtotal, discountAmount, shippingCost, tax, total, couponCode,
    } = body;

    // ── 1. Check stock ──────────────────────────────────────────
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, name: true, stock: true },
      });
      if (!product) {
        return NextResponse.json({ error: `Product not found` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Only ${product.stock} of "${product.name}" left in stock` },
          { status: 400 }
        );
      }
    }

    // ── 2. Save address ─────────────────────────────────────────
    const savedAddress = await prisma.address.create({
      data: {
        userId: user.id,
        firstName: address.firstName,
        lastName: address.lastName,
        street: address.street,
        city: address.city,
        province: address.province,
        country: address.country,
        postalCode: address.postalCode,
      },
    });

    // ── 3. Create order as PENDING ──────────────────────────────
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        addressId: savedAddress.id,
        status: "PENDING",
        paymentMethod,
        paymentStatus: "UNPAID",
        // Stripe session ID stored here — webhook uses this to find the order
        stripePaymentId: stripeSessionId ?? null,
        paypalOrderId: paypalOrderId ?? null,
        subtotal,
        discountAmount: discountAmount ?? 0,
        shippingCost,
        tax,
        total,
        couponCode: couponCode ?? null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    // ── 4. Decrement stock immediately ──────────────────────────
    // (Will be restored by webhook if payment fails)
    await prisma.$transaction(
      items.map((item: any) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );

    // ── 5. Record coupon usage ──────────────────────────────────
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon) {
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
        await prisma.couponUsage.create({
          data: { couponId: coupon.id, userId: user.id, orderId: order.id },
        }).catch(() => {});
      }
    }

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// GET /api/orders — current user's orders
export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: { select: { name: true, images: true, slug: true } },
          },
        },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
