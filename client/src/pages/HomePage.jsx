// FILE: src/pages/HomePage.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { products, flashSaleProducts, CATEGORIES } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useApp } from "../context/AppContext";

// ── Keyframes injected once ───────────────────────────────────────────────────
const KEYFRAMES = `
@keyframes rotateCube {
  from { transform: rotateX(20deg) rotateY(0deg); }
  to   { transform: rotateX(20deg) rotateY(360deg); }
}
@keyframes floatY {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-14px); }
}
@keyframes pulseGlow {
  0%,100% { opacity: 0.4; }
  50%      { opacity: 0.9; }
}
@keyframes pulseDot {
  0%,100% { opacity: 1; }
  50%      { opacity: 0.35; }
}
@keyframes neonPulse {
  0%,100% {
    box-shadow: 0 0 4px #00f5ff, 0 0 10px #00f5ff, 0 0 20px #00f5ff, 0 0 40px #00bfff;
  }
  50% {
    box-shadow: 0 0 6px #00f5ff, 0 0 16px #00f5ff, 0 0 32px #00f5ff, 0 0 60px #00bfff;
  }
}
.neon-avatar {
  animation: neonPulse 2s ease-in-out infinite;
  border: 2px solid #00f5ff;
}

/* ── MOBILE GLOBAL FIXES ── */
*, *::before, *::after { box-sizing: border-box; }

html, body {
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;
}

/* Full-width hero override */
.hero-fullwidth {
  width: 100%;
  position: relative;
  left: 0;
  right: 0;
  margin-left: 0;
  margin-right: 0;
  overflow: hidden;
}

.vantix-page {
  width: 100%;
  max-width: 100% !important;
  overflow-x: hidden;
}

/* Navbar spacer — accounts for fixed navbar heights:
   mobile: 64px nav only (utility bar hidden, category bar hidden on mobile)
   desktop: 36px utility + 64px nav + 44px category = 144px */
.navbar-spacer {
  height: 64px;
}
@media (min-width: 768px) {
  .navbar-spacer { height: 144px; }
}

/* Flash sale grid — 2 cols on mobile, 4 on sm+ */
.flash-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
@media (min-width: 640px) {
  .flash-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
}

/* Featured products grid */
.featured-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
@media (min-width: 640px) {
  .featured-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
}
@media (min-width: 1024px) {
  .featured-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
@media (min-width: 1280px) {
  .featured-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
}

/* Promo banners — 1 col mobile, 3 col sm+ */
.promo-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 640px) {
  .promo-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
}

/* Trust section — 2 col mobile, 4 col sm+ */
.trust-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
@media (min-width: 640px) {
  .trust-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
}

/* Section padding */
.section-pad {
  padding-left: 16px;
  padding-right: 16px;
}
@media (min-width: 768px) {
  .section-pad { padding-left: 48px; padding-right: 48px; }
}
@media (min-width: 1280px) {
  .section-pad { padding-left: 80px; padding-right: 80px; }
}

/* Flash sale header flex — wrap on tiny screens */
.flash-sale-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  flex-wrap: wrap;
  gap: 8px;
}

/* Hero text clamp */
.hero-title {
  font-size: clamp(20px, 5vw, 38px);
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  letter-spacing: -0.8px;
  margin-bottom: 8px;
  font-family: system-ui, sans-serif;
}

/* Hero paragraph */
.hero-para {
  font-size: clamp(12px, 3vw, 14px);
  color: rgba(255,255,255,0.55);
  line-height: 1.55;
  margin-bottom: 16px;
  max-width: 420px;
}

/* Hero badge strip — wrap gracefully */
.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 5px 16px;
  font-size: 11px;
  color: rgba(255,255,255,0.45);
}

@media (min-width: 1400px) {
  .products-wide { grid-template-columns: repeat(6, minmax(0, 1fr)) !important; }
}
@media (min-width: 1800px) {
  .products-wide { grid-template-columns: repeat(7, minmax(0, 1fr)) !important; }
}
`;

