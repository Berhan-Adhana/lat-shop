// src/app/(account)/account/page.tsx
"use client";

import AccountNav from "@/components/account/AccountNav";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import s from "./account.module.css";

export default function AccountPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated)
      router.push("/login?callbackUrl=/account");
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user)
      setForm({ name: user.name ?? "", email: user.email ?? "", phone: "" });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone }),
      });
      if (!res.ok) throw new Error();
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className={s.page}>
        <div className={s.loading}>
          <div className={s.spinner} />
        </div>
      </div>
    );

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <div className={s.header}>
          <h1>My Account</h1>
          <p>Manage your profile and preferences</p>
        </div>

        <AccountNav />

        <div className={s.layout}>
          <div className={s.sidebar} />{" "}
          {/* spacer — sidebar is inside AccountNav */}
          <div className={s.main}>
            <div className={s.card}>
              <h2 className={s.cardTitle}>Profile Information</h2>
              <div className={s.fieldGrid}>
                <div className={s.field}>
                  <label>Full Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div className={s.field}>
                  <label>Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="+1 (403) 000-0000"
                  />
                </div>
                <div className={`${s.field} ${s.fieldFull}`}>
                  <label>Email Address</label>
                  <input value={form.email} disabled />
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <button
                  className={s.btnPrimary}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            <div className={s.card}>
              <h2 className={s.cardTitle}>Security</h2>
              <p
                style={{
                  fontSize: 14,
                  color: "#7a3f1d",
                  marginBottom: 14,
                  lineHeight: 1.5,
                }}
              >
                Change your password to keep your account secure.
              </p>
              <a href="/forgot-password" className={s.btnSecondary}>
                Change Password
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
