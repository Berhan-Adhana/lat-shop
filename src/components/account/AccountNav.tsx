// src/components/account/AccountNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import s from "@/app/(account)/account/account.module.css";

const links = [
  { href: "/account", label: "My Account", icon: "👤", exact: true },
  { href: "/account/orders", label: "My Orders", icon: "🛍️" },
  { href: "/account/wishlist", label: "Wishlist", icon: "❤️" },
];

export default function AccountNav() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
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
        <button onClick={logout} className={s.navLink} style={{ border: "none", background: "none", cursor: "pointer", color: "#dc2626", width: "100%", textAlign: "left" }}>
          <span className={s.navIcon}>🚪</span>
          Sign Out
        </button>
      </nav>
    </aside>
  );
}
