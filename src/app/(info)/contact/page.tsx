// src/app/(info)/contact/page.tsx
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { Metadata } from "next";
import s from "../info.module.css";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // In production, wire this to an email API or contact form service
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setSending(false);
    toast.success("Message sent! We'll reply within 24 hours.");
  };

  return (
    <div className={s.page}>
      <div className={s.hero}>
        <h1>Contact Us</h1>
        <p>We&apos;d love to hear from you — questions, orders, or just to say hello</p>
      </div>

      <div className={s.innerWide}>
        <div className={s.contactGrid}>

          {/* Form */}
          <div className={s.formCard}>
            <h2>Send a Message</h2>
            {sent ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
                <p style={{ fontSize: 16, color: "#1a1209", fontFamily: "Georgia, serif", marginBottom: 8 }}>
                  Message sent!
                </p>
                <p style={{ fontSize: 14, color: "#7a3f1d" }}>
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={s.field}>
                  <label>Your Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required />
                </div>
                <div className={s.field}>
                  <label>Email Address</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" required />
                </div>
                <div className={s.field}>
                  <label>Subject</label>
                  <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required>
                    <option value="">Select a topic</option>
                    <option value="order">Order Question</option>
                    <option value="shipping">Shipping & Delivery</option>
                    <option value="return">Returns & Refunds</option>
                    <option value="product">Product Question</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className={s.field}>
                  <label>Message</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" required />
                </div>
                <button type="submit" className={s.submitBtn} disabled={sending}>
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div>
            <div className={s.infoBox}>
              <h2>Get in Touch</h2>
              {[
                { icon: "📍", title: "Location", text: "Calgary, Alberta, Canada" },
                { icon: "📧", title: "Email", text: "hello@latshop.com" },
                { icon: "⏰", title: "Response Time", text: "We reply within 24 hours\nMonday – Friday" },
                { icon: "📦", title: "Order Support", text: "For order issues include your order number starting with #" },
              ].map((item) => (
                <div key={item.title} className={s.infoItem}>
                  <span className={s.infoItemIcon}>{item.icon}</span>
                  <div className={s.infoItemText}>
                    <strong>{item.title}</strong>
                    <span style={{ whiteSpace: "pre-line" }}>{item.text}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={s.highlight} style={{ marginTop: 16 }}>
              <strong>Quick answers?</strong> Check our{" "}
              <a href="/faq" className={s.link}>FAQ page</a> — most common questions are answered there.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
