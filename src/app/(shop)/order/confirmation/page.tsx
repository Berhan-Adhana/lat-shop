// src/app/(shop)/order/confirmation/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import s from "./confirmation.module.css";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("orderId");
  const clearCart = useCartStore((st) => st.clearCart);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear cart on confirmation
    clearCart();

    // If we have a Stripe session ID, fetch the order
    if (sessionId) {
      fetch(`/api/orders/by-session/${sessionId}`)
        .then((r) => r.json())
        .then((data) => { setOrder(data); setLoading(false); })
        .catch(() => setLoading(false));
    } else if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((r) => r.json())
        .then((data) => { setOrder(data); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [sessionId, orderId, clearCart]);

  const displayId = order?.id ?? orderId ?? sessionId;
  const shortId = displayId ? displayId.slice(-8).toUpperCase() : "—";

  if (loading) {
    return (
      <div className={s.page}>
        <div className={s.card}>
          <div className={s.loading}>
            <div className={s.spinner} />
            <p style={{ color: "#7a3f1d", fontFamily: "system-ui" }}>Confirming your order...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <div className={s.card}>
        <div className={s.successIcon}>🎉</div>

        <h1>Order Confirmed!</h1>
        <p className={s.subtitle}>
          Thank you for your purchase! We&apos;ve received your order and
          sent a confirmation email to your inbox.
        </p>

        <div className={s.orderRef}>
          Order Reference
          <strong>#{shortId}</strong>
        </div>

        <div className={s.steps}>
          <div className={s.step}>
            <div className={s.stepIcon}>📧</div>
            <div className={s.stepText}>
              <strong>Confirmation Email Sent</strong>
              <span>Check your inbox for your order details</span>
            </div>
          </div>
          <div className={s.step}>
            <div className={s.stepIcon}>📦</div>
            <div className={s.stepText}>
              <strong>Order Being Prepared</strong>
              <span>We&apos;ll pack your order with care in Calgary</span>
            </div>
          </div>
          <div className={s.step}>
            <div className={s.stepIcon}>🚚</div>
            <div className={s.stepText}>
              <strong>Shipping Notification</strong>
              <span>You&apos;ll receive a tracking number once shipped</span>
            </div>
          </div>
        </div>

        <div className={s.actions}>
          <Link href="/account/orders" className={s.primaryBtn}>
            Track My Order
          </Link>
          <Link href="/shop" className={s.secondaryBtn}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
