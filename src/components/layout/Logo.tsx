// src/components/layout/Logo.tsx
// Lat Shop Logo — Cowrie shell mark + Playfair Display wordmark
// Usage:
//   <Logo />              — horizontal (navbar)
//   <Logo variant="stacked" /> — stacked (homepage hero, footer)
//   <Logo variant="icon" />    — icon only (favicon, small spaces)
//   <Logo dark />          — forces dark version (light bg)
//   <Logo light />         — forces light version (dark bg)

import Link from "next/link";

interface Props {
  variant?: "horizontal" | "stacked" | "icon";
  dark?: boolean;    // black text — use on light backgrounds
  light?: boolean;   // white text — use on dark backgrounds
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

export default function Logo({
  variant = "horizontal",
  dark = false,
  light = false,
  size = "md",
  href = "/",
  className = "",
}: Props) {
  // Color scheme
  const textColor   = dark ? "#1c0f05" : light ? "#f5ede0" : "#1c0f05";
  const goldColor   = "#d4832a";
  const subColor    = dark ? "#7a4010" : light ? "rgba(196,136,42,0.85)" : "#7a4010";
  const ruleColor   = dark ? "#c4882a50" : light ? "#c4882a80" : "#c4882a50";
  const dividerBg   = dark ? "#c4882a" : light ? "#c4882a" : "#c4882a";

  const sizes = {
    sm: { mark: 28, name: 22, sub: 8,  gap: 10 },
    md: { mark: 44, name: 32, sub: 10, gap: 16 },
    lg: { mark: 64, name: 48, sub: 12, gap: 22 },
  };
  const sz = sizes[size];

  // ── Cowrie Shell SVG Mark ────────────────────────────────────────────
  const CowrieMark = ({ size: s }: { size: number }) => (
    <svg width={s} height={s} viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer decorative ring */}
      <circle cx="44" cy="44" r="42" stroke={goldColor} strokeWidth="0.75" opacity="0.3"/>

      {/* Cowrie shell body */}
      <ellipse cx="44" cy="44" rx="18" ry="26" fill={goldColor} fillOpacity="0.12" stroke={goldColor} strokeWidth="1.2"/>

      {/* Shell interior spine */}
      <path d="M44 22 Q50 34 50 44 Q50 54 44 66 Q38 54 38 44 Q38 34 44 22Z"
            fill={goldColor} opacity="0.45"/>

      {/* Shell teeth at base */}
      <path d="M37 58 L40 62 L44 60 L48 62 L51 58"
            stroke={goldColor} strokeWidth="1.2" fill="none" strokeLinecap="round"/>

      {/* 4 radiating kente lines */}
      <line x1="44" y1="2"  x2="44" y2="16" stroke={goldColor} strokeWidth="1" opacity="0.6"/>
      <line x1="44" y1="72" x2="44" y2="86" stroke={goldColor} strokeWidth="1" opacity="0.6"/>
      <line x1="2"  y1="44" x2="16" y2="44" stroke={goldColor} strokeWidth="1" opacity="0.6"/>
      <line x1="72" y1="44" x2="86" y2="44" stroke={goldColor} strokeWidth="1" opacity="0.6"/>

      {/* Diamond tip arrows */}
      <polygon points="44,4 47,10 44,16 41,10"  fill={goldColor} opacity="0.75"/>
      <polygon points="44,84 47,78 44,72 41,78" fill={goldColor} opacity="0.75"/>
      <polygon points="4,44 10,41 16,44 10,47"  fill={goldColor} opacity="0.75"/>
      <polygon points="84,44 78,41 72,44 78,47" fill={goldColor} opacity="0.75"/>

      {/* Corner accent lines */}
      <line x1="16" y1="16" x2="24" y2="24" stroke={goldColor} strokeWidth="0.75" opacity="0.35"/>
      <line x1="72" y1="16" x2="64" y2="24" stroke={goldColor} strokeWidth="0.75" opacity="0.35"/>
      <line x1="16" y1="72" x2="24" y2="64" stroke={goldColor} strokeWidth="0.75" opacity="0.35"/>
      <line x1="72" y1="72" x2="64" y2="64" stroke={goldColor} strokeWidth="0.75" opacity="0.35"/>
    </svg>
  );

  // ── Kente Diamond ornament (used in stacked variant) ────────────────
  const KenteDiamonds = () => (
    <svg width="48" height="14" viewBox="0 0 48 14" fill="none">
      <path d="M4 7 L10 1 L16 7 L10 13Z"  fill={goldColor} opacity="0.85"/>
      <path d="M16 7 L22 1 L28 7 L22 13Z" fill="none" stroke={goldColor} strokeWidth="1" opacity="0.45"/>
      <path d="M28 7 L34 1 L40 7 L34 13Z" fill="none" stroke={goldColor} strokeWidth="1" opacity="0.45"/>
      <path d="M40 7 L46 1 L52 7 L46 13Z" fill={goldColor} opacity="0.85"/>
    </svg>
  );

  // ── Small cowrie divider (used in stacked variant) ──────────────────
  const CowrieDivider = () => (
    <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
      <ellipse cx="7" cy="10" rx="5.5" ry="8.5" fill="none" stroke={goldColor} strokeWidth="1"/>
      <path d="M7 2 Q10 6 10 10 Q10 14 7 18 Q4 14 4 10 Q4 6 7 2Z" fill={goldColor} opacity="0.4"/>
      <path d="M3 15.5 L5 17.5 L7 16.5 L9 17.5 L11 15.5"
            stroke={goldColor} strokeWidth="1" fill="none" strokeLinecap="round"/>
    </svg>
  );

  const inner = (
    <>
      {/* ── HORIZONTAL ── */}
      {variant === "horizontal" && (
        <span style={{ display: "flex", alignItems: "center", gap: sz.gap, textDecoration: "none" }}>
          <CowrieMark size={sz.mark} />
          <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: sz.name,
              fontWeight: 700,
              color: textColor,
              letterSpacing: "2px",
              lineHeight: 1,
            }}>
              L<em style={{ fontStyle: "italic", color: goldColor }}>a</em>t
            </span>
            <span style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: sz.sub,
              letterSpacing: "3px",
              color: subColor,
              textTransform: "uppercase",
            }}>
              African Gifts
            </span>
          </span>
        </span>
      )}

      {/* ── STACKED ── */}
      {variant === "stacked" && (
        <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <KenteDiamonds />
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: sz.name * 1.3,
            fontWeight: 400,
            color: textColor,
            letterSpacing: "10px",
            textTransform: "uppercase",
            lineHeight: 1,
          }}>
            L<em style={{ fontStyle: "italic", color: goldColor }}>a</em>t
          </span>

          {/* Divider with cowrie */}
          <span style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
            <span style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${dividerBg}40)` }} />
            <CowrieDivider />
            <span style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${dividerBg}40)` }} />
          </span>

          <span style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: sz.sub,
            letterSpacing: "5px",
            color: subColor,
            textTransform: "uppercase",
          }}>
            African Gifts &amp; Jewellery
          </span>
        </span>
      )}

      {/* ── ICON ONLY ── */}
      {variant === "icon" && <CowrieMark size={sz.mark} />}
    </>
  );

  return (
    <Link href={href} style={{ textDecoration: "none", display: "inline-flex" }} className={className}>
      {inner}
    </Link>
  );
}
