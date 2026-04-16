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
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const hasVideo = !!videoUrl;
  const ytId = videoUrl ? getYouTubeId(videoUrl) : null;
  const totalSlides = images.length + (hasVideo ? 1 : 0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const activeImage = images[activeIndex];
  const isVideoActive = showVideo && hasVideo;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* ── Main image / video ── */}
      <div
        style={{
          position: "relative",
          aspectRatio: "1",
          borderRadius: 16,
          overflow: "hidden",
          background: "#faefd9",
          border: "1px solid #f4dbb0",
          cursor: isVideoActive ? "default" : zoomed ? "zoom-out" : "zoom-in",
        }}
        onMouseEnter={() => !isVideoActive && setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
        onClick={() => !isVideoActive && setZoomed(!zoomed)}
      >
        {isVideoActive ? (
          // ── Video player ──
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
          // ── Zoomable image ──
          <div
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <Image
              src={activeImage}
              alt={`${productName} — image ${activeIndex + 1}`}
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{
                objectFit: "cover",
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: zoomed ? "scale(2)" : "scale(1)",
                transition: zoomed ? "none" : "transform 0.3s ease",
              }}
            />
          </div>
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, color: "#ecc07f", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
            L
          </div>
        )}

        {/* Sale badge */}
        {onSale && !isVideoActive && (
          <span style={{
            position: "absolute", top: 16, left: 16,
            background: "#d4832a", color: "#fff",
            padding: "4px 12px", borderRadius: 4,
            fontSize: 13, fontWeight: 600, letterSpacing: "0.5px",
          }}>
            Sale
          </span>
        )}

        {/* Zoom hint */}
        {!isVideoActive && activeImage && !zoomed && (
          <div style={{
            position: "absolute", bottom: 12, right: 12,
            background: "rgba(26,18,9,0.6)", color: "#fdf8f0",
            fontSize: 11, padding: "4px 8px", borderRadius: 4,
            fontFamily: "system-ui", letterSpacing: "0.5px",
            backdropFilter: "blur(4px)",
          }}>
            🔍 Hover to zoom
          </div>
        )}

        {/* Image counter */}
        {totalSlides > 1 && (
          <div style={{
            position: "absolute", bottom: 12, left: 12,
            background: "rgba(26,18,9,0.6)", color: "#fdf8f0",
            fontSize: 11, padding: "4px 8px", borderRadius: 4,
            fontFamily: "system-ui", backdropFilter: "blur(4px)",
          }}>
            {isVideoActive ? "▶ Video" : `${activeIndex + 1} / ${images.length}`}
          </div>
        )}
      </div>

      {/* ── Thumbnail strip ── */}
      {totalSlides > 1 && (
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => { setActiveIndex(i); setShowVideo(false); setZoomed(false); }}
              aria-label={`View image ${i + 1}`}
              style={{
                width: 72, height: 72, borderRadius: 8, overflow: "hidden",
                position: "relative", flexShrink: 0, padding: 0,
                border: `2px solid ${!showVideo && activeIndex === i ? "#d4832a" : "#f4dbb0"}`,
                cursor: "pointer", background: "#faefd9",
                transition: "border-color 0.2s, transform 0.15s",
                transform: !showVideo && activeIndex === i ? "scale(1.04)" : "scale(1)",
              }}
            >
              <Image
                src={img}
                alt={`Thumbnail ${i + 1}`}
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
                width: 72, height: 72, borderRadius: 8, overflow: "hidden",
                flexShrink: 0, padding: 0,
                border: `2px solid ${showVideo ? "#d4832a" : "#f4dbb0"}`,
                cursor: "pointer", background: "#1a1209",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: 4,
                transition: "border-color 0.2s",
                transform: showVideo ? "scale(1.04)" : "scale(1)",
              }}
            >
              {ytId ? (
                <Image
                  src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                  alt="Video thumbnail"
                  fill
                  sizes="72px"
                  style={{ objectFit: "cover", opacity: 0.7 }}
                />
              ) : null}
              <div style={{
                position: "absolute",
                width: 28, height: 28, borderRadius: "50%",
                background: "rgba(212,131,42,0.9)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12,
              }}>
                ▶
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
