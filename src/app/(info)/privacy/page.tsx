// src/app/(info)/privacy/page.tsx
import s from "../info.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy | Lat Shop" };

export default function PrivacyPage() {
  return (
    <div className={s.page}>
      <div className={s.hero}>
        <h1>Privacy Policy</h1>
        <p>How we collect, use, and protect your information</p>
      </div>

      <div className={s.inner}>
        <p style={{ fontSize: 13, color: "#b86820", marginBottom: 32 }}>
          Last updated: January 2025
        </p>

        {[
          {
            title: "Information We Collect",
            content: `When you create an account or place an order, we collect your name, email address, shipping address, and phone number. We do not store payment information — all payment processing is handled securely by Stripe and PayPal.

We also collect basic usage data (pages visited, items viewed) to improve your shopping experience. This data is never sold to third parties.`,
          },
          {
            title: "How We Use Your Information",
            content: `We use your information to:
• Process and fulfil your orders
• Send order confirmation and shipping notifications
• Respond to your customer service requests
• Send marketing emails (only if you opt in — you can unsubscribe any time)
• Improve our website and product selection`,
          },
          {
            title: "Sharing Your Information",
            content: `We only share your information with:
• Shipping carriers (Canada Post, UPS, FedEx) to deliver your order
• Payment processors (Stripe, PayPal) to process payments
• Service providers who help us operate our website

We never sell your personal information to anyone.`,
          },
          {
            title: "Cookies",
            content: `We use cookies to keep you logged in, remember your cart, and understand how visitors use our site. You can disable cookies in your browser settings, though some features may not work correctly.`,
          },
          {
            title: "Your Rights",
            content: `You have the right to access, update, or delete your personal information at any time. Log into your account to update your profile, or contact us at hello@latshop.com to request data deletion.`,
          },
          {
            title: "Data Security",
            content: `We use industry-standard security measures to protect your data. All data is transmitted over HTTPS. Passwords are hashed and never stored in plain text. We regularly review our security practices.`,
          },
          {
            title: "Contact Us",
            content: `Questions about this policy? Email us at hello@latshop.com or use our Contact page. We're based in Calgary, Alberta, Canada.`,
          },
        ].map((section) => (
          <div key={section.title} className={s.section}>
            <h2>{section.title}</h2>
            {section.content.split("\n").map((line, i) =>
              line.startsWith("•") ? (
                <p key={i} style={{ fontSize: 15, color: "#3d2b14", lineHeight: 1.8, paddingLeft: 16 }}>
                  {line}
                </p>
              ) : line ? (
                <p key={i}>{line}</p>
              ) : null
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
