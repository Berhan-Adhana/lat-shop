// src/app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import s from "../auth.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); setLoading(false); return; }
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      router.push("/"); router.refresh();
    } catch { setError("Something went wrong. Please try again."); setLoading(false); }
  };

  const getStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 8) return { label: "Too short", color: "#ef4444", width: "10%" };
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: "Weak", color: "#f97316", width: "33%" };
    if (p.length >= 12) return { label: "Strong", color: "#22c55e", width: "100%" };
    return { label: "Good", color: "#eab308", width: "66%" };
  };
  const strength = getStrength();

  return (
    <div className={s.root}>
      {/* ── Left panel ── */}
      <div className={s.panel}>
        <div className={s.panelPattern}><div className={s.glow} /></div>
        <div className={s.panelInner}>
          <Logo variant="stacked" light size="md" href="/" />
          <div className={s.panelDivider}>
            <div className={s.panelLine} />
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
              <ellipse cx="7" cy="10" rx="5.5" ry="8.5" stroke="#d4832a" strokeWidth="1"/>
              <path d="M7 2 Q10 6 10 10 Q10 14 7 18 Q4 14 4 10 Q4 6 7 2Z" fill="#d4832a" opacity="0.4"/>
              <path d="M3 15.5 L5 17.5 L7 16.5 L9 17.5 L11 15.5" stroke="#d4832a" strokeWidth="1" fill="none" strokeLinecap="round"/>
            </svg>
            <div className={s.panelLine} />
          </div>
          <div className={s.perks}>
            {[
              { icon: "✓", text: "Free shipping over CA$100" },
              { icon: "✓", text: "10% off your first order" },
              { icon: "✓", text: "Order tracking & history" },
              { icon: "✓", text: "Save items to wishlist" },
            ].map((p) => (
              <div key={p.text} className={s.perk}>
                <span className={s.perkDot}>{p.icon}</span>
                {p.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form ── */}
      <div className={s.formSide}>
        <div className={s.formBox}>
          <div className={s.mobileLogo}>
            <Logo variant="horizontal" dark size="md" href="/" />
          </div>

          <div className={s.formHeader}>
            <h2>Create account</h2>
            <p>Join Lat Shop and start discovering African gifts</p>
          </div>

          {error && <div className={s.error} role="alert"><span>⚠</span> {error}</div>}

          <form onSubmit={handleSubmit} className={s.form}>
            <div className={s.field}>
              <label htmlFor="name">Full Name</label>
              <input id="name" type="text" autoComplete="name" required
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name" />
            </div>
            <div className={s.field}>
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" autoComplete="email" required
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com" />
            </div>
            <div className={s.field}>
              <label htmlFor="password">Password</label>
              <input id="password" type="password" autoComplete="new-password" required
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 8 characters" />
              {strength && (
                <div className={s.strengthRow}>
                  <div className={s.strengthBar} style={{ background: strength.color, width: strength.width }} />
                  <span className={s.strengthLabel} style={{ color: strength.color }}>{strength.label}</span>
                </div>
              )}
              <span className={s.fieldHint}>Min. 8 chars, one uppercase letter, one number</span>
            </div>
            <div className={s.field}>
              <label htmlFor="confirm">Confirm Password</label>
              <input id="confirm" type="password" autoComplete="new-password" required
                value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Repeat your password" />
            </div>

            <button type="submit" className={s.btn} disabled={loading}>
              {loading ? <><span className={s.spinner} /> Creating account...</> : "Create Account"}
            </button>

            <p className={s.terms}>
              By signing up you agree to our{" "}
              <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>
            </p>
          </form>

          <p className={s.switch}>
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
