// src/components/cart/CartDrawer.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart.store";
import s from "./CartDrawer.module.css";

export default function CartDrawer() {
  const items = useCartStore((st) => st.items);
  const isOpen = useCartStore((st) => st.isOpen);
  const closeCart = useCartStore((st) => st.closeCart);
  const removeItem = useCartStore((st) => st.removeItem);
  const updateQuantity = useCartStore((st) => st.updateQuantity);
  const subtotal = useCartStore((st) => st.subtotal());
  const itemCount = useCartStore((st) => st.itemCount());

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCart]);

  return (
    <>
      <div className={`${s.backdrop} ${isOpen ? s.backdropVisible : ""}`} onClick={closeCart} aria-hidden="true" />

      <div className={`${s.drawer} ${isOpen ? s.drawerOpen : ""}`} role="dialog" aria-label="Shopping cart">
        <div className={s.drawerHeader}>
          <h2>Your Cart {itemCount > 0 && <span className={s.count}>({itemCount})</span>}</h2>
          <button className={s.closeBtn} onClick={closeCart} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={s.drawerBody}>
          {items.length === 0 ? (
            <div className={s.emptyCart}>
              <div className={s.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ecc07f" strokeWidth="1.2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <p className={s.emptyTitle}>Your cart is empty</p>
              <p className={s.emptySub}>Add something beautiful to get started</p>
              <Link href="/shop" className={s.browseBtn} onClick={closeCart}>Browse Shop</Link>
            </div>
          ) : (
            <ul className={s.cartItems}>
              {items.map((item) => {
                const price = item.product.onSale && item.product.salePrice
                  ? item.product.salePrice : item.product.price;
                return (
                  <li key={item.id} className={s.cartItem}>
                    <div className={s.itemImage}>
                      {item.product.images?.[0] ? (
                        <Image src={item.product.images[0]} alt={item.product.name} width={72} height={72} className="object-cover w-full h-full" />
                      ) : (
                        <div className={s.imgPlaceholder}>L</div>
                      )}
                    </div>
                    <div className={s.itemDetails}>
                      <p className={s.itemName}>{item.product.name}</p>
                      <p className={s.itemPrice}>CA${(price * item.quantity).toFixed(2)}</p>
                      <div className={s.qtyRow}>
                        <button className={s.qtyBtn} onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label="Decrease">−</button>
                        <span className={s.qtyVal}>{item.quantity}</span>
                        <button className={s.qtyBtn} onClick={() => updateQuantity(item.productId, item.quantity + 1)} disabled={item.quantity >= item.product.stock} aria-label="Increase">+</button>
                      </div>
                    </div>
                    <button className={s.removeBtn} onClick={() => removeItem(item.productId)} aria-label="Remove item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className={s.drawerFooter}>
            <div className={s.subtotalRow}>
              <span>Subtotal</span>
              <span className={s.subtotalVal}>CA${subtotal.toFixed(2)}</span>
            </div>
            <p className={s.shippingNote}>Shipping & taxes calculated at checkout</p>
            <Link href="/checkout" className={s.checkoutBtn} onClick={closeCart}>Proceed to Checkout</Link>
            <button className={s.continueBtn} onClick={closeCart}>Continue Shopping</button>
          </div>
        )}
      </div>
    </>
  );
}
