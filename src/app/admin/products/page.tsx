// src/app/admin/products/page.tsx
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/db/prisma";
import ProductActions from "@/components/admin/ProductActions";
import s from "../admin.module.css";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Products</h1>
          <p className={s.pageSubtitle}>{products.length} total products</p>
        </div>
        <Link href="/admin/products/new" className={s.btnPrimary}>+ Add Product</Link>
      </div>

      <div className={s.tableWrap}>
        <div className={s.tableHeader}>
          <span className={s.tableTitle}>All Products</span>
        </div>
        {products.length === 0 ? (
          <div className={s.emptyState}>
            <p>No products yet.</p>
            <Link href="/admin/products/new" className={s.btnPrimary}>Add your first product</Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 8, background: "#faefd9", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#ecc07f" }}>L</div>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{product.name}</div>
                          <div style={{ fontSize: 12, color: "#7a3f1d", fontFamily: "monospace" }}>{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>{product.category?.name ?? "—"}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#d4832a" }}>CA${product.price.toFixed(2)}</div>
                      {product.onSale && product.salePrice && (
                        <div style={{ fontSize: 12, color: "#22c55e" }}>Sale: CA${product.salePrice.toFixed(2)}</div>
                      )}
                    </td>
                    <td>
                      <span style={{ color: product.stock === 0 ? "#dc2626" : product.stock <= 5 ? "#f97316" : "#22c55e", fontWeight: 600 }}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <span className={`${s.badge} ${product.isActive ? s.badgeActive : s.badgeInactive}`}>
                        {product.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td>{product.featured ? "⭐ Yes" : "—"}</td>
                    <td>
                      <div className={s.actions}>
                        <Link href={`/admin/products/${product.id}`} className={`${s.btnSecondary} ${s.btnSm}`}>Edit</Link>
                        <ProductActions productId={product.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
