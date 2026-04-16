// src/app/(info)/about/page.tsx
import type { Metadata } from "next";
import s from "../info.module.css";

export const metadata: Metadata = { title: "About Us | Lat Shop" };

export default function AboutPage() {
  return (
    <div className={s.page}>
      <div className={s.hero}>
        <h1>Our Story</h1>
        <p>Bringing the beauty of African craftsmanship to Canada and beyond</p>
      </div>

      <div className={s.inner}>
        <div className={s.section}>
          <h2>Who We Are</h2>
          <p>
            Lat Shop is a Calgary-based boutique celebrating the rich culture, artistry,
            and craftsmanship of Africa. We handpick every piece in our collection —
            from beaded jewelry to carved gifts and woven accessories — to bring you
            authentic, meaningful products with a story behind them.
          </p>
          <p>
            Founded in Calgary, Alberta, we ship across Canada, the United States, and Europe,
            making it easy for the African diaspora and lovers of African culture worldwide
            to find something truly special.
          </p>
        </div>

        <div className={s.section}>
          <h2>Our Mission</h2>
          <p>
            We believe every gift should carry meaning. Our mission is to connect people
            with the beauty of African heritage through thoughtfully curated products that
            celebrate tradition, craft, and community.
          </p>
        </div>

        <div className={s.cardGrid}>
          {[
            { icon: "🌍", title: "Authentically African", desc: "Every piece is inspired by African cultures, traditions and artistry — chosen with care and intention." },
            { icon: "📦", title: "Shipped from Calgary", desc: "We ship across Canada, the US and Europe from our base in Calgary, Alberta." },
            { icon: "💝", title: "Gift-Ready Packaging", desc: "Every order arrives beautifully packaged, ready to give without extra wrapping." },
            { icon: "🤝", title: "Community First", desc: "We support artisans and celebrate the cultures behind every product we carry." },
            { icon: "🔒", title: "Secure Shopping", desc: "Shop with confidence — all payments are processed securely via Stripe and PayPal." },
            { icon: "↩️", title: "Easy Returns", desc: "Not happy? We offer hassle-free returns within 30 days of delivery." },
          ].map((item) => (
            <div key={item.title} className={s.card}>
              <div className={s.cardIcon}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

        <div className={s.section} style={{ marginTop: 40 }}>
          <h2>Based in Calgary</h2>
          <p>
            We are proud to be a Calgary business, serving customers locally and
            shipping internationally. If you have any questions about our products
            or your order, don&apos;t hesitate to reach out — we&apos;re always happy to help.
          </p>
          <div className={s.highlight}>
            <strong>Want to get in touch?</strong> Visit our{" "}
            <a href="/contact" className={s.link}>Contact page</a> or email us directly.
            We typically respond within 24 hours.
          </div>
        </div>
      </div>
    </div>
  );
}
