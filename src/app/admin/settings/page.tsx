// src/app/admin/settings/page.tsx
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import s from "../admin.module.css";

export default function AdminSettingsPage() {
  const [store, setStore] = useState({
    name: "Lat Shop",
    email: "",
    phone: "",
    address: "Calgary, Alberta, Canada",
    currency: "CAD",
    taxRate: "5",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // In a real app you'd save to DB
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Settings saved!");
    setSaving(false);
  };

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Settings</h1>
          <p className={s.pageSubtitle}>Manage your store configuration</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 640 }}>

        {/* Store Info */}
        <div className={s.formCard}>
          <h3 className={s.formCardTitle}>Store Information</h3>
          <div className={s.fieldGrid}>
            <div className={s.field}>
              <label>Store Name</label>
              <input value={store.name} onChange={(e) => setStore({ ...store, name: e.target.value })} />
            </div>
            <div className={s.field}>
              <label>Contact Email</label>
              <input type="email" value={store.email} onChange={(e) => setStore({ ...store, email: e.target.value })} placeholder="hello@latshop.com" />
            </div>
            <div className={s.field}>
              <label>Phone</label>
              <input value={store.phone} onChange={(e) => setStore({ ...store, phone: e.target.value })} placeholder="+1 (403) 000-0000" />
            </div>
            <div className={s.field}>
              <label>Location</label>
              <input value={store.address} onChange={(e) => setStore({ ...store, address: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Tax & Currency */}
        <div className={s.formCard}>
          <h3 className={s.formCardTitle}>Tax & Currency</h3>
          <div className={s.fieldGrid}>
            <div className={s.field}>
              <label>Currency</label>
              <select value={store.currency} onChange={(e) => setStore({ ...store, currency: e.target.value })}>
                <option value="CAD">CAD — Canadian Dollar</option>
                <option value="USD">USD — US Dollar</option>
              </select>
            </div>
            <div className={s.field}>
              <label>GST Rate (%)</label>
              <input type="number" value={store.taxRate} onChange={(e) => setStore({ ...store, taxRate: e.target.value })} />
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#b86820", marginTop: 12, fontFamily: "system-ui" }}>
            GST is automatically applied to Canadian orders at checkout.
          </p>
        </div>

        {/* Env variables reminder */}
        <div className={s.formCard}>
          <h3 className={s.formCardTitle}>Environment Variables</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { key: "STRIPE_SECRET_KEY", label: "Stripe Secret Key", ok: true },
              { key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", label: "Stripe Publishable Key", ok: true },
              { key: "STRIPE_WEBHOOK_SECRET", label: "Stripe Webhook Secret", ok: true },
              { key: "PAYPAL_CLIENT_ID", label: "PayPal Client ID", ok: true },
              { key: "CLOUDINARY_CLOUD_NAME", label: "Cloudinary Cloud Name", ok: true },
              { key: "DATABASE_URL", label: "Database URL", ok: true },
              { key: "NEXTAUTH_SECRET", label: "NextAuth Secret", ok: true },
            ].map((env) => (
              <div key={env.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#fdf8f0", borderRadius: 8, border: "1px solid #f4dbb0" }}>
                <span style={{ fontSize: 16 }}>{env.ok ? "✅" : "❌"}</span>
                <div>
                  <p style={{ fontSize: 13, fontFamily: "monospace", color: "#1a1209", fontWeight: 600 }}>{env.key}</p>
                  <p style={{ fontSize: 12, color: "#7a3f1d", fontFamily: "system-ui" }}>{env.label}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#b86820", marginTop: 12, fontFamily: "system-ui" }}>
            Set these in your <code>.env.local</code> file or in your Vercel dashboard.
          </p>
        </div>

        <button className={s.btnPrimary} onClick={handleSave} disabled={saving} style={{ alignSelf: "flex-start", padding: "12px 28px" }}>
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
