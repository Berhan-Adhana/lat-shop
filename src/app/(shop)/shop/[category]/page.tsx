// src/app/(shop)/shop/[category]/page.tsx
// Handles /shop/jewelry, /shop/african-gifts, /shop/accessories etc.
// Reuses the same shop page but pre-filters by category slug

import { notFound } from "next/navigation";
import prisma from "@/lib/db/prisma";
import ProductCard from "@/components/shop/ProductCard";
import ShopFilters from "@/components/shop/ShopFilters";
import Link from "next/link";
import type { Metadata } from "next";
import s from "../shop.module.css";

interface Props {
  params: { category: string };
  searchParams: { sort?: string; min?: string; max?: string; page?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
  });
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.name} | Lat Shop`,
    description: category.description ?? `Shop our ${category.name} collection`,
  };
}

export default async function CategoryShopPage({ params, searchParams }: Props) {
  // Verify the category exists
  const category = await prisma.category.findUnique({
    where: { slug: params.category, isActive: true },
  });

  if (!category) notFound();

  const page = Number(searchParams.page ?? 1);
  const pageSize = 12;
  const skip = (page - 1) * pageSize;

  const where: any = { isActive: true, category: { slug: params.category } };
  if (searchParams.min) where.price = { ...where.price, gte: Number(searchParams.min) };
  if (searchParams.max) where.price = { ...where.price, lte: Number(searchParams.max) };

  const orderBy: any =
    searchParams.sort === "price_asc"  ? { price: "asc" }  :
    searchParams.sort === "price_desc" ? { price: "desc" } :
    searchParams.sort === "newest"     ? { createdAt: "desc" } :
    { featured: "desc" };

  const [products, total, allCategories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { isActive: true } }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className={s.shopPage}>
      <div className={s.shopInner}>
        {/* Header */}
        <div className={s.shopHeader}>
          <div>
            <h1>{category.name}</h1>
            {category.description && (
              <p style={{ fontSize: 14, color: "#7a3f1d", marginTop: 4, fontFamily: "system-ui" }}>
                {category.description}
              </p>
            )}
          </div>
          <p className={s.productCount}>{total} product{total !== 1 ? "s" : ""}</p>
        </div>

        <div className={s.shopLayout}>
          {/* Sidebar */}
          <aside className={s.sidebar}>
            <ShopFilters
              categories={allCategories as any}
              currentParams={{ category: params.category, ...searchParams }}
            />
          </aside>

          {/* Grid */}
          <div className={s.mainContent}>
            <div className={s.sortBar}>
              <p className={s.showing}>
                Showing {Math.min(skip + 1, total)}–{Math.min(page * pageSize, total)} of {total}
              </p>
            </div>

            {products.length > 0 ? (
              <div className={s.productsGrid}>
                {products.map((p) => (
                  <ProductCard key={p.id} product={p as any} />
                ))}
              </div>
            ) : (
              <div className={s.emptyState}>
                <p>No products found in this category.</p>
                <Link href="/shop">Browse all products</Link>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={s.pagination}>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const qs = new URLSearchParams();
                  if (searchParams.sort) qs.set("sort", searchParams.sort);
                  qs.set("page", String(p));
                  return (
                    <Link
                      key={p}
                      href={`/shop/${params.category}?${qs.toString()}`}
                      className={`${s.pageBtn} ${page === p ? s.pageBtnActive : ""}`}
                    >
                      {p}
                    </Link>
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
