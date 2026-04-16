// src/components/shop/AddToCartButton.tsx
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart.store";
import type { Product } from "@/types";
import s from "./AddToCartButton.module.css";

interface Props { product: Product }

export default function AddToCartButton({ product }: Props) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((st) => st.addItem);

  if (product.stock === 0) {
    return <button className={s.btnDisabled} disabled>Out of Stock</button>;
  }

  const handleAdd = () => {
    addItem(product, qty);
    toast.success(`${qty} × ${product.name} added to cart`);
  };

  return (
    <div className={s.addRow}>
      <div className={s.qtySelector}>
        <button className={s.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">−</button>
        <span className={s.qtyVal}>{qty}</span>
        <button className={s.qtyBtn} onClick={() => setQty(Math.min(product.stock, qty + 1))} aria-label="Increase">+</button>
      </div>
      <button className={s.addBtn} onClick={handleAdd}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 8 }}>
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        Add to Cart
      </button>
    </div>
  );
}
