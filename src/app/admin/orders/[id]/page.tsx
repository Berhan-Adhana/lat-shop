// src/app/admin/orders/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import s from "../../admin.module.css";

const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

const STATUS_INFO: Record<string, { icon: string; color: string; desc: string }> = {
  PENDING:    { icon: "⏳", color: "#92400e", desc: "Order placed, awaiting payment confirmation" },
  PROCESSING: { icon: "📋", color: "#1e40af", desc: "Payment confirmed, preparing the order" },
  SHIPPED:    { icon: "🚚", color: "#5b21b6", desc: "Order handed to courier" },
  DELIVERED:  { icon: "✅", color: "#166534", desc: "Order delivered to customer" },
  CANCELLED:  { icon: "❌", color: "#991b1b", desc: "Order was cancelled" },
  REFUNDED:   { icon: "↩️", color: "#374151", desc: "Order was refunded" },
};

const statusColors: Record<string, string> = {
  PENDING: s.badgePending, PROCESSING: s.badgeProcessing,
  SHIPPED: s.badgeShipped, DELIVERED: s.badgeDelivered,
  CANCELLED: s.badgeCancelled, REFUNDED: s.badgeRefunded,
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [tracking, setTracking] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () =>
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        setStatus(data.status ?? "PENDING");
        setTracking(data.trackingNumber ?? "");
        setNotes(data.notes ?? "");
        setLoading(false);
      })
      .catch(() => setLoading(false));

  useEffect(() => { load(); }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          trackingNumber: tracking.trim() || null,
          notes: notes.trim() || null,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Order updated!");
      load();
    } catch {
      toast.error("Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40, color: "#7a3f1d" }}>Loading order...</div>;
  if (!order || order.error) return <div style={{ padding: 40, color: "#dc2626" }}>Order not found.</div>;

  const statusIndex = STATUSES.indexOf(order.status);

  return (
    <div>
      {/* Header */}
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Order #{order.id.slice(-8).toUpperCase()}</h1>
          <p className={s.pageSubtitle}>
            Placed {new Date(order.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            {" · "}{order.paymentMethod?.toUpperCase()}
            {" · "}<span className={`${s.badge} ${order.paymentStatus === "PAID" ? s.badgePaid : s.badgeUnpaid}`}>{order.paymentStatus}</span>
          </p>
        </div>
        <Link href="/admin/orders" className={s.btnSecondary}>← Back to Orders</Link>
      </div>

      {/* Status timeline */}
      <div className={s.formCard} style={{ marginBottom: 20 }}>
        <h3 className={s.formCardTitle}>Order Status Timeline</h3>
        <div style={{ display: "flex", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
          {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"].map((st, i) => {
            const info = STATUS_INFO[st];
            const done = statusIndex >= i;
            const current = order.status === st;
            return (
              <div key={st} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 120 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: done ? (current ? "#d4832a" : "#22c55e") : "#f4dbb0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, border: current ? "3px solid #b86820" : "2px solid transparent",
                    transition: "all 0.2s",
                  }}>
                    {info.icon}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: done ? "#1a1209" : "#b0947a", marginTop: 6, textAlign: "center", fontFamily: "system-ui" }}>
                    {st}
                  </div>
                </div>
                {i < 3 && (
                  <div style={{ height: 3, flex: 1, background: statusIndex > i ? "#22c55e" : "#f4dbb0", borderRadius: 2, margin: "0 4px", marginBottom: 20 }} />
                )}
              </div>
            );
          })}
        </div>
        {order.status === "CANCELLED" && (
          <div style={{ marginTop: 8, padding: "10px 14px", background: "#fee2e2", borderRadius: 8, fontSize: 13, color: "#991b1b", fontFamily: "system-ui" }}>
            ❌ This order was cancelled
          </div>
        )}
        {order.status === "REFUNDED" && (
          <div style={{ marginTop: 8, padding: "10px 14px", background: "#f3f4f6", borderRadius: 8, fontSize: 13, color: "#374151", fontFamily: "system-ui" }}>
            ↩️ This order was refunded
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>

        {/* ── Left ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Items */}
          <div className={s.formCard}>
            <h3 className={s.formCardTitle}>Order Items</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {order.items?.map((item: any) => (
                <div key={item.id} style={{ display: "flex", gap: 14, alignItems: "center", paddingBottom: 14, borderBottom: "1px solid #faefd9" }}>
                  <div style={{ width: 60, height: 60, borderRadius: 8, background: "#faefd9", overflow: "hidden", position: "relative", flexShrink: 0, border: "1px solid #f4dbb0" }}>
                    {item.product?.images?.[0] ? (
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#ecc07f" }}>L</div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: "#1a1209", marginBottom: 2 }}>{item.product?.name}</p>
                    <p style={{ fontSize: 12, color: "#7a3f1d" }}>Qty: {item.quantity} × CA${item.price.toFixed(2)}</p>
                  </div>
                  <p style={{ fontWeight: 700, color: "#d4832a", fontFamily: "Georgia, serif", fontSize: 16 }}>
                    CA${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f4dbb0", display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Subtotal", value: `CA$${order.subtotal?.toFixed(2)}` },
                order.discountAmount > 0 ? { label: `Discount (${order.couponCode ?? ""})`, value: `-CA$${order.discountAmount?.toFixed(2)}`, green: true } : null,
                { label: "Shipping", value: `CA$${order.shippingCost?.toFixed(2)}` },
                order.tax > 0 ? { label: "GST (5%)", value: `CA$${order.tax?.toFixed(2)}` } : null,
              ].filter(Boolean).map((row: any) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: row.green ? "#22c55e" : "#3d2b14" }}>
                  <span>{row.label}</span><span>{row.value}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 700, paddingTop: 10, borderTop: "1px solid #f4dbb0", marginTop: 4 }}>
                <span style={{ color: "#1a1209" }}>Total</span>
                <span style={{ color: "#d4832a", fontFamily: "Georgia, serif" }}>CA${order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className={s.formCard}>
            <h3 className={s.formCardTitle}>Shipping Address</h3>
            {order.address ? (
              <div style={{ fontSize: 14, color: "#3d2b14", lineHeight: 2 }}>
                <p style={{ fontWeight: 600, fontSize: 15 }}>{order.address.firstName} {order.address.lastName}</p>
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.province} {order.address.postalCode}</p>
                <p>{order.address.country}</p>
              </div>
            ) : <p style={{ color: "#7a3f1d", fontSize: 14 }}>No address on file</p>}
          </div>
        </div>

        {/* ── Right ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Customer */}
          <div className={s.formCard}>
            <h3 className={s.formCardTitle}>Customer</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#d4832a,#b86820)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 600 }}>
                {order.user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: "#1a1209" }}>{order.user?.name}</p>
                <p style={{ fontSize: 12, color: "#7a3f1d" }}>{order.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Update order */}
          <div className={s.formCard}>
            <h3 className={s.formCardTitle}>Update Order</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Status */}
              <div className={s.field}>
                <label>Order Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {STATUS_INFO[st].icon} {st}
                    </option>
                  ))}
                </select>
                {STATUS_INFO[status] && (
                  <span style={{ fontSize: 12, color: "#7a3f1d", marginTop: 2, fontFamily: "system-ui" }}>
                    {STATUS_INFO[status].desc}
                  </span>
                )}
              </div>

              {/* Tracking number — only relevant when shipped */}
              <div className={s.field}>
                <label>Tracking Number</label>
                <input
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  placeholder="e.g. CP123456789CA"
                />
                {tracking && (
                  <a
                    href={`https://www.canadapost-postescanada.ca/track-reperer/alternate?execution=e1s1&lang=en&totalSearch=true&searchFor=${tracking}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 12, color: "#d4832a", textDecoration: "none", marginTop: 4, display: "inline-block" }}
                  >
                    🔗 Track on Canada Post →
                  </a>
                )}
              </div>

              {/* Internal notes */}
              <div className={s.field}>
                <label>Internal Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes visible only to you..."
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </div>

              <button
                className={s.btnPrimary}
                onClick={handleSave}
                disabled={saving}
                style={{ justifyContent: "center" }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              {/* Quick actions */}
              <div style={{ paddingTop: 12, borderTop: "1px solid #f4dbb0" }}>
                <p style={{ fontSize: 12, color: "#7a3f1d", marginBottom: 10, fontFamily: "system-ui", fontWeight: 600 }}>QUICK ACTIONS</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    { label: "✅ Mark as Delivered", status: "DELIVERED" },
                    { label: "🚚 Mark as Shipped", status: "SHIPPED" },
                    { label: "❌ Cancel Order", status: "CANCELLED" },
                  ].map((action) => (
                    <button
                      key={action.status}
                      className={`${s.btnSecondary} ${s.btnSm}`}
                      style={{ justifyContent: "flex-start", width: "100%" }}
                      onClick={() => setStatus(action.status)}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tracking info box */}
          {order.trackingNumber && (
            <div style={{ background: "#faefd9", border: "1px solid #ecc07f", borderRadius: 10, padding: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1209", marginBottom: 4, fontFamily: "system-ui" }}>Current Tracking</p>
              <p style={{ fontFamily: "monospace", fontSize: 15, color: "#d4832a", letterSpacing: 1 }}>{order.trackingNumber}</p>
              <a
                href={`https://www.canadapost-postescanada.ca/track-reperer/alternate?execution=e1s1&lang=en&totalSearch=true&searchFor=${order.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, color: "#b86820", display: "inline-block", marginTop: 6 }}
              >
                Track on Canada Post →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
