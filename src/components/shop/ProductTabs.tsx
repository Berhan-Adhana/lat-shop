// src/components/shop/ProductTabs.tsx
"use client";

import { useState } from "react";

interface Props {
  description: string;
  materials?: string | null;
  careInfo?: string | null;
  dimensions?: string | null;
  weight?: string | null;
  origin?: string | null;
  isHandmade?: boolean;
}

const tabs = [
  { id: "overview",  label: "Overview" },
  { id: "details",   label: "Materials & Care" },
  { id: "shipping",  label: "Shipping & Returns" },
];

export default function ProductTabs({
  description, materials, careInfo, dimensions, weight, origin, isHandmade,
}: Props) {
  const [active, setActive] = useState("overview");

  return (
    <div style={{ marginTop: 4 }}>
      {/* Tab bar */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid #f4dbb0",
        marginBottom: 20,
        gap: 0,
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              padding: "10px 18px",
              fontSize: 13,
              fontFamily: "system-ui, sans-serif",
              fontWeight: active === tab.id ? 600 : 400,
              color: active === tab.id ? "#d4832a" : "#7a3f1d",
              background: "none",
              border: "none",
              borderBottom: active === tab.id ? "2px solid #d4832a" : "2px solid transparent",
              cursor: "pointer",
              transition: "color 0.2s",
              marginBottom: -1,
              letterSpacing: "0.3px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}

      {/* ── Overview ── */}
      {active === "overview" && (
        <div style={{ animation: "fadeIn 0.2s ease" }}>
          <p style={{ fontSize: 15, color: "#3d2b14", lineHeight: 1.85, fontFamily: "system-ui, sans-serif" }}>
            {description}
          </p>

          {/* Quick specs row */}
          {(origin || isHandmade || dimensions || weight) && (
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20,
              paddingTop: 20, borderTop: "1px solid #faefd9",
            }}>
              {isHandmade && (
                <Chip icon="🤲" label="Handcrafted" />
              )}
              {origin && (
                <Chip icon="📍" label={`Origin: ${origin}`} />
              )}
              {dimensions && (
                <Chip icon="📐" label={dimensions} />
              )}
              {weight && (
                <Chip icon="⚖️" label={weight} />
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Materials & Care ── */}
      {active === "details" && (
        <div style={{ animation: "fadeIn 0.2s ease", display: "flex", flexDirection: "column", gap: 20 }}>
          {materials ? (
            <DetailBlock
              icon="🧵"
              title="Materials"
              content={materials}
            />
          ) : (
            <p style={{ fontSize: 14, color: "#b86820", fontFamily: "system-ui", fontStyle: "italic" }}>
              Material details will be added soon.
            </p>
          )}

          {careInfo && (
            <DetailBlock
              icon="✨"
              title="Care Instructions"
              content={careInfo}
            />
          )}

          {(dimensions || weight || origin) && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 18 }}>📋</span>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: "#1a1209", fontFamily: "system-ui" }}>
                  Specifications
                </h4>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid #f4dbb0", borderRadius: 10, overflow: "hidden" }}>
                {[
                  origin     && { label: "Country of Origin", value: origin },
                  dimensions && { label: "Dimensions",        value: dimensions },
                  weight     && { label: "Weight",            value: weight },
                  { label: "Handcrafted", value: isHandmade ? "Yes — made by hand" : "Machine made" },
                ].filter(Boolean).map((row: any, i, arr) => (
                  <div key={row.label} style={{
                    display: "flex",
                    padding: "11px 16px",
                    background: i % 2 === 0 ? "#fdf8f0" : "#fff",
                    borderBottom: i < arr.length - 1 ? "1px solid #faefd9" : "none",
                  }}>
                    <span style={{ fontSize: 13, color: "#7a3f1d", fontFamily: "system-ui", width: 160, flexShrink: 0 }}>
                      {row.label}
                    </span>
                    <span style={{ fontSize: 13, color: "#1a1209", fontFamily: "system-ui", fontWeight: 500 }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Shipping & Returns ── */}
      {active === "shipping" && (
        <div style={{ animation: "fadeIn 0.2s ease", display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            {
              icon: "🇨🇦",
              title: "Canada",
              desc: "CA$12 flat rate · Free over CA$100 · 3–7 business days via Canada Post",
            },
            {
              icon: "🇺🇸",
              title: "United States",
              desc: "CA$18 flat rate · Free over CA$150 · 7–14 business days",
            },
            {
              icon: "🇪🇺",
              title: "Europe",
              desc: "CA$30 flat rate · Free over CA$200 · 10–21 business days",
            },
          ].map((zone) => (
            <div key={zone.title} style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              padding: "14px 16px", background: "#fdf8f0",
              border: "1px solid #f4dbb0", borderRadius: 10,
            }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{zone.icon}</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1209", fontFamily: "system-ui", marginBottom: 3 }}>
                  {zone.title}
                </p>
                <p style={{ fontSize: 13, color: "#7a3f1d", fontFamily: "system-ui", lineHeight: 1.5 }}>
                  {zone.desc}
                </p>
              </div>
            </div>
          ))}

          <div style={{
            padding: "14px 16px",
            background: "#faefd9",
            border: "1px solid #ecc07f",
            borderRadius: 10,
            fontSize: 13,
            color: "#3d2b14",
            fontFamily: "system-ui",
            lineHeight: 1.6,
          }}>
            <strong style={{ display: "block", marginBottom: 4 }}>↩️ 30-Day Returns</strong>
            Not happy? Return unused items within 30 days for a full refund.{" "}
            <a href="/returns" style={{ color: "#d4832a", textDecoration: "none" }}>
              Full return policy →
            </a>
          </div>

          <div style={{
            padding: "14px 16px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 10,
            fontSize: 13,
            color: "#166534",
            fontFamily: "system-ui",
            lineHeight: 1.6,
          }}>
            <strong>📦 All orders ship from Calgary, Canada</strong>
            <br />Orders are packed within 1–2 business days. Tracking included.
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────
function Chip({ icon, label }: { icon: string; label: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 12px", background: "#faefd9",
      border: "1px solid #ecc07f", borderRadius: 20,
      fontSize: 13, color: "#3d2b14", fontFamily: "system-ui",
    }}>
      {icon} {label}
    </span>
  );
}

function DetailBlock({ icon, title, content }: { icon: string; title: string; content: string }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: "#1a1209", fontFamily: "system-ui" }}>
          {title}
        </h4>
      </div>
      <p style={{
        fontSize: 14, color: "#3d2b14", lineHeight: 1.8,
        fontFamily: "system-ui", paddingLeft: 26,
        whiteSpace: "pre-line",
      }}>
        {content}
      </p>
    </div>
  );
}
