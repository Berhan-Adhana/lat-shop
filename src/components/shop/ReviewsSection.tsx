// src/components/shop/ReviewsSection.tsx
"use client";

import { useState } from "react";
import ReviewForm from "./ReviewForm";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: { id: string; name: string; image?: string };
}

interface Props {
  productId: string;
  initialReviews: Review[];
  avgRating: number;
}

export default function ReviewsSection({ productId, initialReviews, avgRating }: Props) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const reload = () => {
    fetch(`/api/products/${productId}/reviews`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setReviews(data); })
      .catch(() => {});
  };

  const avg = reviews.length
    ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
    : avgRating;

  return (
    <section style={{ paddingTop: 40, borderTop: "1px solid #f4dbb0" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 24, color: "#1a1209", fontFamily: "Georgia, serif", fontWeight: 400 }}>
          Customer Reviews
        </h2>
        {reviews.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex" }}>
              {[1,2,3,4,5].map((s) => (
                <span key={s} style={{ fontSize: 20, color: s <= Math.round(avg) ? "#d4832a" : "#e0c9ad" }}>★</span>
              ))}
            </div>
            <span style={{ fontSize: 15, color: "#3d2b14", fontFamily: "system-ui" }}>
              {avg.toFixed(1)} out of 5 ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
            </span>
          </div>
        )}
      </div>

      {/* Rating breakdown */}
      {reviews.length > 0 && (
        <div style={{ marginBottom: 32, maxWidth: 320 }}>
          {[5,4,3,2,1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#7a3f1d", width: 40, fontFamily: "system-ui", flexShrink: 0 }}>
                  {star} ★
                </span>
                <div style={{ flex: 1, height: 8, background: "#f4dbb0", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "#d4832a", borderRadius: 4, transition: "width 0.3s" }} />
                </div>
                <span style={{ fontSize: 12, color: "#b86820", width: 20, fontFamily: "system-ui", flexShrink: 0 }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <div style={{ padding: "32px 0", textAlign: "center", color: "#7a3f1d", fontFamily: "system-ui" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
          <p style={{ fontSize: 15, marginBottom: 4 }}>No reviews yet</p>
          <p style={{ fontSize: 13, color: "#b86820" }}>Be the first to share your experience</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
          {reviews.map((review) => (
            <div key={review.id} style={{
              background: "#fff", border: "1px solid #f4dbb0", borderRadius: 10, padding: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "linear-gradient(135deg, #d4832a, #b86820)",
                  color: "#fdf8f0", fontSize: 15, fontWeight: 600,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "system-ui", flexShrink: 0,
                }}>
                  {review.user.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1209", fontFamily: "system-ui" }}>
                    {review.user.name}
                  </p>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} style={{ fontSize: 14, color: s <= review.rating ? "#d4832a" : "#e0c9ad" }}>★</span>
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: 12, color: "#b86820", fontFamily: "system-ui" }}>
                  {new Date(review.createdAt).toLocaleDateString("en-CA", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </span>
              </div>
              {review.comment && (
                <p style={{ fontSize: 14, color: "#3d2b14", lineHeight: 1.7, fontFamily: "system-ui" }}>
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Write a review */}
      <ReviewForm productId={productId} onSubmitted={reload} />
    </section>
  );
}
