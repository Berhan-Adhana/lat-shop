// src/app/(account)/account/wishlist/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cart.store";
import AccountNav from "@/components/account/AccountNav";
import toast from "react-hot-toast";
import s from "../account.module.css";

export default function WishlistPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const addItem = useCartStore((st) => st.addItem);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login?callbackUrl=/account/wishlist");
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => { setWishlist(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isAuthenticated]);

  const handleRemove = async (productId: string) => {
    try {
      await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
      setWishlist((prev) => prev.filter((w) => w.productId !== productId));
      toast.success("Removed from wishlist");
    } catch { toast.error("Failed to remove"); }
  };

  const handleAddToCart = (item: any) => {
    addItem(item.product);
    toast.success(`${item.product.name} added to cart`);
  };

  if (isLoading || loading) return (
    <div className={s.page}><div className={s.loading}><div className={s.spinner} /></div></div>
  );

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <div className={s.header}>
          <h1>Wishlist</h1>
          <p>{wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}</p>
        </div>

        <AccountNav />

        <div className={s.layout}>
          <div className={s.sidebar} />
          <div className={s.main}>
            {wishlist.length === 0 ? (
              <div className={s.emptyState}>
                <div className={s.emptyIcon}>❤️</div>
                <h3>Your wishlist is empty</h3>
                <p>Tap the heart on any product to save it here.</p>
                <Link href="/shop" className={s.btnPrimary}>Browse Products</Link>
              </div>
            ) : (
              <div className={s.wishlistGrid}>
                {wishlist.map((item) => {
                  const product = item.product;
                  const price = product.onSale && product.salePrice ? product.salePrice : product.price;
                  return (
                    <div key={item.id} className={s.wishlistItem}>
                      <Link href={`/product/${product.slug}`} className={s.wishlistImg}>
                        {product.images?.[0] ? (
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#ecc07f" }}>L</div>
                        )}
                      </Link>
                      <div className={s.wishlistBody}>
                        <p className={s.wishlistName}>{product.name}</p>
                        <p className={s.wishlistPrice}>CA${price.toFixed(2)}</p>
                        <div className={s.wishlistActions}>
                          <button
                            className={s.addCartBtn}
                            onClick={() => handleAddToCart(item)}
                            disabled={product.stock === 0}
                          >
                            {product.stock === 0 ? "Sold Out" : "Add to Cart"}
                          </button>
                          <button className={s.removeBtn} onClick={() => handleRemove(item.productId)}>
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
