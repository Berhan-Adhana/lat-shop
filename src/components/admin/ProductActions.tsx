// src/components/admin/ProductActions.tsx
"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import s from "@/app/admin/admin.module.css";

export default function ProductActions({ productId }: { productId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Product deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <button onClick={handleDelete} className={`${s.btnDanger} ${s.btnSm}`}>
      Delete
    </button>
  );
}
