// src/components/admin/AdminSidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Logo from "@/components/layout/Logo";
import s from "./AdminSidebar.module.css";

interface Props {
  user: { name: string; email: string };
}

const navItems = [
  { href: "/admin",              label: "Dashboard",  icon: "📊", exact: true },
  { href: "/admin/products",     label: "Products",   icon: "📦" },
  { href: "/admin/orders",       label: "Orders",     icon: "🛍️" },
  { href: "/admin/customers",    label: "Customers",  icon: "👥" },
  { href: "/admin/categories",   label: "Categories", icon: "🏷️" },
  { href: "/admin/discounts",    label: "Discounts",  icon: "🎟️" },
  { href: "/admin/shipping",     label: "Shipping",   icon: "🚚" },
  { href: "/admin/settings",     label: "Settings",   icon: "⚙️" },
];

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className={`${s.sidebar} ${collapsed ? s.collapsed : ""}`}>
      {/* Logo */}
      <div className={s.sidebarLogo}>
        {collapsed ? (
          <Logo variant="icon" light size="sm" />
        ) : (
          <Logo variant="horizontal" light size="sm" />
        )}
        <button
          className={s.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Admin badge */}
      {!collapsed && (
        <div className={s.adminBadge}>
          <span>⚡</span> Admin Panel
        </div>
      )}

      {/* Nav */}
      <nav className={s.sidebarNav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${s.navItem} ${isActive(item.href, item.exact) ? s.navItemActive : ""}`}
            title={collapsed ? item.label : undefined}
          >
            <span className={s.navIcon}>{item.icon}</span>
            {!collapsed && <span className={s.navLabel}>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className={s.sidebarFooter}>
        {!collapsed && (
          <div className={s.userInfo}>
            <div className={s.userAvatar}>{user.name[0].toUpperCase()}</div>
            <div>
              <p className={s.userName}>{user.name}</p>
              <p className={s.userEmail}>{user.email}</p>
            </div>
          </div>
        )}
        <div className={s.footerActions}>
          <Link href="/" className={s.footerLink} title="View Store">
            🏪 {!collapsed && "View Store"}
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={`${s.footerLink} ${s.logoutBtn}`}
            title="Sign Out"
          >
            🚪 {!collapsed && "Sign Out"}
          </button>
        </div>
      </div>
    </aside>
  );
}
