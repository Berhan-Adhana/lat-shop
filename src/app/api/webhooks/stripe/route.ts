// src/app/api/webhooks/stripe/route.ts
// When Stripe confirms payment, mark order PAID and ensure stock is decremented

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status === "paid") {
          // Find order by Stripe session ID
          const order = await prisma.order.findFirst({
            where: { stripePaymentId: session.id },
            include: {
              user: true,
              items: true,
            },
          });

          if (order) {
            // Mark as paid
            await prisma.order.update({
              where: { id: order.id },
              data: {
                paymentStatus: "PAID",
                status: "PROCESSING",
              },
            });

            // Decrement stock (in case the order route didn't already do it)
            // Using upsert-style: only decrement if stock > 0
            for (const item of order.items) {
              await prisma.product.updateMany({
                where: {
                  id: item.productId,
                  stock: { gte: item.quantity }, // safety check
                },
                data: { stock: { decrement: item.quantity } },
              });
            }

            // Send confirmation email
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

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await prisma.order.updateMany({
          where: { stripePaymentId: paymentIntent.id },
          data: { paymentStatus: "FAILED", status: "CANCELLED" },
        });
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        // Find order and restore stock
        const order = await prisma.order.findFirst({
          where: { stripePaymentId: charge.payment_intent as string },
          include: { items: true },
        });
        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: { paymentStatus: "REFUNDED", status: "REFUNDED" },
          });
          // Restore stock on refund
          await prisma.$transaction(
            order.items.map((item) =>
              prisma.product.update({
                where: { id: item.productId },
                data: { stock: { increment: item.quantity } },
              })
            )
          );
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}
