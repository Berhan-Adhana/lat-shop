// src/components/account/AccountNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import s from "@/app/(account)/account/account.module.css";

const links = [
  { href: "/account",           label: "Account",  icon: "👤", exact: true },
  { href: "/account/orders",    label: "Orders",   icon: "🛍️" },
  { href: "/account/wishlist",  label: "Wishlist", icon: "❤️" },
];

export default function AccountNav() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* ── Mobile: horizontal tab strip ── */}
      <div className={s.mobileNav}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${s.mobileNavBtn} ${isActive(link.href, link.exact) ? s.mobileNavBtnActive : ""}`}
          >
            <span className={s.mobileNavIcon}>{link.icon}</span>
            {link.label}
          </Link>
        ))}
        <button
          onClick={logout}
          className={s.mobileNavBtn}
          style={{ color: "#dc2626", borderColor: "#fca5a5" }}
        >
          <span className={s.mobileNavIcon}>🚪</span>
          Sign Out
        </button>
      </div>

      {/* ── Desktop: sidebar ── */}
      <aside className={s.sidebar}>
        <nav className={s.sidebarNav}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${s.navLink} ${isActive(link.href, link.exact) ? s.navLinkActive : ""}`}
            >
              <span className={s.navIcon}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className={s.navLink}
            style={{ color: "#dc2626" }}
          >
            <span className={s.navIcon}>🚪</span>
            Sign Out
          </button>
        </nav>
      </aside>
    </>
  );
}
