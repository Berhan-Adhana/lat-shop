// src/app/(info)/faq/page.tsx
"use client";

import { useState } from "react";
import s from "../info.module.css";

const faqs = [
  {
    category: "Orders & Shipping",
    items: [
      { q: "Where do you ship from?", a: "We ship all orders from Calgary, Alberta, Canada." },
      { q: "How long does shipping take?", a: "Canada: 3–7 business days. United States: 7–14 business days. Europe: 10–21 business days. These are estimates and may vary depending on your location and customs." },
      { q: "Do you offer free shipping?", a: "Yes! Free shipping on orders over CA$100 within Canada, CA$150 to the US, and CA$200 to Europe." },
      { q: "Can I track my order?", a: "Yes. Once your order ships, you'll receive an email with your tracking number. You can also view it in your account under My Orders." },
      { q: "Do you ship to my country?", a: "We currently ship to Canada, the United States, and most of Europe. If your country isn't listed at checkout, contact us and we'll do our best to help." },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      { q: "What is your return policy?", a: "We accept returns within 30 days of delivery. Items must be unused and in original condition. Visit our Returns page for instructions." },
      { q: "How do I start a return?", a: "Email us at hello@latshop.com with your order number and reason for return. We'll guide you through the process." },
      { q: "How long do refunds take?", a: "Once we receive your return, refunds are processed within 3–5 business days. It may take an additional 5–10 days to appear on your statement." },
      { q: "Are sale items returnable?", a: "Items purchased at full price are fully returnable. Sale items are final sale unless they arrive damaged or defective." },
    ],
  },
  {
    category: "Products & Payments",
    items: [
      { q: "Are your products handmade?", a: "Many of our products are handcrafted by artisans. Product descriptions specify when an item is handmade." },
      { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, and Google Pay." },
      { q: "Is my payment information secure?", a: "Absolutely. All payments are processed by Stripe or PayPal — we never store your card details on our servers." },
      { q: "Do you offer gift wrapping?", a: "All orders are shipped in beautiful packaging suitable for gifting. We also include a printed thank-you card with every order." },
      { q: "Can I use a discount code?", a: "Yes! Enter your code at checkout. New customers can use WELCOME10 for 10% off their first order." },
    ],
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className={s.page}>
      <div className={s.hero}>
        <h1>Frequently Asked Questions</h1>
        <p>Quick answers to the most common questions</p>
      </div>

      <div className={s.inner}>
        {faqs.map((group) => (
          <div key={group.category} className={s.section}>
            <h2>{group.category}</h2>
            {group.items.map((faq) => {
              const id = `${group.category}-${faq.q}`;
              const isOpen = open === id;
              return (
                <div key={faq.q} className={s.faqItem}>
                  <button
                    className={s.faqQuestion}
                    onClick={() => setOpen(isOpen ? null : id)}
                  >
                    <span>{faq.q}</span>
                    <span style={{ fontSize: 18, color: "#d4832a", flexShrink: 0 }}>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && <div className={s.faqAnswer}>{faq.a}</div>}
                </div>
              );
            })}
          </div>
        ))}

        <div className={s.highlight}>
          <strong>Still have a question?</strong> We&apos;re happy to help.{" "}
          <a href="/contact" className={s.link}>Contact us</a> and we&apos;ll get back to you within 24 hours.
        </div>
      </div>
    </div>
  );
}
