// src/app/api/admin/shipping/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/helpers";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const body = await req.json();
    const zone = await prisma.shippingZone.update({
      where: { id: params.id },
      data: {
        name: body.name,
        countries: body.countries,
        rate: Number(body.rate),
        freeOver: body.freeOver ? Number(body.freeOver) : null,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json(zone);
  } catch {
    return NextResponse.json({ error: "Failed to update shipping zone" }, { status: 500 });
  }
}
