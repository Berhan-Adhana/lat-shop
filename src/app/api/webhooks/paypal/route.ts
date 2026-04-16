// src/app/api/webhooks/paypal/route.ts
// PayPal calls this after payment events

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.event_type;

    switch (eventType) {
      case "PAYMENT.CAPTURE.COMPLETED": {
        const paypalOrderId = body.resource?.supplementary_data?.related_ids?.order_id
          ?? body.resource?.id;

        if (paypalOrderId) {
          const order = await prisma.order.findFirst({
            where: { paypalOrderId },
            include: { user: true },
          });

          if (order) {
            await prisma.order.update({
              where: { id: order.id },
              data: { paymentStatus: "PAID", status: "PROCESSING" },
            });

            await sendOrderConfirmationEmail({
              email: order.user.email,
              name: order.user.name,
              orderId: order.id,
              total: order.total,
            });
          }
        }
        break;
      }

      case "PAYMENT.CAPTURE.DENIED":
      case "PAYMENT.CAPTURE.REVERSED": {
        const paypalOrderId = body.resource?.id;
        if (paypalOrderId) {
          await prisma.order.updateMany({
            where: { paypalOrderId },
            data: { paymentStatus: "FAILED", status: "CANCELLED" },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("PayPal webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
