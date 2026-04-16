// src/app/api/coupons/validate/route.ts
// Validates a coupon code at checkout

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/helpers";

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { code, orderAmount } = await req.json();

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    // Does it exist?
    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    // Is it active?
    if (!coupon.isActive) {
      return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
    }

    // Has it expired?
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    // Has it hit max uses?
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
    }

    // Meets minimum order amount?
    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return NextResponse.json({
        error: `Minimum order of CA$${coupon.minOrderAmount.toFixed(2)} required`,
      }, { status: 400 });
    }

    // Has this user already used it?
    if (coupon.onePerCustomer) {
      const used = await prisma.couponUsage.findFirst({
        where: { couponId: coupon.id, userId: user.id },
      });
      if (used) {
        return NextResponse.json({ error: "You have already used this coupon" }, { status: 400 });
      }
    }

    return NextResponse.json({ coupon });
  } catch (err) {
    console.error("Coupon validation error:", err);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
