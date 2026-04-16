// src/app/api/shipping/all/route.ts
// Returns ALL shipping zones (including inactive) for admin use

import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/helpers";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const zones = await prisma.shippingZone.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(zones);
  } catch {
    return NextResponse.json({ error: "Failed to fetch zones" }, { status: 500 });
  }
}
