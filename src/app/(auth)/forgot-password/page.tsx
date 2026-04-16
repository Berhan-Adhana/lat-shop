// src/app/(auth)/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import s from "../auth.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fdf8f0", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "Georgia, serif", flexDirection: "column", gap: 24 }}>
      <Logo variant="horizontal" dark size="md" href="/" />

      <div className={s.card}>
        {submitted ? (
          <div className={s.success}>
            <div className={s.successIcon}>✉️</div>
            <h2>Check your inbox</h2>
            <p>
              If an account exists for <strong>{email}</strong>, a password
              reset link has been sent. It expires in 1 hour.
            </p>
            <Link href="/login" className={s.backBtn}>Back to Sign In</Link>
          </div>
        ) : (
          <>
            {/* Small logo mark */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <Logo variant="icon" dark size="sm" href="/" />
            </div>
            <h1>Forgot password?</h1>
            <p className={s.subtitle}>
              Enter your email and we&apos;ll send you a reset link.
            </p>

            {error && <div className={s.error}>{error}</div>}

            <form onSubmit={handleSubmit} className={s.form}>
              <div className={s.field}>
                <label htmlFor="email">Email Address</label>
                <input id="email" type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" />
              </div>
              <button type="submit" className={s.btn} disabled={loading}>
                {loading ? <><span className={s.spinner} /> Sending...</> : "Send Reset Link"}
              </button>
            </form>

            <Link href="/login" className={s.backLink}>← Back to Sign In</Link>
          </>
        )}
      </div>
    </div>
  );
}
