// src/components/layout/Footer.tsx
import Link from "next/link";
import Logo from "./Logo";
import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.footerInner}>
        {/* Brand — stacked logo */}
        <div>
          <div className={s.footerLogo}
            style={{
              marginBottom: 20,
                         
            }}
          >
            <Logo variant="stacked" light size="sm" href="/" />
          </div>
          <p className={s.footerTagline}>
            Handcrafted African gifts, jewelry &amp; accessories.
            <br />
            Shipped from Calgary, Canada.
          </p>
          <div className={s.socialLinks}>
            <a href="#" aria-label="Instagram" className={s.socialLink}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className={s.socialLink}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            <a href="#" aria-label="TikTok" className={s.socialLink}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />
              </svg>
            </a>
          </div>
        </div>

        {/* Shop */}
        <div className={s.footerCol}>
          <h4>Shop</h4>
          <Link href="/shop">All Products</Link>
          <Link href="/shop/jewelry">Jewelry</Link>
          <Link href="/shop/african-gifts">African Gifts</Link>
          <Link href="/shop/accessories">Accessories</Link>
          <Link href="/shop/gift-sets">Gift Sets</Link>
        </div>

        {/* Help */}
        <div className={s.footerCol}>
          <h4>Help</h4>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/shipping-info">Shipping Info</Link>
          <Link href="/returns">Returns</Link>
          <Link href="/faq">FAQ</Link>
        </div>

        {/* Account */}
        <div className={s.footerCol}>
          <h4>Account</h4>
          <Link href="/login">Sign In</Link>
          <Link href="/register">Create Account</Link>
          <Link href="/account/orders">My Orders</Link>
          <Link href="/account/wishlist">Wishlist</Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={s.footerBottom}>
        <p>
          © {new Date().getFullYear()} Lat Shop. All rights reserved. Calgary,
          Canada.
        </p>
        <div className={s.footerLegal}>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
        <div className={s.paymentIcons}>
          {["Visa", "Mastercard", "PayPal", "Apple Pay"].map((p) => (
            <span key={p} className={s.paymentBadge}>
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
