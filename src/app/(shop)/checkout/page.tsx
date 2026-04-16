// src/app/(shop)/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/cart.store";
import { useAuth } from "@/hooks/useAuth";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";
import s from "./checkout.module.css";

interface Address {
  firstName: string; lastName: string; street: string;
  city: string; province: string; country: string; postalCode: string;
}
interface ShippingRate { name: string; rate: number; freeOver?: number }
interface Coupon { code: string; type: string; value: number; minOrderAmount?: number }

const COUNTRIES = [
  { code: "CA", name: "Canada" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const items = useCartStore((st) => st.items);
  const subtotal = useCartStore((st) => st.subtotal());
  const clearCart = useCartStore((st) => st.clearCart);

  const [address, setAddress] = useState<Address>({
    firstName: "", lastName: "", street: "",
    city: "", province: "", country: "CA", postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [shippingRate, setShippingRate] = useState<ShippingRate | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login?callbackUrl=/checkout");
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isLoading && items.length === 0) router.push("/shop");
  }, [items, isLoading, router]);

  useEffect(() => {
    if (!address.country) return;
    fetch(`/api/shipping?country=${address.country}`)
      .then((r) => r.json())
      .then((data) => setShippingRate(data.zone ?? null))
      .catch(() => {});
  }, [address.country]);

  // ── Totals ───────────────────────────────────────────────────────────
  const discountAmount = appliedCoupon
    ? appliedCoupon.type === "PERCENTAGE" ? (subtotal * appliedCoupon.value) / 100
    : appliedCoupon.type === "FIXED" ? appliedCoupon.value : 0
    : 0;

  const freeShipping =
    appliedCoupon?.type === "FREE_SHIPPING" ||
    (shippingRate?.freeOver != null && subtotal - discountAmount >= shippingRate.freeOver);

  const shippingCost = freeShipping ? 0 : shippingRate?.rate ?? 0;
  const taxRate = address.country === "CA" ? 0.05 : 0;
  const tax = (subtotal - discountAmount + shippingCost) * taxRate;
  const total = subtotal - discountAmount + shippingCost + tax;

  const validateAddress = (): boolean => {
    const required: (keyof Address)[] = [
      "firstName", "lastName", "street", "city", "province", "country", "postalCode",
    ];
    for (const f of required) {
      if (!address[f]?.trim()) {
        toast.error(`Please fill in your ${f.replace(/([A-Z])/g, " $1").toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true); setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), orderAmount: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) { setCouponError(data.error); return; }
      setAppliedCoupon(data.coupon);
      toast.success("Coupon applied!");
    } catch { setCouponError("Failed to apply coupon"); }
    finally { setCouponLoading(false); }
  };

  // ── Create order in DB ───────────────────────────────────────────────
  const createDbOrder = async (paymentMethod: string, paymentId: string) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.product.onSale && i.product.salePrice ? i.product.salePrice : i.product.price,
        })),
        address,
        paymentMethod,
        stripeSessionId: paymentMethod === "stripe" ? paymentId : undefined,
        paypalOrderId:   paymentMethod === "paypal"  ? paymentId : undefined,
        subtotal, discountAmount, shippingCost, tax, total,
        couponCode: appliedCoupon?.code ?? null,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to create order");
    }
    return res.json();
  };

  // ── Stripe ───────────────────────────────────────────────────────────
  const handleStripeCheckout = async () => {
    if (!validateAddress()) return;
    setLoading(true);
    try {
      const stripeRes = await fetch("/api/payments/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            name: i.product.name,
            price: i.product.onSale && i.product.salePrice ? i.product.salePrice : i.product.price,
            quantity: i.quantity,
            image: i.product.images?.[0],
          })),
          shippingCost, discountAmount,
          customerEmail: user?.email,
          successUrl: `${window.location.origin}/order/confirmation?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/checkout`,
        }),
      });
      const stripeData = await stripeRes.json();
      if (!stripeRes.ok || !stripeData.url || !stripeData.sessionId) {
        toast.error(stripeData.error ?? "Failed to start Stripe checkout");
        return;
      }
      await createDbOrder("stripe", stripeData.sessionId);
      clearCart();
      window.location.href = stripeData.url;
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── PayPal ───────────────────────────────────────────────────────────
  // This function is called by the PayPal SDK — MUST return a valid order ID string
  // If it returns undefined or throws, SDK shows "Expected an order id"
  const createPayPalOrder = async (): Promise<string> => {
    if (!validateAddress()) {
      throw new Error("Please fill in your shipping address first");
    }

    const res = await fetch("/api/payments/paypal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        total: total.toFixed(2),
        currency: "CAD",
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.orderID) {
      // Log the full response to help debug
      console.error("PayPal create order response:", data);
      throw new Error(data.error ?? "PayPal order creation failed — check your PayPal credentials in .env");
    }

    console.log("PayPal order created:", data.orderID);
    return data.orderID; // ← must be a string, not undefined
  };

  const onPayPalApprove = async (data: { orderID: string }) => {
    setLoading(true);
    try {
      // 1. Capture the payment
      const captureRes = await fetch("/api/payments/paypal/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: data.orderID }),
      });
      const capture = await captureRes.json();

      if (!captureRes.ok || capture.status !== "COMPLETED") {
        toast.error(capture.error ?? "PayPal payment was not completed");
        return;
      }

      // 2. Create order in our DB
      const order = await createDbOrder("paypal", data.orderID);

      // 3. Mark as paid immediately (no webhook needed for PayPal capture)
      await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PROCESSING" }),
      }).catch(() => {});

      clearCart();
      router.push(`/order/confirmation?orderId=${order.id}`);

    } catch (err: any) {
      toast.error(err.message ?? "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onPayPalError = (err: any) => {
    console.error("PayPal SDK error:", err);
    toast.error("PayPal encountered an error. Please try again or use a card.");
  };

  if (isLoading || items.length === 0) return null;

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <div className={s.header}>
          <h1>Checkout</h1>
          <p>Complete your order securely</p>
        </div>

        <div className={s.layout}>
          {/* ── LEFT ── */}
          <div className={s.formSide}>

            {/* Address */}
            <div className={s.section}>
              <h2 className={s.sectionTitle}>
                <span className={s.sectionNum}>1</span> Shipping Address
              </h2>
              <div className={s.fieldGrid}>
                <div className={s.field}>
                  <label>First Name</label>
                  <input value={address.firstName} onChange={(e) => setAddress({ ...address, firstName: e.target.value })} placeholder="John" />
                </div>
                <div className={s.field}>
                  <label>Last Name</label>
                  <input value={address.lastName} onChange={(e) => setAddress({ ...address, lastName: e.target.value })} placeholder="Doe" />
                </div>
                <div className={`${s.field} ${s.fieldFull}`}>
                  <label>Street Address</label>
                  <input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="123 Main Street" />
                </div>
                <div className={s.field}>
                  <label>City</label>
                  <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="Calgary" />
                </div>
                <div className={s.field}>
                  <label>Province / State</label>
                  <input value={address.province} onChange={(e) => setAddress({ ...address, province: e.target.value })} placeholder="Alberta" />
                </div>
                <div className={s.field}>
                  <label>Country</label>
                  <select value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })}>
                    {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                </div>
                <div className={s.field}>
                  <label>Postal / ZIP Code</label>
                  <input value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} placeholder="T2P 1J9" />
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className={s.section}>
              <h2 className={s.sectionTitle}>
                <span className={s.sectionNum}>2</span> Discount Code
              </h2>
              <div className={s.couponRow}>
                <input className={s.couponInput} value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="ENTER CODE" disabled={!!appliedCoupon} />
                <button className={s.couponBtn} onClick={applyCoupon}
                  disabled={couponLoading || !!appliedCoupon}>
                  {couponLoading ? "..." : appliedCoupon ? "Applied ✓" : "Apply"}
                </button>
              </div>
              {appliedCoupon && (
                <p className={s.couponSuccess}>
                  ✓ {appliedCoupon.code} —{" "}
                  {appliedCoupon.type === "PERCENTAGE" ? `${appliedCoupon.value}% off`
                  : appliedCoupon.type === "FIXED" ? `CA$${appliedCoupon.value} off`
                  : "Free shipping"}
                </p>
              )}
              {couponError && <p className={s.couponError}>⚠ {couponError}</p>}
            </div>

            {/* Payment */}
            <div className={s.section}>
              <h2 className={s.sectionTitle}>
                <span className={s.sectionNum}>3</span> Payment
              </h2>

              <div className={s.paymentTabs}>
                <button className={`${s.payTab} ${paymentMethod === "stripe" ? s.payTabActive : ""}`}
                  onClick={() => setPaymentMethod("stripe")}>
                  💳 Card / Apple Pay
                </button>
                <button className={`${s.payTab} ${paymentMethod === "paypal" ? s.payTabActive : ""}`}
                  onClick={() => setPaymentMethod("paypal")}>
                  🅿️ PayPal
                </button>
              </div>

              {/* Stripe */}
              {paymentMethod === "stripe" && (
                <div className={s.stripeForm}>
                  <p className={s.cardNote}>
                    🔒 Securely redirected to Stripe. Cards, Apple Pay &amp; Google Pay accepted.
                  </p>
                  <button className={s.placeBtn} onClick={handleStripeCheckout} disabled={loading}>
                    {loading
                      ? <span className={s.placeBtnLoading}><span className={s.spinner} /> Processing...</span>
                      : `Pay CA$${total.toFixed(2)}`}
                  </button>
                </div>
              )}

              {/* PayPal */}
              {paymentMethod === "paypal" && (
                <div style={{ marginTop: 8 }}>
                  {!paypalClientId ? (
                    <div style={{ padding: "14px 16px", background: "#fff5f5", border: "1px solid #fca5a5", borderRadius: 8, fontSize: 14, color: "#dc2626", fontFamily: "system-ui" }}>
                      ⚠️ PayPal is not configured. Add <code>NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> to your .env file.
                    </div>
                  ) : (
                    <PayPalScriptProvider
                      options={{
                        clientId: paypalClientId,
                        currency: "CAD",
                        intent: "capture",
                      }}
                    >
                      <PayPalButtons
                        style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                        createOrder={createPayPalOrder}
                        onApprove={onPayPalApprove}
                        onError={onPayPalError}
                        onCancel={() => toast("PayPal payment cancelled")}
                        disabled={loading}
                      />
                    </PayPalScriptProvider>
                  )}
                </div>
              )}

              <p className={s.secureNote}>
                🔒 Secured by Stripe &amp; PayPal. We never store your card details.
              </p>
            </div>
          </div>

          {/* ── RIGHT: Summary ── */}
          <div className={s.summarySide}>
            <div className={s.summaryBox}>
              <div className={s.summaryHeader}>
                <h2>Order Summary ({items.length} item{items.length !== 1 ? "s" : ""})</h2>
              </div>
              <div className={s.summaryItems}>
                {items.map((item) => {
                  const price = item.product.onSale && item.product.salePrice
                    ? item.product.salePrice : item.product.price;
                  return (
                    <div key={item.id} className={s.summaryItem}>
                      <div className={s.itemThumb}>
                        {item.product.images?.[0] ? (
                          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#ecc07f" }}>L</div>
                        )}
                      </div>
                      <div className={s.itemInfo}>
                        <p className={s.itemName}>{item.product.name}</p>
                        <p className={s.itemQty}>Qty: {item.quantity}</p>
                      </div>
                      <span className={s.itemPrice}>CA${(price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
              <div className={s.summaryTotals}>
                <div className={s.totalRow}><span>Subtotal</span><span>CA${subtotal.toFixed(2)}</span></div>
                {discountAmount > 0 && (
                  <div className={`${s.totalRow} ${s.discountRow}`}>
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>−CA${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className={s.totalRow}>
                  <span>Shipping</span>
                  <span>
                    {freeShipping ? "FREE 🎉"
                    : shippingRate ? `CA$${shippingRate.rate.toFixed(2)}`
                    : "Select country above"}
                  </span>
                </div>
                {tax > 0 && (
                  <div className={s.totalRow}><span>GST (5%)</span><span>CA${tax.toFixed(2)}</span></div>
                )}
                <div className={s.divider} />
                <div className={s.grandTotal}>
                  <span>Total</span>
                  <span>CA${total.toFixed(2)}</span>
                </div>
                {shippingRate?.freeOver && !freeShipping && (
                  <p className={s.shippingNote}>
                    Add CA${(shippingRate.freeOver - (subtotal - discountAmount)).toFixed(2)} more for free shipping
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
