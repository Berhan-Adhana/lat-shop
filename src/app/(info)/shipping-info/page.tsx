// src/app/(info)/shipping-info/page.tsx
import s from "../info.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping Info | Lat Shop" };

export default function ShippingInfoPage() {
  return (
    <div className={s.page}>
      <div className={s.hero}>
        <h1>Shipping Information</h1>
        <p>Everything you need to know about how we ship your order</p>
      </div>

      <div className={s.inner}>
        <div className={s.section}>
          <h2>Shipping Rates & Times</h2>
          <table className={s.shippingTable}>
            <thead>
              <tr>
                <th>Region</th>
                <th>Flat Rate</th>
                <th>Free Shipping</th>
                <th>Estimated Time</th>
              </tr>
            </thead>
            <tbody>
              {[
                { region: "🇨🇦 Canada", rate: "CA$12.00", free: "Over CA$100", time: "3–7 business days" },
                { region: "🇺🇸 United States", rate: "CA$18.00", free: "Over CA$150", time: "7–14 business days" },
                { region: "🇪🇺 Europe", rate: "CA$30.00", free: "Over CA$200", time: "10–21 business days" },
              ].map((row) => (
                <tr key={row.region}>
                  <td style={{ fontWeight: 500 }}>{row.region}</td>
                  <td>{row.rate}</td>
                  <td style={{ color: "#22c55e", fontWeight: 600 }}>{row.free}</td>
                  <td style={{ color: "#7a3f1d" }}>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={s.section}>
          <h2>How We Ship</h2>
          <p>
            All orders are packed with care in Calgary and shipped via Canada Post.
            For high-value items or express requests, we may use UPS or FedEx.
          </p>
          <ul>
            <li>Orders are processed within 1–2 business days</li>
            <li>You'll receive a confirmation email when your order ships</li>
            <li>Tracking number included with every shipment</li>
            <li>Orders are packed in protective, gift-ready packaging</li>
          </ul>
        </div>

        <div className={s.section}>
          <h2>Tracking Your Order</h2>
          <p>
            Once your order ships, you&apos;ll receive an email with your Canada Post tracking number.
            You can track your package at{" "}
            <a href="https://www.canadapost-postescanada.ca" target="_blank" rel="noopener noreferrer" className={s.link}>
              canadapost.ca
            </a>{" "}
            or directly from your{" "}
            <a href="/account/orders" className={s.link}>My Orders</a> page.
          </p>
        </div>

        <div className={s.section}>
          <h2>International Shipping & Customs</h2>
          <p>
            For US and European orders, your package may be subject to customs duties
            and import taxes. These charges are set by your country&apos;s customs authority
            and are the responsibility of the recipient. We cannot predict or control these fees.
          </p>
          <p>
            We mark all packages accurately on customs forms. We do not mark packages
            as gifts to avoid customs fees.
          </p>
        </div>

        <div className={s.highlight}>
          <strong>Questions about your order?</strong> Check{" "}
          <a href="/account/orders" className={s.link}>My Orders</a> for tracking info,
          or <a href="/contact" className={s.link}>contact us</a> and we&apos;ll help right away.
        </div>
      </div>
    </div>
  );
}
