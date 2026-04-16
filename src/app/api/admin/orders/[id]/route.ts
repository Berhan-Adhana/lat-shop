// src/app/api/admin/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/helpers";
import { sendShippingNotificationEmail } from "@/lib/email";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        address: true,
        items: { include: { product: { select: { name: true, images: true, slug: true } } } },
      },
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const body = await req.json();
    const previousOrder = await prisma.order.findUnique({ where: { id: params.id }, include: { user: true } });

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.trackingNumber !== undefined && { trackingNumber: body.trackingNumber }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
      include: { user: true },
    });

    // Send shipping email when status changes to SHIPPED
    if (
      body.status === "SHIPPED" &&
      previousOrder?.status !== "SHIPPED" &&
      order.user
    ) {
      await sendShippingNotificationEmail({
        email: order.user.email,
        name: order.user.name,
        orderId: order.id,
        trackingNumber: order.trackingNumber ?? undefined,
      }).catch(console.error); // don't fail if email fails
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
