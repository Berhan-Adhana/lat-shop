// src/app/api/payments/paypal/capture/route.ts

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
    throw new Error(`PayPal auth failed: ${data.error_description ?? "Unknown"}`);
  }

  return data.access_token;
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { orderID } = await req.json();

    if (!orderID) {
      return NextResponse.json({ error: "orderID is required" }, { status: 400 });
    }

    const accessToken = await getAccessToken();

    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const capture = await res.json();

    if (!res.ok) {
      console.error("PayPal capture failed:", JSON.stringify(capture));
      return NextResponse.json(
        { error: capture.message ?? "PayPal capture failed" },
        { status: res.status }
      );
    }

    console.log(`✅ PayPal captured: ${orderID} — status: ${capture.status}`);

    return NextResponse.json({
      status: capture.status,
      orderID,
      captureID: capture.purchase_units?.[0]?.payments?.captures?.[0]?.id,
    });

  } catch (err: any) {
    console.error("PayPal capture error:", err.message);
    return NextResponse.json(
      { error: err.message ?? "Capture failed" },
      { status: 500 }
    );
  }
}
