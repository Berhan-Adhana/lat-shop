// src/app/(shop)/product/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db/prisma";
import AddToCartButton from "@/components/shop/AddToCartButton";
import WishlistButton from "@/components/shop/WishlistButton";
import ReviewsSection from "@/components/shop/ReviewsSection";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductTabs from "@/components/shop/ProductTabs";
import type { Metadata } from "next";
import s from "./product.module.css";

interface Props { params: { slug: string } }

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      reviews: {
        where: { isVisible: true },
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

async function getRelated(categoryId: string, excludeId: string) {
  return prisma.product.findMany({
    where: { categoryId, isActive: true, id: { not: excludeId } },
    include: { category: true },
    take: 4,
    orderBy: { featured: "desc" },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct(params.slug);
  if (!p) return { title: "Product Not Found" };
  return {
    title: p.name,
    description: p.description.slice(0, 155),
    openGraph: { images: p.images?.[0] ? [p.images[0]] : [] },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const related = await getRelated(product.categoryId, product.id);

  const displayPrice = product.onSale && product.salePrice ? product.salePrice : product.price;
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length : 0;
  const reviewCount = product.reviews.length;

  // Access new fields safely (they may not exist yet if schema not migrated)
  const p = product as any;

  return (
    <div className={s.productPage}>
      <div className={s.productInner}>

        {/* Breadcrumb */}
        <nav className={s.breadcrumb}>
          <Link href="/shop">Shop</Link>
          <span>›</span>
          {product.category && (
            <><Link href={`/shop/${product.category.slug}`}>{product.category.name}</Link><span>›</span></>
          )}
          <span className={s.breadcrumbCurrent}>{product.name}</span>
        </nav>

        <div className={s.productLayout}>

          {/* ── LEFT: Gallery (sticky) ── */}
          <div className={s.productImages}>
            <ProductGallery
              images={product.images}
              videoUrl={p.videoUrl}
              productName={product.name}
              onSale={product.onSale}
            />
          </div>

          {/* ── RIGHT: Info ── */}
          <div className={s.productInfo}>

            {/* Category */}
            {product.category && (
              <Link href={`/shop/${product.category.slug}`} className={s.productCat}>
                {product.category.name}
              </Link>
            )}

            {/* Name */}
            <h1 className={s.productName}>{product.name}</h1>

            {/* Badges */}
            <div className={s.badgesRow}>
              {p.isHandmade !== false && (
                <span className={`${s.badge} ${s.badgeHandmade}`}>🤲 Handcrafted</span>
              )}
              {p.origin && (
                <span className={`${s.badge} ${s.badgeOrigin}`}>📍 {p.origin}</span>
              )}
              {product.onSale && (
                <span className={`${s.badge} ${s.badgeSale}`}>🏷️ On Sale</span>
              )}
            </div>

            {/* Rating — scrolls to reviews on click */}
            {reviewCount > 0 ? (
              <a href="#reviews" className={s.ratingRow} style={{ textDecoration: "none" }}>
                <div className={s.stars}>
                  {[1,2,3,4,5].map((i) => (
                    <span key={i} className={i <= Math.round(avgRating) ? s.starFilled : s.star}>★</span>
                  ))}
                </div>
                <span className={s.ratingText}>
                  {avgRating.toFixed(1)} · {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                </span>
              </a>
            ) : (
              <a href="#reviews" style={{ fontSize: 13, color: "#b86820", textDecoration: "none", display: "block", marginBottom: 16, fontFamily: "system-ui" }}>
                ☆ Be the first to review
              </a>
            )}

            {/* Price */}
            <div className={s.priceBlock}>
              <span className={s.mainPrice}>CA${displayPrice.toFixed(2)}</span>
              {product.onSale && product.salePrice && (
                <span className={s.originalPrice}>CA${product.price.toFixed(2)}</span>
              )}
              {product.onSale && product.salePrice && (
                <span className={s.savings}>
                  Save CA${(product.price - product.salePrice).toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className={s.stockInfo}>
              {product.stock === 0 ? (
                <span className={s.outOfStock}>⚠ Out of stock — check back soon</span>
              ) : product.stock <= 5 ? (
                <span className={s.lowStock}>🔥 Only {product.stock} left — order soon</span>
              ) : (
                <span className={s.inStock}>✓ In stock · Ships in 1–2 business days</span>
              )}
            </div>

            {/* Add to cart + Wishlist */}
            <div className={s.ctaRow}>
              <div style={{ flex: 1 }}>
                <AddToCartButton product={product as any} />
              </div>
              <WishlistButton productId={product.id} />
            </div>

            {/* Trust strip */}
            <div className={s.trustBadges}>
              {[
                { icon: "🔒", label: "Secure\nCheckout" },
                { icon: "📦", label: "Ships from\nCalgary" },
                { icon: "↩️", label: "30-Day\nReturns" },
                { icon: "💝", label: "Gift\nPackaging" },
              ].map((item) => (
                <div key={item.label} className={s.trustItem}>
                  <span className={s.trustIcon}>{item.icon}</span>
                  <span className={s.trustLabel} style={{ whiteSpace: "pre-line" }}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Info tabs — description, materials, shipping */}
            <div style={{ marginTop: 28 }}>
              <ProductTabs
                description={product.description}
                materials={p.materials}
                careInfo={p.careInfo}
                dimensions={p.dimensions}
                weight={p.weight}
                origin={p.origin}
                isHandmade={p.isHandmade !== false}
              />
            </div>
          </div>
        </div>

        {/* ── Reviews ── */}
        <div id="reviews">
          <ReviewsSection
            productId={product.id}
            initialReviews={product.reviews as any}
            avgRating={avgRating}
          />
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <section style={{ marginTop: 64 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontFamily: "Georgia, serif", fontWeight: 400, color: "#1a1209" }}>
                You May Also Like
              </h2>
              {product.category && (
                <Link href={`/shop/${product.category.slug}`}
                  style={{ fontSize: 13, color: "#d4832a", textDecoration: "none", fontFamily: "system-ui" }}>
                  View all →
                </Link>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {related.slice(0, 4).map((rel) => {
                const rp = rel as any;
                const relPrice = rel.onSale && rel.salePrice ? rel.salePrice : rel.price;
                return (
                  <Link key={rel.id} href={`/product/${rel.slug}`}
                    style={{ textDecoration: "none", display: "block" }}>
                    <div style={{
                      background: "#fff", border: "1px solid #f4dbb0", borderRadius: 12,
                      overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(212,131,42,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "";
                        (e.currentTarget as HTMLElement).style.boxShadow = "";
                      }}
                    >
                      <div style={{ aspectRatio: "1", background: "#faefd9", position: "relative" }}>
                        {rel.images?.[0] ? (
                          <img src={rel.images[0]} alt={rel.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: "#ecc07f" }}>L</div>
                        )}
                      </div>
                      <div style={{ padding: 12 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "#1a1209", fontFamily: "system-ui", marginBottom: 4 }}>
                          {rel.name}
                        </p>
                        <p style={{ fontSize: 15, color: "#d4832a", fontFamily: "Georgia, serif", fontWeight: 600 }}>
                          CA${relPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
