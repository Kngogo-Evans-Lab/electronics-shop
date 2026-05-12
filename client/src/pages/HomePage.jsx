// FILE: src/pages/HomePage.jsx
// Jumia-inspired layout: top promo bar, navbar, category sidebar + hero banner,
// quick-category icon row (3D rotating cubes), flash sale, featured products — Vantix indigo palette

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { products, flashSaleProducts, CATEGORIES } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useApp } from "../context/AppContext";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  indigo:      "#3730a3",
  indigoDark:  "#1e1b4b",
  indigoMid:   "#4f46e5",
  indigoLight: "#e0e7ff",
  amber:       "#f59e0b",
  amberDark:   "#d97706",
  red:         "#dc2626",
  white:       "#ffffff",
  gray50:      "#f9fafb",
  gray100:     "#f3f4f6",
  gray200:     "#e5e7eb",
  gray400:     "#9ca3af",
  gray600:     "#4b5563",
  gray900:     "#111827",
};

// ─── Global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  html, body { overflow-x: hidden; width: 100%; }

  .vx-page { width: 100%; max-width: 100%; overflow-x: hidden; background: #f3f4f6; }

  .vx-spacer { height: 40px; }
  @media (min-width: 768px) { .vx-spacer { height: 40px; } }

  @keyframes vxTicker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .vx-ticker-wrap { overflow: hidden; white-space: nowrap; }
  .vx-ticker      { display: inline-block; animation: vxTicker 22s linear infinite; }

  @keyframes vxFlip {
    0%   { transform: rotateX(0deg);  }
    50%  { transform: rotateX(90deg); }
    100% { transform: rotateX(0deg);  }
  }
  .vx-flip { animation: vxFlip 1s ease; }

  @keyframes vxHeroIn {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .vx-hero-slide { animation: vxHeroIn 0.42s ease; }

  .vx-pcard { transition: box-shadow 0.18s, transform 0.18s; }
  .vx-pcard:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(55,48,163,0.13); }

  .vx-pad { padding-left: 12px; padding-right: 12px; }
  @media (min-width: 640px)  { .vx-pad { padding-left: 20px; padding-right: 20px; } }
  @media (min-width: 1024px) { .vx-pad { padding-left: 32px; padding-right: 32px; } }
  @media (min-width: 1280px) { .vx-pad { padding-left: 48px; padding-right: 48px; } }

  .vx-flash-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 8px;
  }
  @media (min-width: 480px) { .vx-flash-grid { grid-template-columns: repeat(3, minmax(0,1fr)); } }
  @media (min-width: 768px) { .vx-flash-grid { grid-template-columns: repeat(5, minmax(0,1fr)); gap:12px; } }

  .vx-feat-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 8px;
  }
  @media (min-width: 480px) { .vx-feat-grid { grid-template-columns: repeat(3, minmax(0,1fr)); } }
  @media (min-width: 768px) { .vx-feat-grid { grid-template-columns: repeat(4, minmax(0,1fr)); gap:12px; } }
  @media (min-width: 1024px){ .vx-feat-grid { grid-template-columns: repeat(5, minmax(0,1fr)); } }
  @media (min-width: 1280px){ .vx-feat-grid { grid-template-columns: repeat(6, minmax(0,1fr)); } }

  /* ── Quick cats: centered ── */
  .vx-qcat {
    display: flex;
    gap: 24px;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  @keyframes neonPulse {
    0%,100% { box-shadow: 0 0 4px #00f5ff,0 0 10px #00f5ff,0 0 20px #00f5ff; }
    50%      { box-shadow: 0 0 6px #00f5ff,0 0 18px #00f5ff,0 0 36px #00f5ff; }
  }
  .vx-neon-av { animation: neonPulse 2s ease-in-out infinite; border: 2px solid #00f5ff; }

  /* ── Trust strip: slim glowing pills ── */
  .vx-trust { display: grid; grid-template-columns: repeat(2,1fr); gap: 8px; }
  @media (min-width:640px) { .vx-trust { grid-template-columns: repeat(4,1fr); gap: 10px; } }

  @keyframes trustGlow1 {
    0%,100% { box-shadow: 0 0 6px rgba(99,102,241,0.5), 0 0 18px rgba(99,102,241,0.3); }
    50%     { box-shadow: 0 0 10px rgba(99,102,241,0.8), 0 0 28px rgba(99,102,241,0.5); }
  }
  @keyframes trustGlow2 {
    0%,100% { box-shadow: 0 0 6px rgba(16,185,129,0.5), 0 0 18px rgba(16,185,129,0.3); }
    50%     { box-shadow: 0 0 10px rgba(16,185,129,0.8), 0 0 28px rgba(16,185,129,0.5); }
  }
  @keyframes trustGlow3 {
    0%,100% { box-shadow: 0 0 6px rgba(245,158,11,0.5), 0 0 18px rgba(245,158,11,0.3); }
    50%     { box-shadow: 0 0 10px rgba(245,158,11,0.8), 0 0 28px rgba(245,158,11,0.5); }
  }
  @keyframes trustGlow4 {
    0%,100% { box-shadow: 0 0 6px rgba(220,38,38,0.5), 0 0 18px rgba(220,38,38,0.3); }
    50%     { box-shadow: 0 0 10px rgba(220,38,38,0.8), 0 0 28px rgba(220,38,38,0.5); }
  }
  .trust-glow-1 { animation: trustGlow1 2.4s ease-in-out infinite; border: 1px solid rgba(99,102,241,0.45) !important; }
  .trust-glow-2 { animation: trustGlow2 2.4s ease-in-out infinite 0.3s; border: 1px solid rgba(16,185,129,0.45) !important; }
  .trust-glow-3 { animation: trustGlow3 2.4s ease-in-out infinite 0.6s; border: 1px solid rgba(245,158,11,0.45) !important; }
  .trust-glow-4 { animation: trustGlow4 2.4s ease-in-out infinite 0.9s; border: 1px solid rgba(220,38,38,0.45) !important; }

  .vx-sidebar { display: none; }
  @media (min-width: 900px) { .vx-sidebar { display: block; } }

  .vx-hero-layout { display: grid; grid-template-columns: 1fr; }
  @media (min-width: 900px) { .vx-hero-layout { grid-template-columns: 210px 1fr 200px; gap: 0; } }

  .vx-subbanner { display: none; }
  @media (min-width: 900px) { .vx-subbanner { display: flex; } }

  /* ══ 3D Cube — 48px ══ */
  .cube-scene {
    width: 48px;
    height: 48px;
    perspective: 110px;
  }
  .cube {
    width: 48px;
    height: 48px;
    position: relative;
    transform-style: preserve-3d;
    animation: cubeRotate 7s linear infinite;
  }
  .cube-scene:hover .cube {
    animation-play-state: paused;
    filter: brightness(1.1);
  }
  @keyframes cubeRotate {
    0%   { transform: rotateX(-18deg) rotateY(0deg); }
    100% { transform: rotateX(-18deg) rotateY(360deg); }
  }
  .cube-face {
    position: absolute;
    width: 48px;
    height: 48px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid rgba(255,255,255,0.35);
    box-shadow: inset 0 0 8px rgba(0,0,0,0.2);
  }
  .cube-face img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  /* half of 48px = 24px */
  .face-front  { transform: rotateY(  0deg) translateZ(24px); }
  .face-back   { transform: rotateY(180deg) translateZ(24px); }
  .face-right  { transform: rotateY( 90deg) translateZ(24px); }
  .face-left   { transform: rotateY(-90deg) translateZ(24px); }
  .face-top    { transform: rotateX( 90deg) translateZ(24px); }
  .face-bottom { transform: rotateX(-90deg) translateZ(24px); }

  .vx-cat-label {
    font-size: 10.5px;
    font-weight: 700;
    color: #374151;
    text-align: center;
    line-height: 1.2;
    white-space: nowrap;
    margin-top: 2px;
  }

  /* ── Live Search Dropdown ── */
  .vx-search-drop {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 12px 40px rgba(55,48,163,0.18);
    border: 1.5px solid #e0e7ff;
    z-index: 9999;
    max-height: 420px;
    overflow-y: auto;
  }
  .vx-search-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    cursor: pointer;
    border-bottom: 1px solid #f3f4f6;
    text-decoration: none;
    transition: background 0.12s;
  }
  .vx-search-item:hover { background: #e0e7ff; }
  .vx-search-item:last-child { border-bottom: none; }
`;

// ─── Countdown ────────────────────────────────────────────────────────────────
function Countdown() {
  const [t, setT] = useState({ h: 5, m: 43, s: 22 });
  useEffect(() => {
    const id = setInterval(() => setT(({ h, m, s }) => {
      if (--s < 0) { s = 59; if (--m < 0) { m = 59; if (--h < 0) h = 23; } }
      return { h, m, s };
    }), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = n => String(n).padStart(2, "0");
  const Seg = ({ v }) => (
    <span style={{
      background: "#2d2a6e", color: C.white, fontWeight: 800,
      fontSize: 15, padding: "3px 7px", borderRadius: 5, minWidth: 30,
      textAlign: "center", fontFamily: "monospace",
    }}>{v}</span>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <Seg v={pad(t.h)} />
      <span style={{ color: C.white, fontWeight: 800, fontSize: 16 }}>:</span>
      <Seg v={pad(t.m)} />
      <span style={{ color: C.white, fontWeight: 800, fontSize: 16 }}>:</span>
      <Seg v={pad(t.s)} />
    </div>
  );
}

// ─── Hero slides ──────────────────────────────────────────────────────────────
const SLIDES = [
  {
    tag: "🔥 Trending Now",
    title: "Smartphones & Accessories",
    sub: "Starting from",
    price: "KES 5,000",
    cta: "Shop Now",
    ctaLink: "/products?category=phones",
    bg: `linear-gradient(135deg, ${C.indigoDark} 0%, ${C.indigo} 55%, #6366f1 100%)`,
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=480&q=85",
    accent: C.amber,
  },
  {
    tag: "💻 New Arrivals",
    title: "MacBooks & Laptops",
    sub: "Up to",
    price: "20% Off",
    cta: "View Deals",
    ctaLink: "/products?category=laptops",
    bg: `linear-gradient(135deg, #111827 0%, #1e3a5f 55%, #1a3a8f 100%)`,
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=480&q=85",
    accent: "#38bdf8",
  },
  {
    tag: "🎧 Audio Week",
    title: "Premium Headphones & Earbuds",
    sub: "Deals from",
    price: "KES 2,500",
    cta: "Shop Audio",
    ctaLink: "/products?category=audio",
    bg: `linear-gradient(135deg, #1e1b4b 0%, #4c1d95 55%, #7c3aed 100%)`,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=480&q=85",
    accent: "#a78bfa",
  },
];

function HeroBanner() {
  const [cur, setCur] = useState(0);
  const [key, setKey] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCur(c => (c + 1) % SLIDES.length);
      setKey(k => k + 1);
    }, 4500);
    return () => clearInterval(id);
  }, []);
  const s = SLIDES[cur];
  return (
    <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", height: 280 }}>
      <div key={key} className="vx-hero-slide" style={{
        background: s.bg, height: "100%", display: "flex",
        alignItems: "center", padding: "20px 24px", position: "relative",
      }}>
        <div style={{ flex: 1, zIndex: 2, position: "relative" }}>
          <span style={{
            background: "rgba(255,255,255,0.15)", color: C.white,
            fontSize: 11, fontWeight: 700, padding: "3px 10px",
            borderRadius: 20, display: "inline-block", marginBottom: 10,
          }}>{s.tag}</span>
          <h2 style={{
            color: C.white, fontWeight: 900, fontSize: "clamp(18px,3.5vw,28px)",
            lineHeight: 1.15, marginBottom: 10, maxWidth: 280,
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}>{s.title}</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 4 }}>{s.sub}</p>
          <p style={{ color: s.accent, fontWeight: 900, fontSize: 26, marginBottom: 18 }}>{s.price}</p>
          <Link to={s.ctaLink} style={{
            background: C.white, color: C.indigo,
            fontWeight: 800, fontSize: 13, padding: "9px 22px",
            borderRadius: 8, textDecoration: "none",
            display: "inline-block", boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          }}>{s.cta} →</Link>
        </div>
        <img src={s.img} alt="" style={{
          position: "absolute", right: 0, top: 0, height: "100%",
          width: "45%", objectFit: "cover", objectPosition: "center",
          opacity: 0.45, borderRadius: "0 10px 10px 0",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.2) 45%, transparent 100%)",
          borderRadius: 10,
        }} />
        <div style={{ position: "absolute", bottom: 12, left: 24, display: "flex", gap: 6, zIndex: 3 }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => { setCur(i); setKey(k => k + 1); }} style={{
              width: cur === i ? 22 : 7, height: 7, borderRadius: 4,
              background: cur === i ? C.white : "rgba(255,255,255,0.4)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "width 0.3s, background 0.3s",
            }} />
          ))}
        </div>
        {[{ dir: -1 }, { dir: 1 }].map(({ dir }) => (
          <button key={dir} onClick={() => { setCur(c => (c + dir + SLIDES.length) % SLIDES.length); setKey(k => k + 1); }}
            style={{
              position: "absolute", [dir < 0 ? "left" : "right"]: 8,
              top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.2)", border: "none",
              borderRadius: "50%", width: 32, height: 32,
              color: C.white, fontSize: 16, cursor: "pointer", zIndex: 4,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{dir < 0 ? "‹" : "›"}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Left Ad Column ───────────────────────────────────────────────────────────
const LEFT_ADS = [
  {
    label: "Latest Phones",
    sub: "Starting KES 8,999",
    bg: `linear-gradient(135deg,${C.indigoDark},#3730a3)`,
    img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=320&q=85",
    link: "/products?category=phones",
  },
  {
    label: "Tablet Deals",
    sub: "Up to 20% off",
    bg: `linear-gradient(135deg,#0f172a,#1e3a5f)`,
    img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=320&q=85",
    link: "/products?category=tablets",
  },
  {
    label: "Camera Gear",
    sub: "Pro shots, big savings",
    bg: `linear-gradient(135deg,#1c1917,#44403c)`,
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=320&q=85",
    link: "/products?category=cameras",
  },
];

function LeftAdColumn() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, height: 280 }}>
      {LEFT_ADS.map(b => (
        <Link key={b.label} to={b.link} style={{
          flex: 1, background: b.bg, borderRadius: 10,
          textDecoration: "none", overflow: "hidden", position: "relative",
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          padding: "10px 12px",
        }}>
          <img src={b.img} alt={b.label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 40%, rgba(0,0,0,0.1) 100%)", borderRadius: 10 }} />
          <div style={{ position: "relative", zIndex: 2 }}>
            <p style={{ color: C.white, fontWeight: 800, fontSize: 12.5, marginBottom: 1, lineHeight: 1.2 }}>{b.label}</p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginBottom: 6 }}>{b.sub}</p>
            <span style={{ background: "rgba(255,255,255,0.2)", color: C.white, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>Shop →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── Sub-banners ──────────────────────────────────────────────────────────────
const SUB_BANNERS = [
  {
    label: "Gaming Week",
    sub: "Up to 30% off",
    bg: `linear-gradient(135deg,#111827,#1a2744)`,
    img: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=260&q=85",
    link: "/products?category=gaming",
  },
  {
    label: "Audio Deals",
    sub: "Premium sound",
    bg: `linear-gradient(135deg,${C.indigo},#6366f1)`,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=260&q=85",
    link: "/products?category=audio",
  },
];

function SubBanners() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, height: 280 }}>
      {SUB_BANNERS.map(b => (
        <Link key={b.label} to={b.link} style={{
          flex: 1, background: b.bg, borderRadius: 10, padding: "14px 16px",
          textDecoration: "none", display: "flex", flexDirection: "column",
          justifyContent: "space-between", overflow: "hidden", position: "relative",
        }}>
          <div style={{ position: "relative", zIndex: 2 }}>
            <p style={{ color: C.white, fontWeight: 800, fontSize: 14, marginBottom: 2 }}>{b.label}</p>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>{b.sub}</p>
          </div>
          <span style={{ background: "rgba(255,255,255,0.18)", color: C.white, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, alignSelf: "flex-start", position: "relative", zIndex: 2 }}>Shop Now →</span>
          <img src={b.img} alt={b.label} style={{ position: "absolute", right: 0, top: 0, height: "100%", width: "55%", objectFit: "cover", objectPosition: "center", borderRadius: "0 10px 10px 0" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.55) 40%, transparent 100%)", borderRadius: 10 }} />
        </Link>
      ))}
    </div>
  );
}

// ─── 3D Cube ──────────────────────────────────────────────────────────────────
function Cube3D({ img, bgColor }) {
  const faces = ["face-front","face-back","face-right","face-left","face-top","face-bottom"];
  return (
    <div className="cube-scene">
      <div className="cube">
        {faces.map(cls => (
          <div key={cls} className={`cube-face ${cls}`} style={{ background: bgColor }}>
            <img src={img} alt="" draggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Quick category strip ─────────────────────────────────────────────────────
const QUICK_CATS = [
  { label: "Top Sellers",  cat: "all",         bg: "#f59e0b", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&q=80" },
  { label: "New Arrivals", cat: "all",         bg: "#10b981", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&q=80" },
  { label: "Clearance",   cat: "all",         bg: "#dc2626", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=120&q=80" },
  { label: "Phones",      cat: "phones",      bg: "#3730a3", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&q=80" },
  { label: "Laptops",     cat: "laptops",     bg: "#1e1b4b", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=120&q=80" },
  { label: "Audio",       cat: "audio",       bg: "#7c3aed", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&q=80" },
  { label: "Gaming",      cat: "gaming",      bg: "#059669", img: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=120&q=80" },
  { label: "Cameras",     cat: "cameras",     bg: "#0369a1", img: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=120&q=80" },
  { label: "Tablets",     cat: "tablets",     bg: "#b45309", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=120&q=80" },
  { label: "Accessories", cat: "accessories", bg: "#9d174d", img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=120&q=80" },
];

function QuickCats({ dispatch }) {
  return (
    <div className="vx-qcat">
      {QUICK_CATS.map(q => (
        <Link
          key={q.label}
          to={`/products?category=${q.cat}`}
          onClick={() => dispatch({ type: "SET_FILTER", filter: { category: q.cat } })}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textDecoration: "none", width: 68 }}
        >
          <Cube3D img={q.img} bgColor={q.bg} />
          <span className="vx-cat-label">{q.label}</span>
        </Link>
      ))}
    </div>
  );
}

// ─── Side menu (mobile) ───────────────────────────────────────────────────────
function SideMenu({ open, onClose, dispatch }) {
  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(30,27,75,0.45)", zIndex: 300 }} />}
      <div style={{
        position: "fixed", top: 0, left: 0, width: 270, height: "100vh",
        background: C.white, boxShadow: "6px 0 32px rgba(30,27,75,0.14)",
        zIndex: 301,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.26s cubic-bezier(0.4,0,0.2,1)",
        overflowY: "auto",
      }}>
        <div style={{ background: "#2d2a6e", padding: "18px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: C.white, fontWeight: 800, fontSize: 15 }}>VANTIX<span style={{ color: C.amber }}>.</span> SHOP254</span>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 7, color: C.white, width: 28, height: 28, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ padding: "12px 16px" }}>
          <p style={{ fontSize: 10, fontWeight: 800, color: C.gray400, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>Browse</p>
          {CATEGORIES.filter(c => c !== "all").map(cat => {
            const icons = { phones:"📱", laptops:"💻", audio:"🎧", cameras:"📷", gaming:"🕹️", tablets:"📟", accessories:"🎮" };
            return (
              <Link key={cat} to={`/products?category=${cat}`}
                onClick={() => { dispatch({ type: "SET_FILTER", filter: { category: cat } }); onClose(); }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, textDecoration: "none", color: C.gray900, marginBottom: 2, fontSize: 14, fontWeight: 500, textTransform: "capitalize" }}>
                <span style={{ fontSize: 20 }}>{icons[cat] || "🛍️"}</span> {cat}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Promo bar ────────────────────────────────────────────────────────────────
function PromoBar() {
  const items = [
    "🚚 Fast delivery countrywide",
    "🔒 100% secure payments",
    "🔄 30-day easy returns",
    "⚡ Flash deals every day — don't miss out!",
  ];
  const text = items.join("   ·   ") + "   ·   " + items.join("   ·   ");
  return (
    <div style={{
      background: "#2d2a6e", color: C.white,
      fontSize: 12, fontWeight: 500, padding: "8px 0",
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 210,
      height: 36, display: "flex", alignItems: "center",
    }}>
      <div className="vx-ticker-wrap" style={{ width: "100%" }}>
        <span className="vx-ticker">{text}</span>
      </div>
    </div>
  );
}

// ─── Live Search Dropdown ─────────────────────────────────────────────────────
const USD_TO_KSH = 130;
const toKsh = (usd) => `KES ${Math.round(usd * USD_TO_KSH).toLocaleString("en-KE")}`;

function SearchDropdown({ query, onClose }) {
  const navigate = useNavigate();
  if (!query || query.trim().length < 2) return null;

  const q = query.toLowerCase().trim();
  const results = products
    .filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    )
    .slice(0, 8);

  if (results.length === 0) {
    return (
      <div className="vx-search-drop">
        <div style={{ padding: "16px 14px", textAlign: "center", color: C.gray400, fontSize: 13 }}>
          No products found for "<strong style={{ color: C.gray600 }}>{query}</strong>"
        </div>
      </div>
    );
  }

  return (
    <div className="vx-search-drop">
      <div style={{ padding: "8px 14px 4px", fontSize: 10, fontWeight: 800, color: C.gray400, letterSpacing: "1px", textTransform: "uppercase", borderBottom: `1px solid ${C.gray100}` }}>
        {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
      </div>
      {results.map(p => (
        <Link key={p.id} to={`/product/${p.id}`} className="vx-search-item" onClick={onClose}>
          <img src={p.image} alt={p.title} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, flexShrink: 0, border: `1px solid ${C.gray100}` }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12.5, fontWeight: 600, color: C.gray900, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
            <p style={{ fontSize: 11, color: C.gray400, marginBottom: 2, textTransform: "capitalize" }}>{p.brand} · {p.category}</p>
            <p style={{ fontSize: 12, fontWeight: 800, color: C.indigo }}>{toKsh(p.price)}</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gray400} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </Link>
      ))}
      {products.filter(p => p.title.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q))).length > 8 && (
        <div
          onClick={() => { navigate(`/products?search=${encodeURIComponent(query)}`); onClose(); }}
          style={{ padding: "10px 14px", textAlign: "center", fontSize: 12.5, fontWeight: 700, color: C.indigo, cursor: "pointer", borderTop: `1px solid ${C.gray100}` }}
        >
          See all results for "{query}" →
        </div>
      )}
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
function MainNav({ cartCount, wishlist, user, logout, dispatch, onMenuOpen }) {
  const [searchVal, setSearchVal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function h(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
    setSearchOpen(e.target.value.trim().length >= 2);
  };

  const handleSearchSubmit = () => {
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearchSubmit();
    if (e.key === "Escape") { setSearchOpen(false); setSearchVal(""); }
  };

  return (
    <nav style={{ background: C.white, borderBottom: `2px solid ${C.gray200}`, boxShadow: "0 2px 12px rgba(55,48,163,0.08)", boxShadow: "0 2px 12px rgba(55,48,163,0.08)", position: "fixed", top: 36, left: 0, right: 0, zIndex: 200 }}>
      <div className="vx-pad" style={{ height: 60, display: "flex", alignItems: "center", gap: 12, maxWidth: 1400, margin: "0 auto" }}>

        <Link to="/" style={{ display:"flex", alignItems:"center", gap:9, textDecoration:"none", flexShrink:0 }}>
          <div style={{ width:34, height:34, background:`linear-gradient(140deg,${C.indigo},${C.indigoDark})`, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L18 7V13L10 18L2 13V7L10 2Z" stroke="#f5a623" strokeWidth="1.6" fill="rgba(245,166,35,0.12)"/>
              <circle cx="10" cy="10" r="3" fill="#f5a623"/>
            </svg>
          </div>
          <div style={{ lineHeight:1 }}>
            <div style={{ fontWeight:900, fontSize:17, color:C.indigoDark, letterSpacing:"-0.3px" }}>VANTIX<span style={{ color:C.amber }}>.</span></div>
            <div style={{ fontSize:9, fontWeight:700, color:C.gray400, letterSpacing:"1.4px", textTransform:"uppercase" }}>SHOP254</div>
          </div>
        </Link>

        <div
          ref={searchRef}
          className="hidden sm:flex"s
          style={{ flex: 1, position: "relative", border: `2px solid ${C.indigo}`, borderRadius: 8, overflow: "visible", alignItems: "center", background: C.white }}
        >
          <div style={{ display: "flex", alignItems: "center", width: "100%", overflow: "hidden", borderRadius: 6 }}>
            <select style={{ padding:"0 10px 0 12px", height:38, fontSize:12.5, color:C.gray600, border:"none", background:"transparent", borderRight:`1px solid ${C.gray200}`, cursor:"pointer", outline:"none", flexShrink: 0 }}>
              <option>All Categories</option>
              {CATEGORIES.filter(c=>c!=="all").map(c=>(
                <option key={c} style={{ textTransform:"capitalize" }}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search products, brands and more..."
              value={searchVal}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => searchVal.trim().length >= 2 && setSearchOpen(true)}
              style={{ flex:1, border:"none", background:"transparent", padding:"0 12px", height:38, fontSize:13, color:C.gray900, outline:"none", minWidth: 0 }}
            />
            {searchVal && (
              <button onClick={() => { setSearchVal(""); setSearchOpen(false); }} style={{ background:"none", border:"none", cursor:"pointer", padding:"0 8px", color:C.gray400, fontSize:16, display:"flex", alignItems:"center", flexShrink: 0 }}>✕</button>
            )}
            <button onClick={handleSearchSubmit} style={{ height:38, padding:"0 18px", background:C.indigo, color:C.white, border:"none", cursor:"pointer", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
              Search
            </button>
          </div>
          {searchOpen && (
            <SearchDropdown query={searchVal} onClose={() => { setSearchOpen(false); setSearchVal(""); }} />
          )}
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink: 0, marginLeft: "auto" }}>
          <a href="https://wa.me/254700000000" target="_blank" rel="noreferrer"
            style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"5px 8px", textDecoration:"none", borderRadius:8, color:C.gray600, minWidth:48 }}
            className="hover:bg-indigo-50 hidden md:flex">
            <svg viewBox="0 0 24 24" fill="#25d366" style={{ width:20, height:20 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.843L0 24l6.335-1.508A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.814 9.814 0 01-5.012-1.371l-.36-.214-3.732.888.936-3.63-.234-.373A9.817 9.817 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182c5.421 0 9.818 4.398 9.818 9.818 0 5.421-4.397 9.818-9.818 9.818z"/>
            </svg>
           <span style={{ fontSize:9, fontWeight:700, color: C.gray400 }}>...</span>

          </a>

          <Link to="/wishlist" style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center", padding:"5px 8px", color:C.gray600, textDecoration:"none", borderRadius:8, minWidth:48 }} className="hover:bg-indigo-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" style={{ width:20, height:20 }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {wishlist?.length > 0 && (
              <span style={{ fontSize:9, fontWeight:700, color: C.gray400 }}>...</span>

            )}
            <span style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.85)" }}>Chat</span>

          </Link>

          <Link to="/cart" style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center", padding:"5px 8px", color:C.gray600, textDecoration:"none", borderRadius:8, minWidth:48 }} className="hover:bg-indigo-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" style={{ width:20, height:20 }}>
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span style={{ fontSize:9, fontWeight:700, color: C.gray400 }}>...</span>

            )}
           <span style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.85)" }}>Wishlist</span>

          </Link>

          <div style={{ position:"relative" }} ref={userMenuRef}>
            {user ? (
              <>
                <button onClick={() => setUserMenuOpen(o=>!o)} style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"4px 8px", background:"none", border:"none", cursor:"pointer", borderRadius:8, minWidth:48 }} className="hover:bg-indigo-50">
                  <div className="vx-neon-av" style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,#0ea5e9,#6366f1)`, color:C.white, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13 }}>{user.name[0].toUpperCase()}</div>
                  <span style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.55)" }}>...</span>
                </button>
                {userMenuOpen && (
                  <div style={{ position:"absolute", right:0, top:"calc(100% + 4px)", width:200, background:C.white, borderRadius:12, boxShadow:"0 8px 32px rgba(30,27,75,0.14)", border:`1px solid ${C.gray200}`, zIndex:400 }}>
                    <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.gray100}` }}>
                      <p style={{ fontWeight:700, fontSize:13, color:C.gray900 }}>{user.name}</p>
                      <p style={{ fontSize:11, color:C.gray400 }}>{user.email}</p>
                    </div>
                    {[{label:"My Account",to:"/account"},{label:"My Orders",to:"/orders"},{label:`Wishlist (${wishlist?.length||0})`,to:"/wishlist"}].map(item=>(
                      <Link key={item.label} to={item.to} onClick={()=>setUserMenuOpen(false)} style={{ display:"block", padding:"10px 16px", fontSize:13, color:C.gray600, textDecoration:"none" }} className="hover:bg-indigo-50">{item.label}</Link>
                    ))}
                    <div style={{ borderTop:`1px solid ${C.gray100}` }}>
                      <button onClick={()=>{logout();setUserMenuOpen(false);}} style={{ width:"100%", padding:"10px 16px", textAlign:"left", fontSize:13, color:C.red, background:"none", border:"none", cursor:"pointer" }} className="hover:bg-red-50">Sign Out</button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Link to="/auth" style={{ fontSize:13, fontWeight:700, color:C.indigo, textDecoration:"none", padding:"6px 12px", borderRadius:8, border:`1.5px solid ${C.indigoLight}` }} className="hidden sm:inline-block">Sign in</Link>
                <Link to="/auth?mode=register" style={{ background:C.indigo, color:C.white, fontSize:13, fontWeight:700, padding:"7px 16px", borderRadius:20, textDecoration:"none" }} className="hidden sm:inline-block">Register</Link>
                <Link to="/auth" style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"5px 8px", textDecoration:"none", color:C.gray600, borderRadius:8 }} className="sm:hidden hover:bg-indigo-50">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" style={{ width:20, height:20 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/>
                  </svg>
                  <span style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.55)" }}>...</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden md:flex vx-pad" style={{ borderTop:`1px solid rgba(255,255,255,0.08)`, gap:2, alignItems:"center", maxWidth:1400, margin:"0 auto", background:C.indigoDark, overflowX:"auto" }}>
        <Link to="/products" style={{ padding:"0 14px", height:38, display:"flex", alignItems:"center", fontSize:13, fontWeight:700, color:C.white, borderBottom:`2.5px solid ${C.white}`, textDecoration:"none", whiteSpace:"nowrap" }}>All Products</Link>
        {CATEGORIES.filter(c=>c!=="all").map(cat=>(
          <Link key={cat} to={`/products?category=${cat}`}
            onClick={()=>dispatch({type:"SET_FILTER",filter:{category:cat}})}
            style={{ padding:"0 14px", height:38, display:"flex", alignItems:"center", fontSize:13, fontWeight:500, color:C.gray600, borderBottom:"2.5px solid transparent", textDecoration:"none", whiteSpace:"nowrap", textTransform:"capitalize", transition:"color 0.13s, border-color 0.13s" }}
            className="hover:text-indigo-700">{cat}</Link>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:16 }}>
          <Link to="/orders" style={{ fontSize:12, color:C.gray400, textDecoration:"none" }} className="hover:text-indigo-600">Track Order</Link>
          <Link to="/help"   style={{ fontSize:12, color:C.gray400, textDecoration:"none" }} className="hover:text-indigo-600">Help</Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Trust badge items ────────────────────────────────────────────────────────
const TRUST_ITEMS = [
  { icon:"↩️", title:"Easy Returns",    desc:"30-day returns",   glowClass:"trust-glow-1" },
  { icon:"🔒", title:"Secure Payments", desc:"100% protected",   glowClass:"trust-glow-2" },
  { icon:"🎧", title:"24/7 Support",    desc:"Always here",      glowClass:"trust-glow-3" },
  { icon:"🚚", title:"Fast Delivery",   desc:"Countrywide",      glowClass:"trust-glow-4" },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { dispatch, cartCount, wishlist, user, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="vx-page">
      <style>{GLOBAL_CSS}</style>

      <PromoBar />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} dispatch={dispatch} />
      <MainNav cartCount={cartCount} wishlist={wishlist} user={user} logout={logout} dispatch={dispatch} onMenuOpen={() => setMenuOpen(true)} />

      <div style={{ height: 96 }} className="md:hidden" />
      <div style={{ height: 134 }} className="hidden md:block" />

      <div className="vx-pad" style={{ maxWidth:1400, margin:"0 auto", paddingTop:16, paddingBottom:32 }}>

        {/* Hero zone */}
        <div className="vx-hero-layout" style={{ gap:10, marginBottom:12 }}>
          <div className="vx-sidebar"><LeftAdColumn /></div>
          <HeroBanner />
          <div className="vx-subbanner" style={{ flexDirection:"column", gap:8 }}><SubBanners /></div>
        </div>

        {/* 3D cube category row */}
        {/* 3D cube category row - hidden on mobile */}
<div
  className="hidden md:block"
  style={{
    background: C.white,
    borderRadius: 12,
    padding: "20px 16px",
    marginBottom: 12,
    border: `1px solid ${C.gray200}`,
  }}
>
  <QuickCats dispatch={dispatch} />
</div>

        {/* Flash sale */}
        <div style={{ background:C.red, borderRadius:12, overflow:"hidden", marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 16px", flexWrap:"wrap", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:18 }}>⚡</span>
              <span style={{ color:C.white, fontWeight:900, fontSize:16 }}>Flash Sales</span>
              <span style={{ color:"rgba(255,255,255,0.65)", fontSize:12, marginLeft:4 }}>| Live Now</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ color:"rgba(255,255,255,0.8)", fontSize:12 }}>Time Left:</span>
              <Countdown />
            </div>
            <Link to="/products" style={{ color:C.white, fontSize:12, fontWeight:700, textDecoration:"none", background:"rgba(255,255,255,0.15)", padding:"5px 14px", borderRadius:20 }}>See All →</Link>
          </div>
          <div style={{ background:C.gray50, padding:"12px" }}>
            <div className="vx-flash-grid">
              {flashSaleProducts.map(p => (
                <div key={p.id} className="vx-pcard"><ProductCard product={p} compact /></div>
              ))}
            </div>
          </div>
        </div>

        {/* Promo banners */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:10, marginBottom:12 }}>
          {[
            { title:"Top Phones",   sub:"Latest models",  bg:`linear-gradient(135deg,${C.indigo},#6366f1)`,  img:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=320&q=85", link:"/products?category=phones" },
            { title:"Laptop Deals", sub:"Up to 15% off",  bg:`linear-gradient(135deg,#111827,#374151)`,       img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=320&q=85", link:"/products?category=laptops" },
            { title:"Audio Week",   sub:"Premium sound",  bg:`linear-gradient(135deg,#7c3aed,#a855f7)`,       img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=320&q=85", link:"/products?category=audio" },
          ].map(b=>(
            <Link key={b.title} to={b.link} style={{ background:b.bg, borderRadius:12, padding:"18px 20px", textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"space-between", minHeight:90, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"relative", zIndex:2 }}>
                <p style={{ color:C.white, fontWeight:800, fontSize:15, marginBottom:3 }}>{b.title}</p>
                <p style={{ color:"rgba(255,255,255,0.7)", fontSize:12, marginBottom:10 }}>{b.sub}</p>
                <span style={{ background:"rgba(255,255,255,0.2)", color:C.white, fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:20 }}>Shop Now →</span>
              </div>
              <img src={b.img} alt={b.title} style={{ position:"absolute", right:0, top:0, height:"100%", width:"50%", objectFit:"cover", objectPosition:"center", borderRadius:"0 12px 12px 0" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right, rgba(0,0,0,0.45) 45%, transparent 100%)", borderRadius:12 }} />
            </Link>
          ))}
        </div>

        {/* Featured products */}
        <div style={{ background:C.white, borderRadius:12, padding:"16px", marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:14 }}>
            <div>
              <h2 style={{ fontSize:18, fontWeight:900, color:C.indigoDark, margin:0 }}>Featured Products</h2>
              <p style={{ fontSize:12, color:C.gray400, marginTop:3 }}>Handpicked top deals for you</p>
            </div>
            <Link to="/products" style={{ color:C.indigo, fontSize:13, fontWeight:700, textDecoration:"none" }}>See All →</Link>
          </div>
          <div className="vx-feat-grid">
            {products.slice(0, 12).map(p => (
              <div key={p.id} className="vx-pcard"><ProductCard product={p} /></div>
            ))}
          </div>
        </div>

        {/* Trust strip — slim glowing pills */}
        <div className="vx-trust">
          {TRUST_ITEMS.map(item => (
            <div key={item.title} className={item.glowClass} style={{
              background: "#2d2a6e",
              borderRadius: 40,
              padding: "8px 16px 8px 12px",
              display: "flex",
              alignItems: "center",
              gap: 9,
            }}>
              <span style={{ fontSize: 17, flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
              <div>
                <p style={{ fontWeight: 700, color: C.white, fontSize: 11.5, lineHeight: 1.25, margin: 0 }}>{item.title}</p>
                <p style={{ fontSize: 9.5, color: "rgba(255,255,255,0.48)", lineHeight: 1.25, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}