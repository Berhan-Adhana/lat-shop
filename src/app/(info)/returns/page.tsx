// src/app/(info)/returns/page.tsx
import s from "../info.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Returns & Refunds | Lat Shop" };

export default function ReturnsPage() {
  return (
    <div className={s.page}>
      <div className={s.hero}>
        <h1>Returns & Refunds</h1>
        <p>We want you to love your purchase — here&apos;s our simple return policy</p>
      </div>

      <div className={s.inner}>
        <div className={s.highlight}>
          <strong>30-Day Return Window.</strong> We accept returns within 30 days of delivery.
          Items must be unused, in original condition, and in original packaging where possible.
        </div>

        <div className={s.section}>
          <h2>How to Return an Item</h2>
          <ul>
            <li><strong>Step 1:</strong> Email us at <a href="mailto:hello@latshop.com" className={s.link}>hello@latshop.com</a> with your order number and reason for return</li>
            <li><strong>Step 2:</strong> We&apos;ll send you a return confirmation and instructions within 24 hours</li>
            <li><strong>Step 3:</strong> Pack the item securely and ship it back to our Calgary address</li>
            <li><strong>Step 4:</strong> Once received and inspected, your refund will be processed within 3–5 business days</li>
          </ul>
        </div>

        <div className={s.section}>
          <h2>Refund Timeline</h2>
          <table className={s.shippingTable}>
            <thead>
              <tr><th>Step</th><th>Timeline</th></tr>
            </thead>
            <tbody>
              {[
                { step: "We receive your return", time: "Depends on shipping" },
                { step: "Inspection & processing", time: "1–3 business days" },
                { step: "Refund issued", time: "3–5 business days" },
                { step: "Appears on your statement", time: "5–10 business days" },
              ].map((row) => (
                <tr key={row.step}>
                  <td>{row.step}</td>
                  <td style={{ color: "#7a3f1d" }}>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={s.section}>
          <h2>Non-Returnable Items</h2>
          <ul>
            <li>Sale or discounted items (final sale)</li>
            <li>Items that have been used or damaged after delivery</li>
            <li>Custom or personalised orders</li>
            <li>Items returned without prior approval</li>
          </ul>
        </div>

        <div className={s.section}>
          <h2>Damaged or Wrong Item?</h2>
          <p>
            If your item arrives damaged or you received the wrong product, we sincerely apologise.
            Please email us at{" "}
            <a href="mailto:hello@latshop.com" className={s.link}>hello@latshop.com</a>{" "}
            with a photo and your order number. We&apos;ll arrange a free replacement or full refund
            immediately — no need to return the item.
          </p>
        </div>

        <div className={s.section}>
          <h2>Return Shipping Cost</h2>
          <p>
            Customers are responsible for return shipping costs unless the item arrived
            damaged or was the wrong product. We recommend using a trackable shipping
            method — we cannot process refunds for items lost in transit.
          </p>
        </div>
      </div>
    </div>
  );
}
