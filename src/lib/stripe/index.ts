// src/lib/stripe/index.ts

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true,
});

// Create a Stripe checkout session for an order
export async function createStripeSession({
  orderId,
  items,
  shippingCost,
  discountAmount,
  customerEmail,
  successUrl,
  cancelUrl,
}: {
  orderId: string;
  items: Array<{
    name: string;
    price: number; // in dollars
    quantity: number;
    image?: string;
  }>;
  shippingCost: number;
  discountAmount: number;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
    (item) => ({
      price_data: {
        currency: "cad",
        product_data: {
          name: item.name,
          ...(item.image && { images: [item.image] }),
        },
        unit_amount: Math.round(item.price * 100), // convert to cents
      },
      quantity: item.quantity,
    })
  );

  // Add shipping as a line item
  if (shippingCost > 0) {
    lineItems.push({
      price_data: {
        currency: "cad",
        product_data: { name: "Shipping" },
        unit_amount: Math.round(shippingCost * 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { orderId },
    // Apply discount if any
    ...(discountAmount > 0 && {
      discounts: [
        {
          coupon: await createStripeCoupon(discountAmount),
        },
      ],
    }),
    // Enable Apple Pay & Google Pay automatically
    payment_method_options: {
      card: {
        request_three_d_secure: "automatic",
      },
    },
  });

  return session;
}

// Create a one-time Stripe coupon for discount
async function createStripeCoupon(amount: number) {
  const coupon = await stripe.coupons.create({
    amount_off: Math.round(amount * 100),
    currency: "cad",
    duration: "once",
  });
  return coupon.id;
}
