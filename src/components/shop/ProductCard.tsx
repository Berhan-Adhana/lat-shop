// src/components/shop/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart.store";
import type { Product } from "@/types";
import s from "./ProductCard.module.css";

interface Props { product: Product }

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  const displayPrice = product.onSale && product.salePrice
    ? product.salePrice : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link href={`/product/${product.slug}`} className={s.productCard}>
      <div className={s.cardImage}>
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={s.productImg}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className={s.imgPlaceholder}>L</div>
        )}
        <div className={s.badges}>
          {product.onSale && <span className={`${s.badge} ${s.badgeSale}`}>Sale</span>}
          {product.featured && <span className={`${s.badge} ${s.badgeFeatured}`}>Featured</span>}
          {product.stock === 0 && <span className={`${s.badge} ${s.badgeOut}`}>Sold Out</span>}
        </div>
        {product.stock > 0 && (
          <button className={s.quickAdd} onClick={handleAddToCart} aria-label={`Add ${product.name} to cart`}>
            Add to Cart
          </button>
        )}
      </div>
      <div className={s.cardBody}>
        {product.category && (
          <span className={s.cardCategory}>{product.category.name}</span>
        )}
        <h3 className={s.cardName}>{product.name}</h3>
        <div className={s.cardPricing}>
          <span className={s.cardPrice}>CA${displayPrice.toFixed(2)}</span>
          {product.onSale && product.salePrice && (
            <span className={s.cardOriginal}>CA${product.price.toFixed(2)}</span>
          )}
        </div>
        {(product.avgRating ?? 0) > 0 && (
          <div className={s.cardRating}>
            <div className={s.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.round(product.avgRating ?? 0) ? s.starFilled : s.star}>★</span>
              ))}
            </div>
            <span className={s.reviewCount}>({product.reviewCount})</span>
          </div>
        )}
      </div>
    </Link>
  );
}
