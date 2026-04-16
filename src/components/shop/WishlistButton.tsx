// src/components/shop/WishlistButton.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function WishlistButton({ productId }: { productId: string }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!isAuthenticated) {
      router.push("/login?callbackUrl=/account/wishlist");
      return;
    }
    setLoading(true);
    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      setSaved(true);
      toast.success("Added to wishlist ❤️");
    } catch {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || saved}
      aria-label="Add to wishlist"
      style={{
        width: 40, height: 40, borderRadius: "50%",
        background: saved ? "#fee2e2" : "#fff",
        border: `1.5px solid ${saved ? "#fca5a5" : "#ecc07f"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: saved ? "default" : "pointer",
        fontSize: 18, transition: "all 0.2s",
        flexShrink: 0,
      }}
    >
      {saved ? "❤️" : "🤍"}
    </button>
  );
}
