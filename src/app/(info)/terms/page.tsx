// src/app/(info)/terms/page.tsx
import s from "../info.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service | Lat Shop" };

export default function TermsPage() {
  return (
    <div className={s.page}>
      <div className={s.hero}>
        <h1>Terms of Service</h1>
        <p>Please read these terms carefully before using Lat Shop</p>
      </div>

      <div className={s.inner}>
        <p style={{ fontSize: 13, color: "#b86820", marginBottom: 32 }}>
          Last updated: January 2025. By using this website, you agree to these terms.
        </p>

        {[
          {
            title: "1. Using Our Website",
            content: "By accessing Lat Shop, you agree to use the site lawfully and respectfully. You must be at least 18 years old to create an account and place orders. You are responsible for maintaining the security of your account password.",
          },
          {
            title: "2. Orders & Pricing",
            content: "All prices are in Canadian dollars (CAD) unless stated otherwise. We reserve the right to cancel orders if a product is out of stock, priced incorrectly, or if we suspect fraudulent activity. You will be notified and refunded in full if an order is cancelled.",
          },
          {
            title: "3. Shipping & Delivery",
            content: "We ship from Calgary, Canada. Delivery times are estimates and not guaranteed. We are not responsible for delays caused by customs, weather, or courier issues beyond our control. Risk of loss transfers to you upon delivery.",
          },
          {
            title: "4. Returns & Refunds",
            content: "Our return policy allows returns within 30 days of delivery for unused items in original condition. Full details are available on our Returns page. Refunds are processed to your original payment method.",
          },
          {
            title: "5. Product Descriptions",
            content: "We make every effort to display products accurately. Colours may vary slightly due to monitor settings. We reserve the right to correct errors in product descriptions or pricing at any time.",
          },
          {
            title: "6. Intellectual Property",
            content: "All content on this website — including images, text, logos, and design — is the property of Lat Shop and may not be copied, reproduced, or used without written permission.",
          },
          {
            title: "7. Limitation of Liability",
            content: "Lat Shop is not liable for indirect, incidental, or consequential damages arising from the use of our website or products. Our maximum liability is limited to the value of the order in question.",
          },
          {
            title: "8. Governing Law",
            content: "These terms are governed by the laws of Alberta, Canada. Any disputes will be resolved in the courts of Calgary, Alberta.",
          },
          {
            title: "9. Changes to Terms",
            content: "We may update these terms from time to time. Continued use of the site after changes constitutes acceptance of the new terms. We'll notify registered users of significant changes by email.",
          },
          {
            title: "10. Contact",
            content: "Questions about these terms? Email us at hello@latshop.com or visit our Contact page.",
          },
        ].map((section) => (
          <div key={section.title} className={s.section}>
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
