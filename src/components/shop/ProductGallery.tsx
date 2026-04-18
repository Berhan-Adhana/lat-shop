// src/components/shop/ProductGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  videoUrl?: string | null;
  productName: string;
  onSale?: boolean;
}

function getYouTubeId(url: string) {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match?.[1] ?? null;
}

export default function ProductGallery({ images, videoUrl, productName, onSale }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zoomed, setZoomed] = useState(false);

  const hasVideo = !!videoUrl;
  const ytId = videoUrl ? getYouTubeId(videoUrl) : null;
  const isVideoActive = showVideo && hasVideo;
  const activeImage = images[activeIndex] ?? null;
  const totalSlides = images.length + (hasVideo ? 1 : 0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handlePrev = () => {
    setShowVideo(false);
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setShowVideo(false);
    setActiveIndex((i) => (i + 1) % images.length);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

      {/* ── Main display ─────────────────────────────── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "100%", // 1:1 aspect ratio — reliable on all browsers
          borderRadius: 14,
          overflow: "hidden",
          background: "#faefd9",
          border: "1px solid #f4dbb0",
        }}
      >
        {/* Inner absolutely positioned container */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            cursor: isVideoActive ? "default" : zoomed ? "zoom-out" : "zoom-in",
          }}
          onMouseEnter={() => !isVideoActive && setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={() => !isVideoActive && setZoomed((z) => !z)}
        >
          {isVideoActive ? (
            // Video
            <div style={{ width: "100%", height: "100%", background: "#000" }}>
              {ytId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                  title={`${productName} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  allowFullScreen
                  style={{ width: "100%", height: "100%", border: "none" }}
                />
              ) : (
                <video
                  src={videoUrl!}
                  controls
                  autoPlay
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              )}
            </div>
          ) : activeImage ? (
            // Main image with zoom
            <Image
              key={activeImage} // force re-render when image changes
              src={activeImage}
              alt={`${productName} — image ${activeIndex + 1}`}
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{
                objectFit: "cover",
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: zoomed ? "scale(2.2)" : "scale(1)",
                transition: zoomed ? "none" : "transform 0.3s ease",
              }}
            />
          ) : (
            // Placeholder
            <div style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 64, color: "#ecc07f", fontFamily: "Georgia, serif", fontStyle: "italic",
            }}>
              L
            </div>
          )}
        </div>

        {/* Sale badge */}
        {onSale && !isVideoActive && (
          <span style={{
            position: "absolute", top: 14, left: 14, zIndex: 2,
            background: "#d4832a", color: "#fff",
            padding: "3px 12px", borderRadius: 4,
            fontSize: 12, fontWeight: 600, letterSpacing: "0.5px",
            fontFamily: "system-ui",
          }}>
            Sale
          </span>
        )}

        {/* Counter badge */}
        {totalSlides > 1 && !isVideoActive && (
          <div style={{
            position: "absolute", bottom: 12, left: 12, zIndex: 2,
            background: "rgba(26,18,9,0.65)", color: "#fdf8f0",
            fontSize: 11, padding: "4px 9px", borderRadius: 4,
            fontFamily: "system-ui", backdropFilter: "blur(4px)",
          }}>
            {activeIndex + 1} / {images.length}
          </div>
        )}

        {/* Zoom hint */}
        {!isVideoActive && activeImage && !zoomed && (
          <div style={{
            position: "absolute", bottom: 12, right: 12, zIndex: 2,
            background: "rgba(26,18,9,0.65)", color: "#fdf8f0",
            fontSize: 11, padding: "4px 9px", borderRadius: 4,
            fontFamily: "system-ui", backdropFilter: "blur(4px)",
          }}>
            🔍 Hover to zoom
          </div>
        )}

        {/* Prev / Next arrows — only when multiple images */}
        {images.length > 1 && !isVideoActive && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              aria-label="Previous image"
              style={{
                position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                zIndex: 3, width: 34, height: 34, borderRadius: "50%",
                background: "rgba(26,18,9,0.55)", border: "none",
                color: "#fdf8f0", fontSize: 16, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(4px)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212,131,42,0.85)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(26,18,9,0.55)")}
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              aria-label="Next image"
              style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                zIndex: 3, width: 34, height: 34, borderRadius: "50%",
                background: "rgba(26,18,9,0.55)", border: "none",
                color: "#fdf8f0", fontSize: 16, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(4px)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212,131,42,0.85)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(26,18,9,0.55)")}
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* ── Thumbnail strip ──────────────────────────── */}
      {totalSlides > 1 && (
        <div style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 4,
          scrollbarWidth: "none",
        }}>
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => { setActiveIndex(i); setShowVideo(false); setZoomed(false); }}
              aria-label={`View image ${i + 1}`}
              style={{
                // ── position: relative is REQUIRED for Next.js fill images ──
                position: "relative",
                width: 72,
                height: 72,
                flexShrink: 0,
                borderRadius: 8,
                overflow: "hidden",
                border: `2px solid ${!showVideo && activeIndex === i ? "#d4832a" : "#f4dbb0"}`,
                padding: 0,
                cursor: "pointer",
                background: "#faefd9",
                transition: "border-color 0.15s, transform 0.15s",
                transform: !showVideo && activeIndex === i ? "scale(1.05)" : "scale(1)",
                outline: "none",
              }}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                sizes="72px"
                style={{ objectFit: "cover" }}
              />
            </button>
          ))}

          {/* Video thumbnail */}
          {hasVideo && (
            <button
              onClick={() => { setShowVideo(true); setZoomed(false); }}
              aria-label="Play video"
              style={{
                position: "relative",
                width: 72,
                height: 72,
                flexShrink: 0,
                borderRadius: 8,
                overflow: "hidden",
                border: `2px solid ${showVideo ? "#d4832a" : "#f4dbb0"}`,
                padding: 0,
                cursor: "pointer",
                background: "#1a1209",
                transition: "border-color 0.15s, transform 0.15s",
                transform: showVideo ? "scale(1.05)" : "scale(1)",
                outline: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {ytId && (
                <Image
                  src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                  alt="Video thumbnail"
                  fill
                  sizes="72px"
                  style={{ objectFit: "cover", opacity: 0.55 }}
                />
              )}
              {/* Play icon overlay */}
              <div style={{
                position: "absolute",
                width: 30, height: 30, borderRadius: "50%",
                background: "rgba(212,131,42,0.92)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, color: "#fff", zIndex: 1,
              }}>
                ▶
              </div>
            </button>
          )}
        </div>
      )}

      {/* ── Dot indicators (mobile swipe hint) ────────── */}
      {totalSlides > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 5 }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActiveIndex(i); setShowVideo(false); }}
              style={{
                width: activeIndex === i && !showVideo ? 18 : 7,
                height: 7,
                borderRadius: 4,
                background: activeIndex === i && !showVideo ? "#d4832a" : "#ecc07f",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            />
          ))}
          {hasVideo && (
            <button
              onClick={() => setShowVideo(true)}
              style={{
                width: showVideo ? 18 : 7,
                height: 7,
                borderRadius: 4,
                background: showVideo ? "#d4832a" : "#ecc07f",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