// ── Tiny corner Cube ──────────────────────────────────────────────────────────
function TinyCube({ size = 26, speed = 9 }) {
  const half = size / 2;
  const faces = [
    { transform: `translateZ(${half}px)` },
    { transform: `rotateY(180deg) translateZ(${half}px)` },
    { transform: `rotateY(-90deg) translateZ(${half}px)` },
    { transform: `rotateY(90deg) translateZ(${half}px)` },
    { transform: `rotateX(90deg) translateZ(${half}px)` },
    { transform: `rotateX(-90deg) translateZ(${half}px)` },
  ];
  return (
    <div style={{ width: size, height: size, perspective: 80 }}>
      <div style={{
        width: size, height: size, position: "relative",
        transformStyle: "preserve-3d",
        animation: `rotateCube ${speed}s linear infinite`,
      }}>
        {faces.map((f, i) => (
          <div key={i} style={{
            position: "absolute", width: size, height: size,
            transform: f.transform,
            border: "1px solid rgba(245,166,35,0.65)",
            background: "rgba(245,166,35,0.05)",
            borderRadius: 2,
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Flash sale countdown ──────────────────────────────────────────────────────
function Countdown() {
  const [time, setTime] = useState({ h: 5, m: 43, s: 22 });
  useEffect(() => {
    const id = setInterval(() => {
      setTime(({ h, m, s }) => {
        s--; if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-1">
      {[pad(time.h), pad(time.m), pad(time.s)].map((val, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-white text-red-600 font-bold text-sm sm:text-lg px-1.5 sm:px-2 py-0.5 rounded min-w-[1.8rem] sm:min-w-[2rem] text-center">
            {val}
          </span>
          {i < 2 && <span className="text-white font-bold text-sm sm:text-lg">:</span>}
        </span>
      ))}
    </div>
  );
}

// ── Category icon map ─────────────────────────────────────────────────────────
const categoryIcons = {
  phones: "📱", laptops: "💻", tablets: "📟", accessories: "🎮",
  audio: "🎧", cameras: "📷", gaming: "🕹️", all: "🛍️",
};

// ── Side Menu ─────────────────────────────────────────────────────────────────
function SideMenu({ open, onClose, dispatch }) {
  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(8,17,42,0.38)",
            zIndex: 300,
          }}
        />
      )}
      <div style={{
        position: "fixed", top: 0, right: 0,
        width: 280, height: "100vh",
        background: "#fff",
        boxShadow: "-6px 0 32px rgba(8,17,42,0.12)",
        zIndex: 301,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        overflowY: "auto",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{
          padding: "18px 20px 14px",
          borderBottom: "1px solid #dde3f0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#08112a" }}>Menu</span>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 7,
              border: "none", background: "#f5f7fc",
              cursor: "pointer", fontSize: 15, color: "#6b7a99",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>

        <div style={{ padding: "14px 20px 8px" }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "1.2px",
            textTransform: "uppercase", color: "#6b7a99", marginBottom: 10,
          }}>Browse Categories</div>
          {CATEGORIES.filter(c => c !== "all").map((cat) => (
            <Link
              key={cat}
              to="/products"
              onClick={() => { dispatch({ type: "SET_FILTER", filter: { category: cat } }); onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: 13,
                padding: "10px 12px", borderRadius: 10,
                textDecoration: "none", color: "#111827",
                transition: "background 0.12s", marginBottom: 2,
              }}
              className="hover:bg-gray-50"
            >
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: "#f5f7fc", border: "1px solid #dde3f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
              }}>{categoryIcons[cat]}</div>
              <span style={{ fontSize: 14, fontWeight: 500, textTransform: "capitalize" }}>{cat}</span>
            </Link>
          ))}
        </div>

        <div style={{ height: 1, background: "#dde3f0", margin: "8px 20px" }} />

        <div style={{ padding: "8px 20px" }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "1.2px",
            textTransform: "uppercase", color: "#6b7a99", marginBottom: 10,
          }}>My Account</div>
          {["Profile", "My Orders", "Settings", "Sign Out"].map((item) => (
            <div
              key={item}
              style={{
                padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                fontSize: 14, fontWeight: 500, color: "#111827",
                marginBottom: 2,
              }}
              className="hover:bg-gray-50"
            >{item}</div>
          ))}
        </div>

        <div style={{ height: 1, background: "#dde3f0", margin: "8px 20px" }} />

        <div style={{ padding: "8px 20px" }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "1.2px",
            textTransform: "uppercase", color: "#6b7a99", marginBottom: 10,
          }}>Support</div>
          {["Help Center", "Track Order"].map((item) => (
            <div
              key={item}
              style={{
                padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                fontSize: 14, fontWeight: 500, color: "#111827", marginBottom: 2,
              }}
              className="hover:bg-gray-50"
            >{item}</div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Main HomePage ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const { dispatch, cartCount, wishlist, user, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="bg-gray-50 vantix-page">
      <style>{KEYFRAMES}</style>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} dispatch={dispatch} />

      {/* ── Top utility bar (desktop only) ─────────────────────────────────── */}
      <div
        className="hidden md:flex"
        style={{
          background: "#08112a",
          color: "rgba(255,255,255,0.6)",
          fontSize: 12,
          padding: "7px 48px",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 20,
          width: "100%",
        }}
      >
        <span style={{ cursor: "pointer" }} className="hover:text-white">Track Order</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span style={{ cursor: "pointer" }} className="hover:text-white">Help Center</span>
      </div>

      {/* ── Main Navbar ── FIXED so it always stays visible ────────────────── */}
      <nav style={{
        background: "#fff",
        borderBottom: "1px solid #dde3f0",
        boxShadow: "0 1px 10px rgba(8,17,42,0.06)",
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
      }}>
        <div style={{
          padding: "0 12px",
          height: 64,
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
        }}
          className="md:px-12 md:gap-14"
        >
          {/* Logo */}
          <Link to="/" style={{
            display: "flex", alignItems: "center", gap: 9,
            textDecoration: "none", flexShrink: 0,
          }}>
            <div style={{
              width: 36, height: 36,
              background: "linear-gradient(140deg,#1a3a8f,#08112a)",
              borderRadius: 9,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L18 7V13L10 18L2 13V7L10 2Z"
                  stroke="#f5a623" strokeWidth="1.6" fill="rgba(245,166,35,0.12)" />
                <circle cx="10" cy="10" r="3" fill="#f5a623" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{
                fontSize: 17, fontWeight: 800,
                color: "#08112a", letterSpacing: "-0.3px",
                fontFamily: "system-ui,sans-serif",
              }}>
                VANTIX<span style={{ color: "#f5a623" }}>.</span>
              </span>
              <span style={{
                fontSize: 9, fontWeight: 700,
                color: "#6b7a99", letterSpacing: "1.4px",
                textTransform: "uppercase", marginTop: 1,
              }}>SHOP254</span>
            </div>
          </Link>

          {/* Search — desktop only */}
          <div
            className="hidden md:flex"
            style={{
              flex: 1, maxWidth: 560,
              background: "#f5f7fc",
              border: "1.5px solid #dde3f0",
              borderRadius: 10,
              overflow: "hidden",
              alignItems: "center",
            }}
          >
            <select style={{
              padding: "0 12px 0 14px", height: 40, fontSize: 13,
              color: "#6b7a99", border: "none", background: "transparent",
              borderRight: "1px solid #dde3f0", cursor: "pointer",
              fontFamily: "inherit", outline: "none",
            }}>
              <option>All Categories</option>
              {CATEGORIES.filter(c => c !== "all").map(c => (
                <option key={c} style={{ textTransform: "capitalize" }}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              style={{
                flex: 1, border: "none", background: "transparent",
                padding: "0 14px", height: 40, fontSize: 13.5,
                color: "#111827", outline: "none", fontFamily: "inherit",
              }}
            />
            <button style={{
              height: 40, padding: "0 20px",
              background: "#1a3a8f", color: "#fff",
              border: "none", cursor: "pointer",
              fontSize: 13.5, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 7,
              fontFamily: "inherit", flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
              </svg>
              Search
            </button>
          </div>

          {/* ── Right action icons ── */}
          <div style={{
            display: "flex", alignItems: "center",
            gap: 0, marginLeft: "auto", flexShrink: 0,
          }}>

            {/* Wishlist — icon + label */}
            <Link
              to="/wishlist"
              style={{
                position: "relative",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "6px 6px",
                color: "#374151", textDecoration: "none",
                borderRadius: 8,
                transition: "background 0.12s",
                minWidth: 44,
              }}
              className="hover:bg-gray-100 md:min-w-[64px] md:px-4"
            >
              <svg
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
                style={{ width: 20, height: 20 }}
                className="md:w-7 md:h-7"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlist && wishlist.length > 0 && (
                <span style={{
                  position: "absolute", top: 2, right: 6,
                  minWidth: 16, height: 16, padding: "0 4px",
                  borderRadius: 8, background: "#ef4444",
                  fontSize: 10, fontWeight: 700, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{wishlist.length}</span>
              )}
              <span
                style={{ fontSize: 9, marginTop: 2, fontWeight: 700, color: "#6b7a99" }}
                className="md:text-[11px] md:font-bold md:text-gray-700"
              >Wishlist</span>
            </Link>

            {/* Cart — icon + label */}
            <Link
              to="/cart"
              style={{
                position: "relative",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "6px 6px",
                color: "#374151", textDecoration: "none",
                borderRadius: 8,
                transition: "background 0.12s",
                minWidth: 44,
              }}
              className="hover:bg-gray-100 md:min-w-[64px] md:px-4"
            >
              <svg
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
                style={{ width: 20, height: 20 }}
                className="md:w-7 md:h-7"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: 2, right: 6,
                  minWidth: 16, height: 16, padding: "0 4px",
                  borderRadius: 8, background: "#ef4444",
                  fontSize: 10, fontWeight: 700, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{cartCount > 9 ? "9+" : cartCount}</span>
              )}
              <span
                style={{ fontSize: 9, marginTop: 2, fontWeight: 700, color: "#6b7a99" }}
                className="md:text-[11px] md:font-bold md:text-gray-700"
              >Cart</span>
            </Link>

            {/* Profile / Avatar */}
            <div style={{ position: "relative" }} ref={userMenuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(o => !o)}
                    style={{
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      padding: "4px 6px",
                      background: "none", border: "none", cursor: "pointer",
                      borderRadius: 8, minWidth: 44,
                    }}
                    className="hover:bg-gray-100 md:min-w-[64px] md:px-4"
                  >
                    <div
                      className="neon-avatar md:w-10 md:h-10"
                      style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: "linear-gradient(135deg,#0ea5e9,#06b6d4,#0891b2)",
                        color: "#fff", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontWeight: 800, fontSize: 14,
                      }}
                    >
                      {user.name[0].toUpperCase()}
                    </div>
                    <span
                      style={{ fontSize: 9, marginTop: 2, fontWeight: 700, color: "#6b7a99" }}
                      className="md:text-[11px] md:font-bold md:text-gray-700"
                    >
                      {user.name.split(" ")[0]}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div style={{
                      position: "absolute", right: 0, top: "calc(100% + 4px)",
                      width: 210, background: "#fff",
                      borderRadius: 14, boxShadow: "0 8px 32px rgba(8,17,42,0.14)",
                      border: "1px solid #dde3f0", zIndex: 400, overflow: "hidden",
                    }}>
                      <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid #f0f2f8" }}>
                        <p style={{ fontWeight: 700, fontSize: 13.5, color: "#111827" }}>{user.name}</p>
                        <p style={{ fontSize: 11.5, color: "#6b7a99", marginTop: 1 }}>{user.email}</p>
                      </div>
                      {[
                        { label: "My Account", to: "/account" },
                        { label: "My Orders", to: "/orders" },
                        { label: `Wishlist (${wishlist?.length || 0})`, to: "/wishlist" },
                      ].map(item => (
                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={() => setUserMenuOpen(false)}
                          style={{
                            display: "block", padding: "10px 16px",
                            fontSize: 13.5, color: "#374151",
                            textDecoration: "none",
                          }}
                          className="hover:bg-gray-50"
                        >{item.label}</Link>
                      ))}
                      <div style={{ borderTop: "1px solid #f0f2f8" }}>
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          style={{
                            width: "100%", padding: "10px 16px", textAlign: "left",
                            fontSize: 13.5, color: "#ef4444", background: "none",
                            border: "none", cursor: "pointer",
                          }}
                          className="hover:bg-red-50"
                        >Sign Out</button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Mobile: profile icon + label */}
                  <Link
                    to="/auth"
                    style={{
                      flexDirection: "column", alignItems: "center",
                      padding: "6px 6px", color: "#374151",
                      textDecoration: "none", borderRadius: 8, minWidth: 44,
                      display: "flex",
                    }}
                    className="md:hidden hover:bg-gray-100"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                    </svg>
                    <span style={{ fontSize: 9, marginTop: 2, fontWeight: 700, color: "#6b7a99" }}>Profile</span>
                  </Link>
                  {/* Desktop: sign in + create account */}
                  <div className="hidden md:flex items-center gap-3 pl-2">
                    <Link to="/auth" style={{
                      fontSize: 14, fontWeight: 700, color: "#374151",
                      textDecoration: "none", padding: "6px 12px", borderRadius: 8,
                    }} className="hover:text-blue-700">Sign in</Link>
                    <Link to="/auth?mode=register" style={{
                      background: "#1a3a8f", color: "#fff",
                      fontSize: 13.5, fontWeight: 700,
                      padding: "8px 18px", borderRadius: 20,
                      textDecoration: "none", whiteSpace: "nowrap",
                    }} className="hover:opacity-90">Create account</Link>
                  </div>
                </>
              )}
            </div>

            {/* ── Hamburger — desktop ONLY, fully visible ── */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="hidden md:flex"
              style={{
                flexDirection: "column", alignItems: "center",
                justifyContent: "center",
                padding: "6px 12px",
                background: "none", border: "none", cursor: "pointer",
                borderRadius: 8, minWidth: 64,
              }}
              aria-label="Open menu"
            >
              {[0, 1, 2].map((i) => (
                <span key={i} style={{
                  display: "block", width: 22, height: 2.5,
                  background: "#1a3a8f", borderRadius: 3,
                  marginBottom: i < 2 ? 5 : 0,
                  transition: "all 0.22s",
                  transform: menuOpen
                    ? (i === 0 ? "translateY(7.5px) rotate(45deg)"
                      : i === 2 ? "translateY(-7.5px) rotate(-45deg)"
                      : "scaleX(0)")
                    : "none",
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }} />
              ))}
              <span style={{ fontSize: 11, marginTop: 4, fontWeight: 700, color: "#1a3a8f" }}>Menu</span>
            </button>
          </div>
        </div>

        {/* ── Desktop Category Bar ── */}
        <div
          className="hidden md:flex"
          style={{
            borderTop: "1px solid #dde3f0",
            padding: "0 48px",
            gap: 2, alignItems: "center", overflowX: "auto",
          }}
        >
          <Link
            to="/products"
            style={{
              padding: "0 16px", height: 44,
              display: "flex", alignItems: "center", gap: 7,
              fontSize: 13.5, fontWeight: 600, color: "#1a3a8f",
              borderBottom: "2px solid #1a3a8f",
              textDecoration: "none", whiteSpace: "nowrap",
            }}
          >All Products</Link>
          {CATEGORIES.filter(c => c !== "all").map((cat) => (
            <Link
              key={cat}
              to="/products"
              onClick={() => dispatch({ type: "SET_FILTER", filter: { category: cat } })}
              style={{
                padding: "0 16px", height: 44,
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 13.5, fontWeight: 500, color: "#6b7a99",
                borderBottom: "2px solid transparent",
                textDecoration: "none", whiteSpace: "nowrap",
                textTransform: "capitalize",
                transition: "color 0.15s, border-color 0.15s",
              }}
              className="hover:text-blue-700"
            >{cat}</Link>
          ))}
        </div>
      </nav>

      {/* Spacer — matches fixed navbar height per breakpoint */}
      <div className="navbar-spacer" />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        className="hero-fullwidth"
        style={{
          background: "linear-gradient(120deg,#08112a 0%,#1a3a8f 58%,#1d4ed8 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(#60a5fa 1px,transparent 1px),linear-gradient(90deg,#60a5fa 1px,transparent 1px)",
          backgroundSize: "44px 44px",
          pointerEvents: "none",
        }} />

        <div
          className="section-pad lg:grid lg:grid-cols-2"
          style={{
            width: "100%", maxWidth: 1400,
            margin: "0 auto",
            paddingTop: 24, paddingBottom: 28,
            position: "relative", zIndex: 2,
            gap: 20,
            alignItems: "center",
          }}
        >
          <div>
            <h1 className="hero-title">
              Next-Gen Quality Products.{" "}
              <span style={{ color: "#f5a623" }}>Best Prices.</span>
            </h1>
            <p className="hero-para">
              Premium phones, laptops, audio &amp; more — genuine products, fast delivery across Kenya.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              <Link to="/products" style={{
                background: "#f5a623", color: "#fff",
                border: "none", borderRadius: 11,
                padding: "9px 22px", fontSize: 13.5, fontWeight: 700,
                textDecoration: "none", display: "flex", alignItems: "center", gap: 8,
                boxShadow: "0 6px 20px rgba(245,166,35,0.28)",
                transition: "background 0.15s",
              }}>🛒 Shop Now</Link>
              <Link to="/products?category=phones" style={{
                background: "rgba(255,255,255,0.1)", color: "#fff",
                border: "1.5px solid rgba(255,255,255,0.22)", borderRadius: 11,
                padding: "9px 18px", fontSize: 13.5, fontWeight: 500,
                textDecoration: "none", transition: "background 0.15s",
              }}>View Deals →</Link>
            </div>
            <div className="hero-badges">
              {["✅ Genuine Products", "🚚 Fast Delivery", "🔄 Easy Returns", "🔒 Secure Payment"].map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>

          {/* Desktop-only hero image panel */}
          <div className="hidden lg:flex" style={{ justifyContent: "center" }}>
            <div style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 16, padding: 16, width: "100%", maxWidth: 320,
            }}>
              <div style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12, aspectRatio: "16/9",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
              }}>
                <img
                  src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80"
                  alt="Electronics"
                  style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.88, borderRadius: 12 }}
                />
              </div>
              <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.82)" }}>Sony WH-1000XM5</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#f5a623" }}>KSh 34,999</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 20, right: 24, opacity: 0.38, zIndex: 3, pointerEvents: "none" }}>
          <TinyCube size={26} speed={9} />
        </div>
      </section>

      {/* ── Flash Sale ────────────────────────────────────────────────────────── */}
      <section
        className="section-pad"
        style={{ paddingTop: 24, paddingBottom: 0, width: "100%" }}
      >
        <div style={{ borderRadius: 16, overflow: "hidden" }} className="bg-red-600">
          {/* Header */}
          <div className="flash-sale-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>⚡</span>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Flash Sale</span>
            </div>
            <Countdown />
            <Link to="/products" style={{ color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              View All →
            </Link>
          </div>

          {/* Product grid */}
          <div style={{ background: "#f9fafb", padding: "12px" }}>
            <div className="flash-grid">
              {flashSaleProducts.map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────────── */}
      <section
        className="section-pad"
        style={{ paddingTop: 24, paddingBottom: 24, width: "100%" }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: "clamp(16px,4vw,22px)", fontWeight: 800, color: "#111827" }}>Featured Products</h2>
            <p style={{ fontSize: 12, color: "#6b7a99", marginTop: 2 }}>Handpicked top deals for you</p>
          </div>
          <Link to="/products" style={{ color: "#1a3a8f", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>See All →</Link>
        </div>
        <div className="featured-grid products-wide">
          {products.slice(0, 10).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── Promo Banners ─────────────────────────────────────────────────────── */}
      <section
        className="section-pad"
        style={{ paddingBottom: 24, width: "100%" }}
      >
        <div className="promo-grid">
          {[
            { title: "Top Phones", subtitle: "Latest models", color: "from-blue-600 to-blue-400", emoji: "📱", link: "/products?category=phones" },
            { title: "Gaming Week", subtitle: "Up to 30% off", color: "from-gray-900 to-gray-700", emoji: "🕹️", link: "/products?category=gaming" },
            { title: "Audio Deals", subtitle: "Premium sound", color: "from-indigo-600 to-indigo-400", emoji: "🎧", link: "/products?category=audio" },
          ].map((b) => (
            <Link key={b.title} to={b.link}
              className={`bg-gradient-to-r ${b.color} rounded-2xl p-5 sm:p-6 text-white flex items-center justify-between hover:opacity-90 transition-opacity`}
            >
              <div>
                <p className="font-bold text-base sm:text-lg">{b.title}</p>
                <p className="text-xs sm:text-sm opacity-80">{b.subtitle}</p>
                <span className="inline-block mt-3 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition">
                  Shop Now →
                </span>
              </div>
              <span style={{ fontSize: "clamp(32px, 8vw, 48px)" }}>{b.emoji}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trust Section ─────────────────────────────────────────────────────── */}
      <section
        className="section-pad"
        style={{ paddingBottom: 48, width: "100%" }}
      >
        <div className="trust-grid">
          {[
            { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
            { icon: "🔒", title: "Secure Payment", desc: "100% protected" },
            { icon: "🎧", title: "24/7 Support", desc: "Always here to help" },
            { icon: "🚚", title: "Fast Delivery", desc: "Across all Kenya" },
          ].map((item) => (
            <div key={item.title} style={{
              background: "#fff", borderRadius: 12,
              border: "1px solid #f0f1f5",
              padding: "12px", display: "flex",
              alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 600, color: "#1f2937", fontSize: 13 }}>{item.title}</p>
                <p style={{ fontSize: 11, color: "#6b7280" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}