// src/app/(auth)/reset-password/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import s from "../auth.module.css";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // If no token in URL — invalid link
  const isInvalidLink = !token || !email;

  const getStrength = () => {
    if (!password) return null;
    if (password.length < 8)                          return { label: "Too short", color: "#ef4444", width: "10%" };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: "Weak",     color: "#f97316", width: "33%" };
    if (password.length >= 12)                        return { label: "Strong",   color: "#22c55e", width: "100%" };
    return { label: "Good", color: "#eab308", width: "66%" };
  };
  const strength = getStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to reset password");
        return;
      }

      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => router.push("/login"), 3000);

    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Invalid link ─────────────────────────────────────────────────────
  if (isInvalidLink) {
    return (
      <div style={{
        minHeight: "100vh", background: "#fdf8f0",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 24px", flexDirection: "column", gap: 24,
      }}>
        <Logo variant="horizontal" dark size="md" href="/" />
        <div className={s.card} style={{ textAlign: "center" }}>
          <div className={s.successIcon} style={{ background: "#fee2e2", borderColor: "#fca5a5" }}>
            ⚠️
          </div>
          <h1 style={{ fontSize: 22, fontFamily: "Georgia, serif", fontWeight: 400, color: "#1a1209", margin: "16px 0 8px" }}>
            Invalid Reset Link
          </h1>
          <p style={{ fontSize: 14, color: "#7a3f1d", fontFamily: "system-ui", lineHeight: 1.6, marginBottom: 24 }}>
            This password reset link is invalid or has already been used.
            Please request a new one.
          </p>
          <Link href="/forgot-password" className={s.btn} style={{ display: "inline-flex", textDecoration: "none", justifyContent: "center" }}>
            Request New Link
          </Link>
          <Link href="/login" className={s.backLink}>← Back to Sign In</Link>
        </div>
      </div>
    );
  }

  // ── Success state ─────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={{
        minHeight: "100vh", background: "#fdf8f0",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 24px", flexDirection: "column", gap: 24,
      }}>
        <Logo variant="horizontal" dark size="md" href="/" />
        <div className={s.card}>
          <div className={s.success}>
            <div className={s.successIcon}>✅</div>
            <h2>Password Updated!</h2>
            <p>
              Your password has been reset successfully.
              You&apos;ll be redirected to sign in shortly.
            </p>
            <Link href="/login" className={s.backBtn}>Sign In Now</Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Reset form ────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "#fdf8f0",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 24px", flexDirection: "column", gap: 24,
      fontFamily: "Georgia, serif",
    }}>
      <Logo variant="horizontal" dark size="md" href="/" />

      <div className={s.card}>
        {/* Small cowrie icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <Logo variant="icon" dark size="sm" href="/" />
        </div>

        <h1>Choose a new password</h1>
        <p className={s.subtitle}>
          Resetting password for <strong style={{ color: "#d4832a" }}>{email}</strong>
        </p>

        {error && (
          <div className={s.error} role="alert">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={s.form}>
          <div className={s.field}>
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
            />
            {strength && (
              <div className={s.strengthRow}>
                <div className={s.strengthBar} style={{ background: strength.color, width: strength.width }} />
                <span className={s.strengthLabel} style={{ color: strength.color }}>{strength.label}</span>
              </div>
            )}
            <span className={s.fieldHint}>Min. 8 chars, one uppercase, one number</span>
          </div>

          <div className={s.field}>
            <label htmlFor="confirm">Confirm New Password</label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your new password"
              style={{
                borderColor: confirm && confirm !== password ? "#fca5a5" : undefined,
              }}
            />
            {confirm && confirm !== password && (
              <span style={{ fontSize: 12, color: "#dc2626", fontFamily: "system-ui" }}>
                Passwords do not match
              </span>
            )}
          </div>

          <button
            type="submit"
            className={s.btn}
            disabled={loading || password !== confirm || password.length < 8}
          >
            {loading
              ? <><span className={s.spinner} /> Updating...</>
              : "Set New Password"}
          </button>
        </form>

        <Link href="/login" className={s.backLink}>← Back to Sign In</Link>
      </div>
    </div>
  );
}

// Wrap in Suspense because useSearchParams() requires it in Next.js 14
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#fdf8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #f4dbb0", borderTopColor: "#d4832a", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
