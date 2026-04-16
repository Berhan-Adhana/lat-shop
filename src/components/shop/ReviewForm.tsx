// src/components/shop/ReviewForm.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  productId: string;
  onSubmitted: () => void;
}

export default function ReviewForm({ productId, onSubmitted }: Props) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "20px 0", borderTop: "1px solid #f4dbb0" }}>
        <p style={{ fontSize: 14, color: "#7a3f1d", fontFamily: "system-ui" }}>
          <button
            onClick={() => router.push("/login")}
            style={{ color: "#d4832a", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14 }}
          >
            Sign in
          </button>{" "}
          to leave a review.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { toast.error("Please select a star rating"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      toast.success("Review submitted! Thank you.");
      setRating(0);
      setComment("");
      onSubmitted();
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ paddingTop: 24, borderTop: "1px solid #f4dbb0", marginTop: 8 }}>
      <h3 style={{ fontSize: 16, fontFamily: "Georgia, serif", fontWeight: 400, color: "#1a1209", marginBottom: 16 }}>
        Write a Review
      </h3>

      {/* Star picker */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 32, padding: 2, transition: "transform 0.1s",
              transform: hover >= star || rating >= star ? "scale(1.1)" : "scale(1)",
            }}
          >
            <span style={{ color: (hover || rating) >= star ? "#d4832a" : "#e0c9ad" }}>★</span>
          </button>
        ))}
        {rating > 0 && (
          <span style={{ fontSize: 13, color: "#7a3f1d", alignSelf: "center", marginLeft: 8, fontFamily: "system-ui" }}>
            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
          </span>
        )}
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product (optional)..."
        rows={4}
        style={{
          width: "100%", padding: "12px 14px", border: "1.5px solid #ecc07f",
          borderRadius: 8, fontSize: 14, fontFamily: "system-ui, sans-serif",
          color: "#1a1209", resize: "vertical", outline: "none",
          transition: "border-color 0.2s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#d4832a")}
        onBlur={(e) => (e.target.style.borderColor = "#ecc07f")}
      />

      <button
        type="submit"
        disabled={submitting || rating === 0}
        style={{
          marginTop: 12, padding: "11px 24px",
          background: rating > 0 ? "linear-gradient(135deg, #d4832a, #b86820)" : "#e5e7eb",
          color: rating > 0 ? "#fdf8f0" : "#9ca3af",
          border: "none", borderRadius: 7, fontSize: 15,
          fontFamily: "Georgia, serif", cursor: rating > 0 ? "pointer" : "not-allowed",
          transition: "opacity 0.2s",
        }}
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>

      <p style={{ fontSize: 12, color: "#b86820", marginTop: 8, fontFamily: "system-ui" }}>
        You can only review products you have purchased.
      </p>
    </form>
  );
}
