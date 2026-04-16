// src/store/cart.store.ts
// Cart persists in localStorage AND syncs to DB when user is logged in

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product, CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  _hasHydrated: boolean;

  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setHasHydrated: (state: boolean) => void;
  syncToDb: () => void;

  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          const newItems = existing
            ? state.items.map((i) =>
                i.productId === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              )
            : [
                ...state.items,
                { id: `cart-${product.id}`, productId: product.id, product, quantity },
              ];
          return { items: newItems, isOpen: true };
        });
        // Sync to DB in background
        setTimeout(() => get().syncToDb(), 500);
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
        setTimeout(() => get().syncToDb(), 500);
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) { get().removeItem(productId); return; }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
        setTimeout(() => get().syncToDb(), 500);
      },

      clearCart: () => {
        set({ items: [] });
        // Clear DB cart too
        fetch("/api/cart", { method: "DELETE" }).catch(() => {});
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // Syncs current cart to DB (only if user is logged in)
      syncToDb: () => {
        const items = get().items;
        fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
            })),
          }),
        }).catch(() => {}); // silent fail — DB sync is best-effort
      },

      itemCount: () => get().items.reduce((t, i) => t + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((t, i) => {
          const price = i.product.onSale && i.product.salePrice
            ? i.product.salePrice : i.product.price;
          return t + price * i.quantity;
        }, 0),
    }),
    {
      name: "lat-shop-cart",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
