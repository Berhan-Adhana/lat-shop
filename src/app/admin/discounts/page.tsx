// src/app/admin/discounts/page.tsx
"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import s from "../admin.module.css";

interface Coupon {
  id: string; code: string; type: string; value: number;
  minOrderAmount: number | null; maxUses: number | null;
  usedCount: number; isActive: boolean; expiresAt: string | null;
}

const defaultForm = { code: "", type: "PERCENTAGE", value: "", minOrderAmount: "", maxUses: "", onePerCustomer: true, isActive: true, expiresAt: "" };

export default function AdminDiscountsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/coupons").then((r) => r.json()).then((data) => { setCoupons(data); setLoading(false); });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, value: Number(form.value), minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null, maxUses: form.maxUses ? Number(form.maxUses) : null }),
      });
      if (!res.ok) throw new Error();
      const coupon = await res.json();
      setCoupons([coupon, ...coupons]);
      setForm(defaultForm);
      setShowForm(false);
      toast.success("Coupon created!");
    } catch {
      toast.error("Failed to create coupon");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      setCoupons(coupons.map((c) => c.id === coupon.id ? { ...c, isActive: !c.isActive } : c));
    } catch {
      toast.error("Failed to update coupon");
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      setCoupons(coupons.filter((c) => c.id !== id));
      toast.success("Coupon deleted");
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Discounts & Coupons</h1>
          <p className={s.pageSubtitle}>{coupons.length} coupons</p>
        </div>
        <button className={s.btnPrimary} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New Coupon"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className={s.formCard} style={{ marginBottom: 24 }}>
          <h3 className={s.formCardTitle}>Create Coupon</h3>
          <form onSubmit={handleCreate}>
            <div className={s.fieldGrid}>
              <div className={s.field}>
                <label>Code *</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="WELCOME10" required style={{ textTransform: "uppercase", letterSpacing: 1 }} />
              </div>
              <div className={s.field}>
                <label>Type *</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount (CA$)</option>
                  <option value="FREE_SHIPPING">Free Shipping</option>
                </select>
              </div>
              {form.type !== "FREE_SHIPPING" && (
                <div className={s.field}>
                  <label>Value * {form.type === "PERCENTAGE" ? "(%)" : "(CA$)"}</label>
                  <input type="number" min="0" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder={form.type === "PERCENTAGE" ? "10" : "5"} required />
                </div>
              )}
              <div className={s.field}>
                <label>Min Order Amount (CA$)</label>
                <input type="number" min="0" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} placeholder="Optional" />
              </div>
              <div className={s.field}>
                <label>Max Uses</label>
                <input type="number" min="1" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder="Unlimited" />
              </div>
              <div className={s.field}>
                <label>Expires At</label>
                <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <button type="submit" className={s.btnPrimary} disabled={saving}>{saving ? "Creating..." : "Create Coupon"}</button>
              <button type="button" className={s.btnSecondary} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons table */}
      <div className={s.tableWrap}>
        <div className={s.tableHeader}><span className={s.tableTitle}>All Coupons</span></div>
        {loading ? (
          <div className={s.emptyState}><p>Loading...</p></div>
        ) : coupons.length === 0 ? (
          <div className={s.emptyState}><p>No coupons yet.</p></div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={s.table}>
              <thead>
                <tr><th>Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Uses</th><th>Expires</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td style={{ fontFamily: "monospace", fontWeight: 700, color: "#d4832a", letterSpacing: 1 }}>{coupon.code}</td>
                    <td>{coupon.type}</td>
                    <td>{coupon.type === "PERCENTAGE" ? `${coupon.value}%` : coupon.type === "FIXED" ? `CA$${coupon.value}` : "Free Shipping"}</td>
                    <td>{coupon.minOrderAmount ? `CA$${coupon.minOrderAmount}` : "—"}</td>
                    <td>{coupon.usedCount}{coupon.maxUses ? ` / ${coupon.maxUses}` : ""}</td>
                    <td style={{ fontSize: 12 }}>{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Never"}</td>
                    <td>
                      <span className={`${s.badge} ${coupon.isActive ? s.badgeActive : s.badgeInactive}`}>
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className={s.actions}>
                        <button className={`${s.btnSecondary} ${s.btnSm}`} onClick={() => toggleActive(coupon)}>
                          {coupon.isActive ? "Disable" : "Enable"}
                        </button>
                        <button className={`${s.btnDanger} ${s.btnSm}`} onClick={() => deleteCoupon(coupon.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
