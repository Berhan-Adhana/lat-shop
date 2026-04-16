// src/components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cart.store";
import Logo from "./Logo";
import s from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((st) => st.itemCount());
  const openCart = useCartStore((st) => st.openCart);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/shop",             label: "All Products" },
    { href: "/shop/jewelry",     label: "Jewelry" },
    { href: "/shop/african-gifts", label: "African Gifts" },
    { href: "/shop/accessories", label: "Accessories" },
    { href: "/about",            label: "About" },
  ];

  const isActive = (href: string) =>
    href === "/shop" ? pathname === "/shop" : pathname.startsWith(href);

  return (
    <>
      <nav className={`${s.navbar} ${scrolled ? s.scrolled : ""}`}>
        <div className={s.navInner}>

          {/* ── Logo ── */}
          <Logo size="sm" dark />

          {/* ── Desktop links ── */}
          <ul className={s.navLinks}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${s.navLink} ${isActive(link.href) ? s.navLinkActive : ""}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Right actions ── */}
          <div className={s.navActions}>
            {/* Cart */}
            <button className={s.iconBtn} onClick={openCart} aria-label="Open cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {itemCount > 0 && (
                <span className={s.cartBadge}>{itemCount > 9 ? "9+" : itemCount}</span>
              )}
            </button>

            {/* User */}
            {isAuthenticated ? (
              <div className={s.userMenuWrap}>
                <button className={s.userBtn} onClick={() => setUserMenuOpen(!userMenuOpen)} aria-label="User menu">
                  <div className={s.avatar}>{user?.name?.[0]?.toUpperCase() ?? "U"}</div>
                </button>
                {userMenuOpen && (
                  <div className={s.userDropdown}>
                    <div className={s.dropdownHeader}>
                      <p className={s.dropdownName}>{user?.name}</p>
                      <p className={s.dropdownEmail}>{user?.email}</p>
                    </div>
                    <div className={s.dropdownLinks}>
                      <Link href="/account"          className={s.dropdownLink}>My Account</Link>
                      <Link href="/account/orders"   className={s.dropdownLink}>My Orders</Link>
                      <Link href="/account/wishlist" className={s.dropdownLink}>Wishlist</Link>
                      {isAdmin && (
                        <Link href="/admin" className={`${s.dropdownLink} ${s.adminLink}`}>
                          ⚡ Admin Panel
                        </Link>
                      )}
                      <button onClick={logout} className={`${s.dropdownLink} ${s.logoutBtn}`}>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={s.authLinks}>
                <Link href="/login"    className={s.loginLink}>Sign In</Link>
                <Link href="/register" className={s.registerLink}>Join</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className={s.hamburger}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={menuOpen ? s.hamburgerOpen : ""} />
              <span className={menuOpen ? s.hamburgerOpen : ""} />
              <span className={menuOpen ? s.hamburgerOpen : ""} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className={s.mobileMenu}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${s.mobileLink} ${isActive(link.href) ? s.mobileLinkActive : ""}`}
              >
                {link.label}
              </Link>
            ))}
            <div className={s.mobileDivider} />
            {isAuthenticated ? (
              <>
                <Link href="/account"          className={s.mobileLink}>My Account</Link>
                <Link href="/account/orders"   className={s.mobileLink}>My Orders</Link>
                <Link href="/account/wishlist" className={s.mobileLink}>Wishlist</Link>
                {isAdmin && <Link href="/admin" className={s.mobileLink}>Admin Panel</Link>}
                <button onClick={logout} className={`${s.mobileLink} ${s.mobileLogout}`}>Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login"    className={s.mobileLink}>Sign In</Link>
                <Link href="/register" className={s.mobileLink}>Create Account</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {userMenuOpen && (
        <div className={s.overlay} onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  );
}
