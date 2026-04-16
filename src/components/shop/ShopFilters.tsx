// src/components/shop/ShopFilters.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import type { Category } from "@/types";
import s from "./ShopFilters.module.css";

interface Props {
  categories: Category[];
  currentParams: { category?: string; sort?: string; min?: string; max?: string };
}

export default function ShopFilters({ categories, currentParams }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams();
    if (currentParams.category) params.set("category", currentParams.category);
    if (currentParams.sort) params.set("sort", currentParams.sort);
    if (currentParams.min) params.set("min", currentParams.min);
    if (currentParams.max) params.set("max", currentParams.max);
    if (value === null) { params.delete(key); } else { params.set(key, value); }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={s.filters}>
      <div className={s.filterGroup}>
        <h3 className={s.filterTitle}>Categories</h3>
        <div className={s.filterList}>
          <button
            className={`${s.filterItem} ${!currentParams.category ? s.filterItemActive : ""}`}
            onClick={() => updateFilter("category", null)}
          >All Products</button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${s.filterItem} ${currentParams.category === cat.slug ? s.filterItemActive : ""}`}
              onClick={() => updateFilter("category", cat.slug)}
            >{cat.name}</button>
          ))}
        </div>
      </div>

      <div className={s.filterGroup}>
        <h3 className={s.filterTitle}>Price Range</h3>
        <div className={s.priceInputs}>
          <div className={s.priceField}>
            <label>Min</label>
            <input type="number" placeholder="CA$0" defaultValue={currentParams.min ?? ""}
              onBlur={(e) => updateFilter("min", e.target.value || null)} />
          </div>
          <span className={s.priceSep}>—</span>
          <div className={s.priceField}>
            <label>Max</label>
            <input type="number" placeholder="Any" defaultValue={currentParams.max ?? ""}
              onBlur={(e) => updateFilter("max", e.target.value || null)} />
          </div>
        </div>
        <div className={s.quickPrices}>
          {[
            { label: "Under $25", min: "", max: "25" },
            { label: "$25 – $50", min: "25", max: "50" },
            { label: "$50 – $100", min: "50", max: "100" },
            { label: "Over $100", min: "100", max: "" },
          ].map((range) => (
            <button key={range.label} className={s.quickPrice}
              onClick={() => { updateFilter("min", range.min || null); updateFilter("max", range.max || null); }}>
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {(currentParams.category || currentParams.min || currentParams.max) && (
        <button className={s.clearBtn} onClick={() => router.push(pathname)}>
          Clear All Filters
        </button>
      )}
    </div>
  );
}
