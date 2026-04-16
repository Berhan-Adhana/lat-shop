// src/app/api/payments/paypal/route.ts

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/helpers";

const PAYPAL_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const clientId     = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET is not set in .env");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();

  if (!res.ok || !data.access_token) {
    console.error("PayPal token error:", JSON.stringify(data));
    throw new Error(`PayPal auth failed: ${data.error_description ?? data.error ?? "Unknown"}`);
  }

  return data.access_token;
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();
    const { total, currency = "CAD" } = body;

    if (!total || isNaN(parseFloat(total))) {
      return NextResponse.json({ error: "Invalid total amount" }, { status: 400 });
    }

    const accessToken = await getAccessToken();

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: parseFloat(total).toFixed(2),
          },
        },
      ],
      // Optional: set return/cancel URLs for redirect-based flow
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/confirmation`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
        shipping_preference: "NO_SHIPPING", // we collect address ourselves
        user_action: "PAY_NOW",
        brand_name: "Lat Shop",
      },
    };

    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `lat-shop-${Date.now()}`, // idempotency key
      },
      body: JSON.stringify(orderPayload),
    });

    const order = await res.json();

    if (!res.ok || !order.id) {
      console.error("PayPal create order failed:", JSON.stringify(order));
      return NextResponse.json(
        { error: order.message ?? "PayPal order creation failed" },
        { status: res.status }
      );
    }

    console.log(`✅ PayPal order created: ${order.id} — CA$${total}`);

    // Return the order ID — this is what the PayPal SDK needs
    return NextResponse.json({ orderID: order.id });

  } catch (err: any) {
    console.error("PayPal POST error:", err.message);
    return NextResponse.json(
      { error: err.message ?? "Failed to create PayPal order" },
      { status: 500 }
    );
  }
}
