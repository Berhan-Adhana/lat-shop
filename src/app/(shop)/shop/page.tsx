// src/app/(shop)/shop/page.tsx
import prisma from "@/lib/db/prisma";
import ProductCard from "@/components/shop/ProductCard";
import ShopFilters from "@/components/shop/ShopFilters";
import s from "./shop.module.css";

interface SearchParams {
  category?: string;
  sort?: string;
  min?: string;
  max?: string;
  page?: string;
}

async function getProducts(params: SearchParams) {
  const page = Number(params.page ?? 1);
  const pageSize = 12;
  const skip = (page - 1) * pageSize;

  const where: any = { isActive: true };
  if (params.category) where.category = { slug: params.category };
  if (params.min || params.max) {
    where.price = {};
    if (params.min) where.price.gte = Number(params.min);
    if (params.max) where.price.lte = Number(params.max);
  }

  const orderBy: any =
    params.sort === "price_asc"  ? { price: "asc" }  :
    params.sort === "price_desc" ? { price: "desc" } :
    params.sort === "newest"     ? { createdAt: "desc" } :
    { featured: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, pageSize, skip };
}

async function getCategories() {
  return prisma.category.findMany({ where: { isActive: true } });
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [{ products, total, page, pageSize, skip }, categories] =
    await Promise.all([getProducts(searchParams), getCategories()]);

  const totalPages = Math.ceil(total / pageSize);
  const currentCategory = categories.find((c) => c.slug === searchParams.category);

  return (
    <div className={s.shopPage}>
      <div className={s.shopInner}>
        {/* Header */}
        <div className={s.shopHeader}>
          <h1>{currentCategory?.name ?? "All Products"}</h1>
          <p className={s.productCount}>{total} products</p>
        </div>

        <div className={s.shopLayout}>
          {/* Sidebar */}
          <aside className={s.sidebar}>
            <ShopFilters categories={categories as any} currentParams={searchParams} />
          </aside>

          {/* Main */}
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
                <p>No products found.</p>
                <a href="/shop">Clear filters</a>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={s.pagination}>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const params = new URLSearchParams();
                  if (searchParams.category) params.set("category", searchParams.category);
                  if (searchParams.sort) params.set("sort", searchParams.sort);
                  params.set("page", String(p));
                  return (
                    <a
                      key={p}
                      href={`/shop?${params.toString()}`}
                      className={`${s.pageBtn} ${page === p ? s.pageBtnActive : ""}`}
                    >
                      {p}
                    </a>
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
