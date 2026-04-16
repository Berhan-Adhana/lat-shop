// src/app/(shop)/page.tsx
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/db/prisma";
import ProductCard from "@/components/shop/ProductCard";
import s from "./home.module.css";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true, isActive: true },
    include: { category: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    take: 5,
  });
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  const fallbackCategories = [
    { id: "1", name: "Jewelry", emoji: "💎", slug: "jewelry" },
    { id: "2", name: "African Gifts", emoji: "🎁", slug: "african-gifts" },
    { id: "3", name: "Accessories", emoji: "👜", slug: "accessories" },
    { id: "4", name: "Home Decor", emoji: "🏺", slug: "home-decor" },
    { id: "5", name: "Gift Sets", emoji: "🎀", slug: "gift-sets" },
  ];

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <div className={s.home}>
      {/* ── HERO ── */}
      <section className={s.hero}>
        <div className={s.heroBg} aria-hidden="true">
          <div className={s.heroPattern} />
          <div className={s.heroGlow} />
        </div>

        <div className={s.heroInner}>
          <div className={s.heroContent}>
            <span className={s.heroEyebrow}>Calgary, Canada · Est. 2024</span>
            <h1 className={s.heroTitle}>
              The Beauty of<br />
              <em>African Craft</em>
            </h1>
            <p className={s.heroDesc}>
              Handpicked jewelry, gifts, and accessories inspired by the richness
              of African culture — shipped to Canada, the US, and Europe.
            </p>
            <div className={s.heroActions}>
              <Link href="/shop" className={s.btnPrimary}>Shop Collection</Link>
              <Link href="/shop/african-gifts" className={s.btnSecondary}>African Gifts</Link>
            </div>
            <div className={s.heroTrust}>
              <span>✓ Free shipping over CA$100</span>
              <span>✓ Secure checkout</span>
              <span>✓ Easy returns</span>
            </div>
          </div>

          <div className={s.heroVisual}>
            <div className={`${s.heroCard} ${s.heroCard1}`}>
              <div className={s.cardInner}>
                <div className={s.cardEmoji}>💎</div>
                <p>Handcrafted</p>
                <p className={s.cardSub}>Jewelry</p>
              </div>
            </div>
            <div className={`${s.heroCard} ${s.heroCard2}`}>
              <div className={s.cardInner}>
                <div className={s.cardEmoji}>🎁</div>
                <p>African</p>
                <p className={s.cardSub}>Gifts</p>
              </div>
            </div>
            <div className={`${s.heroCard} ${s.heroCard3}`}>
              <div className={s.cardInner}>
                <div className={s.cardEmoji}>✨</div>
                <p>Curated</p>
                <p className={s.cardSub}>Accessories</p>
              </div>
            </div>
          </div>
        </div>

        <div className={s.couponBar}>
          <p>
            🎉 New here? Use code <strong>WELCOME10</strong> for 10% off your first order
          </p>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className={`${s.section} ${s.categoriesSection}`}>
        <div className={s.sectionInner}>
          <div className={s.sectionHeader}>
            <h2>Shop by Category</h2>
            <Link href="/shop" className={s.seeAll}>See all →</Link>
          </div>
          <div className={s.categoriesGrid}>
            {displayCategories.map((cat: any) => (
              <Link key={cat.id} href={`/shop/${cat.slug}`} className={s.categoryCard}>
                <div className={s.catImage}>
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                  ) : (
                    <div className={s.catPlaceholder}>
                      {cat.emoji ?? cat.name[0]}
                    </div>
                  )}
                </div>
                <span className={s.catName}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className={`${s.section} ${s.featuredSection}`}>
        <div className={s.sectionInner}>
          <div className={s.sectionHeader}>
            <h2>Featured Products</h2>
            <Link href="/shop" className={s.seeAll}>View all →</Link>
          </div>
          {products.length > 0 ? (
            <div className={s.productsGrid}>
              {products.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          ) : (
            <div className={s.noProducts}>
              <p>Products coming soon — check back shortly!</p>
              <Link href="/shop" className={s.btnPrimary}>Browse Shop</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className={`${s.section} ${s.whySection}`}>
        <div className={s.sectionInner}>
          <h2 className={s.whyTitle}>Why Lat Shop?</h2>
          <div className={s.whyGrid}>
            {[
              {
                icon: "🌍",
                title: "Authentically African",
                desc: "Every piece is carefully sourced and inspired by African culture, craft, and tradition.",
              },
              {
                icon: "📦",
                title: "Shipped from Calgary",
                desc: "Fast, reliable shipping across Canada, the US, and Europe from our Calgary base.",
              },
              {
                icon: "💝",
                title: "Perfect for Gifting",
                desc: "Beautiful packaging on every order — ready to give as soon as it arrives.",
              },
              {
                icon: "🔒",
                title: "Secure Checkout",
                desc: "Stripe & PayPal payments with full encryption. Your information is always safe.",
              },
            ].map((item) => (
              <div key={item.title} className={s.whyCard}>
                <div className={s.whyIcon}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={s.ctaSection}>
        <div className={s.ctaInner}>
          <h2>Ready to Find Something Special?</h2>
          <p>Explore our full collection of African-inspired gifts and jewelry</p>
          <Link href="/shop" className={s.ctaBtn}>Shop Now</Link>
        </div>
      </section>
    </div>
  );
}
