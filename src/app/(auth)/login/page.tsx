// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import s from "../auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    setLoading(false);
    if (result?.error) { setError(result.error); return; }
    router.push(callbackUrl); router.refresh();
  };

  return (
    <div className={s.root}>
      {/* ── Left panel ── */}
      <div className={s.panel}>
        <div className={s.panelPattern}><div className={s.glow} /></div>
        <div className={s.panelInner}>
          <Logo variant="stacked" light size="md" href="/" />
          <p className={s.panelTagline}>
            African gifts, jewelry &amp; accessories — shipped from Calgary
          </p>
          {/* Small cowrie divider */}
          <div className={s.panelDivider}>
            <div className={s.panelLine} />
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
              <ellipse cx="7" cy="10" rx="5.5" ry="8.5" stroke="#d4832a" strokeWidth="1"/>
              <path d="M7 2 Q10 6 10 10 Q10 14 7 18 Q4 14 4 10 Q4 6 7 2Z" fill="#d4832a" opacity="0.4"/>
              <path d="M3 15.5 L5 17.5 L7 16.5 L9 17.5 L11 15.5" stroke="#d4832a" strokeWidth="1" fill="none" strokeLinecap="round"/>
            </svg>
            <div className={s.panelLine} />
          </div>
          <p style={{ fontSize: 12, color: "rgba(253,248,240,0.5)", fontFamily: "system-ui", letterSpacing: "2px", textTransform: "uppercase" }}>
            Calgary, Canada
          </p>
        </div>
      </div>

      {/* ── Right form ── */}
      <div className={s.formSide}>
        <div className={s.formBox}>
          {/* Mobile logo */}
          <div className={s.mobileLogo}>
            <Logo variant="horizontal" dark size="md" href="/" />
          </div>

          <div className={s.formHeader}>
            <h2>Welcome back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          {error && (
            <div className={s.error} role="alert">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={s.form}>
            <div className={s.field}>
              <label htmlFor="email">Email address</label>
              <input id="email" type="email" autoComplete="email" required
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com" />
            </div>

            <div className={s.field}>
              <div className={s.labelRow}>
                <label htmlFor="password">Password</label>
                <Link href="/forgot-password" className={s.forgotLink}>Forgot password?</Link>
              </div>
              <input id="password" type="password" autoComplete="current-password" required
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" />
            </div>

            <button type="submit" className={s.btn} disabled={loading}>
              {loading ? <><span className={s.spinner} /> Signing in...</> : "Sign In"}
            </button>
          </form>

          <p className={s.switch}>
            Don&apos;t have an account? <Link href="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
