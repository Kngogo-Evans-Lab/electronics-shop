// FILE: src/components/Navbar.jsx

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/products";

const PHONE        = "+254722116713";
const WHATSAPP_NO  = "254722116713";
const EMAIL        = "vantixshop254@gmail.com";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NO}?text=Hi%20Vantix%2C%20I%20need%20help%20with%20an%20order.`;
const TEL_URL      = `tel:${PHONE}`;
const MAIL_URL     = `mailto:${EMAIL}`;

export function VantixKenyaLogo({ size = 32 }) {
  return (
    <div style={{
      width: size, height: size,
      background: "linear-gradient(140deg,#1a3a8f,#08112a)",
      borderRadius: Math.round(size * 0.25),
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 20 20" fill="none">
        <path d="M10 2L18 7V13L10 18L2 13V7L10 2Z" stroke="#f5a623" strokeWidth="1.6" fill="rgba(245,166,35,0.12)" />
        <circle cx="10" cy="10" r="3" fill="#f5a623" />
      </svg>
    </div>
  );
}

function DropdownPortal({ anchorRef, open, children, onMount }) {
  const [coords, setCoords] = useState(null);
  const portalRef = useRef(null);

  useEffect(() => {
    if (open && anchorRef.current) {
      const r = anchorRef.current.getBoundingClientRect();
      setCoords({ top: r.bottom + 6, left: r.left });
    }
    if (!open) setCoords(null);
  }, [open]);

  useEffect(() => {
    if (onMount) onMount(portalRef.current);
  });

  if (!open || !coords) return null;

  return createPortal(
    <div
      ref={portalRef}
      style={{ position: "fixed", top: coords.top, left: coords.left, zIndex: 9999 }}
    >
      {children}
    </div>,
    document.body
  );
}

export default function Navbar({
  filteredCount, sortValue, onSortChange, sortOptions,
  viewMode, onViewChange, onPriceRange,
  activePriceMin, activePriceMax,
  brands, selectedBrands, onToggleBrand, onResetAll,
  onOpenMobileFilters,
}) {
  const { cartCount, wishlist, user, logout, dispatch, filters } = useApp();
  const [searchVal, setSearchVal]         = useState("");
  const [userMenuOpen, setUserMenuOpen]   = useState(false);
  const [brandDropOpen, setBrandDropOpen] = useState(false);
  const [priceDropOpen, setPriceDropOpen] = useState(false);
  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");

  const navigate     = useNavigate();
  const location     = useLocation();
  const userMenuRef  = useRef(null);
  const brandDropRef = useRef(null);
  const priceDropRef = useRef(null);

  const pricePortalRef = useRef(null);
  const brandPortalRef = useRef(null);

  const showFilterBar = !!(sortOptions && onSortChange);
  const isHomepage    = location.pathname === "/" || location.pathname === "/home";

  useEffect(() => {
    if (activePriceMin === 0 && activePriceMax === Infinity) {
      setMinInput("");
      setMaxInput("");
    }
  }, [activePriceMin, activePriceMax]);

  useEffect(() => {
    function close(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      const inPriceAnchor = priceDropRef.current && priceDropRef.current.contains(e.target);
      const inPricePortal = pricePortalRef.current && pricePortalRef.current.contains(e.target);
      if (!inPriceAnchor && !inPricePortal) setPriceDropOpen(false);

      const inBrandAnchor = brandDropRef.current && brandDropRef.current.contains(e.target);
      const inBrandPortal = brandPortalRef.current && brandPortalRef.current.contains(e.target);
      if (!inBrandAnchor && !inBrandPortal) setBrandDropOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleSearchChange = (e) => {
    const v = e.target.value;
    setSearchVal(v);
    navigate(v.trim() ? `/products?search=${encodeURIComponent(v.trim())}` : "/products");
  };
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(searchVal.trim() ? `/products?search=${encodeURIComponent(searchVal.trim())}` : "/products");
  };
  const handleClear = () => { setSearchVal(""); navigate("/products"); };

  const applyPriceRange = () => {
    const min = minInput === "" ? 0        : Number(String(minInput).replace(/,/g, ""));
    const max = maxInput === "" ? Infinity : Number(String(maxInput).replace(/,/g, ""));
    if (!isNaN(min) && !isNaN(max) && min <= (max === Infinity ? Infinity : max)) {
      onPriceRange(min, max);
      setPriceDropOpen(false);
    }
  };

  const clearPrice = () => {
    setMinInput("");
    setMaxInput("");
    onPriceRange(0, Infinity);
    setPriceDropOpen(false);
  };

  const clearBrands = () => {
    if (selectedBrands && selectedBrands.length > 0) {
      selectedBrands.forEach(b => onToggleBrand(b));
    }
  };

  const priceIsActive    = activePriceMin > 0 || activePriceMax !== Infinity;
  const activeBrandCount = selectedBrands?.length ?? 0;
  const priceLabel = (() => {
    if (!priceIsActive) return "Price";
    const fmt = (n) => n >= 1000 ? `${Math.round(n / 1000)}K` : String(n);
    if (activePriceMax === Infinity) return `> ${fmt(activePriceMin)}`;
    if (activePriceMin === 0)        return `< ${fmt(activePriceMax)}`;
    return `${fmt(activePriceMin)} – ${fmt(activePriceMax)}`;
  })();

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />

      <style>{`
        @keyframes marqueeScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .v-marquee { display:inline-flex; animation:marqueeScroll 26s linear infinite; }
        .v-marquee:hover { animation-play-state:paused; }

        @keyframes neonPulse {
          0%,100%{box-shadow:0 0 4px #00f5ff,0 0 10px #00f5ff,0 0 22px #00bfff}
          50%{box-shadow:0 0 8px #00f5ff,0 0 18px #00f5ff,0 0 36px #00bfff}
        }
        .neon-av { animation:neonPulse 2s ease-in-out infinite; border:2px solid #00f5ff; }

        /* Search */
        .v-search {
          flex:1; display:flex; align-items:center; min-width:0;
          border:2px solid #2563eb; border-radius:100px; overflow:hidden;
          background:#fff; height:38px;
        }
        .v-search select {
          border:none; outline:none; background:transparent; font-size:12px;
          color:#374151; padding:0 8px 0 12px; cursor:pointer;
          border-right:1px solid #e5e7eb; height:100%; flex-shrink:0; display:none;
        }
        @media(min-width:640px){ .v-search select { display:block; } }
        .v-search input {
          flex:1; border:none; outline:none; background:transparent;
          font-size:13px; padding:0 12px; color:#374151; min-width:0; height:100%;
        }
        .v-search input::placeholder { color:#9ca3af; }
        .v-xclear {
          flex-shrink:0; background:none; border:none; cursor:pointer;
          color:#9ca3af; font-size:18px; line-height:1; padding:0 10px;
        }

        /* ── Mobile category strip ── */
        .v-mob-cats {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 5px 10px;
          background: #fff;
          border-bottom: 1px solid #f3f4f6;
        }
        .v-mob-cats::-webkit-scrollbar { display: none; }
        @media(min-width:640px) { .v-mob-cats { display: none; } }

        .v-mob-cat {
          flex-shrink: 0;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 11px;
          border-radius: 100px;
          border: 1px solid #e5e7eb;
          color: #4b5563;
          background: #fff;
          text-decoration: none;
          white-space: nowrap;
          transition: all .12s;
        }
        .v-mob-cat:hover { border-color: #93c5fd; color: #2563eb; }
        .v-mob-cat.active { background: #2563eb; color: #fff; border-color: #2563eb; }

        /* ── Combined row: cats + filters + icons ── */
        .v-combined-row {
          display: none;
        }
        @media(min-width:640px) {
          .v-combined-row {
            display: flex;
            align-items: center;
            background: #fff;
            border-top: 1px solid #f3f4f6;
            border-bottom: 1px solid #f3f4f6;
            height: 42px;
            padding: 0;
          }
        }

        /* Home button in combined row — desktop only */
        .v-home-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0 12px;
          height: 100%;
          font-size: 12px;
          font-weight: 700;
          color: #2563eb;
          text-decoration: none;
          flex-shrink: 0;
          border-right: 1px solid #f3f4f6;
          transition: background .12s;
          white-space: nowrap;
        }
        .v-home-btn:hover { background: #eff6ff; }
        .v-home-btn i { font-size: 15px; }

        /* scrollable cats section */
        .v-cats-scroll {
          display: flex;
          align-items: center;
          gap: 2px;
          overflow-x: auto;
          scrollbar-width: none;
          flex: 1;
          min-width: 0;
          padding: 0 10px;
          height: 100%;
        }
        .v-cats-scroll::-webkit-scrollbar { display: none; }

        .v-cat {
          flex-shrink: 0;
          font-size: 12px; font-weight: 600;
          padding: 4px 11px;
          border-radius: 100px;
          border: 1px solid transparent;
          color: #4b5563;
          background: transparent;
          text-decoration: none;
          white-space: nowrap;
          transition: all .12s;
        }
        .v-cat:hover { border-color: #93c5fd; color: #2563eb; background: #eff6ff; }
        .v-cat.active { background: #2563eb; color: #fff; border-color: #2563eb; }

        /* divider */
        .v-col-div {
          width: 1px; height: 22px; background: #e5e7eb; flex-shrink: 0;
        }

        /* filter buttons */
        .v-filters-group {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0 8px;
          flex-shrink: 0;
        }

        .v-flt-select {
          border:1px solid #e5e7eb; border-radius:7px; padding:0 8px; height:28px;
          font-size:12px; color:#374151; background:#fff; cursor:pointer; outline:none;
          transition: border-color .12s;
        }
        .v-flt-select:hover { border-color: #93c5fd; }
        .v-flt-select:focus { border-color: #2563eb; }

        .v-flt-btn {
          display:flex; align-items:center; gap:4px; padding:0 10px; height:28px;
          border-radius:7px; font-size:12px; font-weight:600; color:#4b5563;
          border:1px solid #e5e7eb; background:#fff; cursor:pointer; white-space:nowrap;
          transition:all .12s; user-select:none;
        }
        .v-flt-btn:hover { border-color:#93c5fd; color:#2563eb; background:#f8faff; }
        .v-flt-btn.act  { background:#eff6ff; border-color:#93c5fd; color:#2563eb; }
        .v-flt-btn i    { font-size:13px; }

        /* ── Dropdown panel ── */
        .v-drop {
          background:#fff;
          border:1px solid #e2e8f0;
          border-radius:14px;
          box-shadow:0 12px 32px rgba(0,0,0,.14), 0 2px 8px rgba(0,0,0,.06);
          padding:16px;
          min-width:230px;
          pointer-events: all;
        }
        .v-drop-lbl {
          font-size:10px; font-weight:700; color:#9ca3af;
          text-transform:uppercase; letter-spacing:.06em; margin-bottom:12px;
        }

        /* Price inputs */
        .v-price-row { display:grid; grid-template-columns:1fr 14px 1fr; align-items:center; gap:8px; }
        .v-price-in {
          border:1.5px solid #e5e7eb; border-radius:8px; padding:7px 10px;
          font-size:13px; color:#374151; outline:none; width:100%;
          transition: border-color .15s, box-shadow .15s;
          -webkit-appearance: none;
        }
        .v-price-in:focus {
          border-color:#3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,.15);
        }
        .v-price-in::placeholder { color:#c4c9d4; }

        .v-price-hint {
          font-size:10px; color:#9ca3af; margin-top:8px; text-align:center;
        }

        .v-apply {
          width:100%; margin-top:12px; padding:8px; border-radius:8px;
          background:#2563eb; color:#fff; border:none; font-size:13px;
          font-weight:600; cursor:pointer; transition: background .12s;
          letter-spacing:.01em;
        }
        .v-apply:hover { background:#1d4ed8; }
        .v-apply:active { background:#1e40af; }

        .v-clr-flt {
          width:100%; margin-top:6px; padding:6px; border-radius:8px;
          background:transparent; color:#6b7280; border:1px solid #e5e7eb;
          font-size:12px; cursor:pointer; transition: all .12s;
        }
        .v-clr-flt:hover { border-color:#f87171; color:#ef4444; background:#fff5f5; }

        /* Brand checkbox list */
        .v-brand-list {
          display:flex; flex-direction:column; gap:2px;
          max-height:220px; overflow-y:auto; margin:0 -4px; padding:0 4px;
          scrollbar-width:thin; scrollbar-color:#e5e7eb transparent;
        }
        .v-brand-list::-webkit-scrollbar { width:4px; }
        .v-brand-list::-webkit-scrollbar-thumb { background:#e5e7eb; border-radius:4px; }

        .v-brand-item {
          display:flex; align-items:center; gap:9px;
          padding:6px 8px; border-radius:8px;
          font-size:13px; color:#374151; cursor:pointer;
          transition: background .1s;
          user-select: none;
        }
        .v-brand-item:hover { background:#f3f4f6; }
        .v-brand-item input[type="checkbox"] {
          width:15px; height:15px; cursor:pointer;
          accent-color: #2563eb;
          flex-shrink: 0;
        }

        .v-view-btn {
          padding:4px 5px; border-radius:6px; border:1px solid #e5e7eb;
          background:#fff; cursor:pointer; display:flex; align-items:center;
          justify-content:center; transition: all .12s;
        }
        .v-view-btn:hover { border-color:#93c5fd; }
        .v-view-btn.on { background:#2563eb; border-color:#2563eb; }
        .v-view-btn i  { font-size:15px; color:#9ca3af; }
        .v-view-btn.on i { color:#fff; }

        /* icon group on the right */
        .v-icons-group {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          padding: 0 6px 0 4px;
          gap: 0;
        }

        .v-tab {
          display:flex; flex-direction:column; align-items:center;
          justify-content:center; gap:2px; padding:4px 10px; height:42px;
          border:none; background:none; cursor:pointer; text-decoration:none;
          position:relative; color:#6b7280; transition:color .12s;
          flex-shrink: 0;
        }
        .v-tab:hover { color:#2563eb; }
        .v-tab.wa   { color:#25D366; }
        .v-tab.call { color:#16a34a; }
        .v-tab.mail { color:#2563eb; }
        .v-tab i    { font-size:18px; line-height:1; }
        .v-tab-lbl  { font-size:9px; font-weight:700; line-height:1; white-space:nowrap; }
        .v-badge {
          position:absolute; top:4px; right:6px;
          background:#ef4444; color:#fff; font-size:8px; font-weight:800;
          min-width:14px; height:14px; border-radius:100px;
          display:flex; align-items:center; justify-content:center; padding:0 3px;
        }
        .v-divider { width:1px; height:20px; background:#e5e7eb; margin:0 4px; flex-shrink:0; align-self:center; }

        /* User dropdown */
        .v-udrop {
          position:absolute; right:0; top:calc(100% + 4px); width:210px;
          background:#fff; border:1px solid #e5e7eb; border-radius:14px;
          box-shadow:0 8px 24px rgba(0,0,0,.1); z-index:300; overflow:hidden;
        }
        .v-udrop-mob {
          position:fixed; bottom:60px; right:8px; width:210px;
          background:#fff; border:1px solid #e5e7eb; border-radius:14px;
          box-shadow:0 8px 24px rgba(0,0,0,.1); z-index:300; overflow:hidden;
        }
        .v-dh { padding:12px 14px; border-bottom:1px solid #e5e7eb; }
        .v-dh-name  { font-size:13px; font-weight:600; color:#111; }
        .v-dh-email { font-size:11px; color:#6b7280; margin-top:1px; }
        .v-dlink {
          display:flex; align-items:center; gap:10px; padding:10px 14px;
          font-size:13px; color:#374151; text-decoration:none;
        }
        .v-dlink:hover { background:#f9fafb; }
        .v-dlink i { font-size:16px; color:#9ca3af; }
        .v-dsignout {
          display:flex; align-items:center; gap:10px; padding:10px 14px;
          font-size:13px; color:#dc2626; background:none; border:none;
          border-top:1px solid #e5e7eb; width:100%; cursor:pointer; text-align:left;
        }
        .v-dsignout:hover { background:#fef2f2; }
        .v-dsignout i { font-size:16px; }

        /* Bottom tab bar */
        .v-tabbar {
          display:flex; align-items:stretch; background:#fff;
          border-top:1px solid #e5e7eb;
          position:fixed; bottom:0; left:0; right:0; z-index:999;
          padding-bottom:env(safe-area-inset-bottom,0);
          box-shadow:0 -1px 10px rgba(0,0,0,.08);
        }
        @media(min-width:640px) { .v-tabbar { display:none; } }

        .v-tabbar .v-tab {
          flex:1; flex-direction:column; padding:7px 2px 9px; height:auto; gap:3px;
        }
        .v-tabbar .v-tab i { font-size:21px; }
        .v-tabbar .v-badge { right:calc(50% - 18px); top:5px; }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50" style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>

        {/* Marquee */}
        <div style={{ background: "#08112a", overflow: "hidden", padding: "4px 0" }}>
          <div className="v-marquee">
            {[
              "⚡ Flash deals every day",
              "🚚 Fast delivery countrywide",
              "🔒 100% secure payments",
              "↩️ Easy returns",
              "⚡ Flash deals every day",
              "🚚 Fast delivery countrywide",
              "🔒 100% secure payments",
              "↩️ Easy returns",
            ].map((t, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,.8)", padding: "0 36px", whiteSpace: "nowrap" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div style={{ background: "#fff", padding: "6px 10px" }}>
          <form onSubmit={handleSearch} style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div className="v-search" style={{ height: 36, borderRadius: 109, width: "100%" }}>
              <select
                value={filters.category}
                onChange={e => dispatch({ type: "SET_FILTER", filter: { category: e.target.value } })}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c} style={{ textTransform: "capitalize" }}>
                    {c === "all" ? "All Categories" : c}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={searchVal}
                onChange={handleSearchChange}
                placeholder="Search products, brands and more…"
              />
              {searchVal && (
                <button type="button" onClick={handleClear} className="v-xclear">×</button>
              )}
            </div>
          </form>
        </div>

        {/* ── Mobile category strip — below search, mobile only, non-homepage ── */}
        {!isHomepage && (
          <div className="v-mob-cats">
            {CATEGORIES.map(cat => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                onClick={() => dispatch({ type: "SET_FILTER", filter: { category: cat } })}
                className={`v-mob-cat${filters.category === cat ? " active" : ""}`}
              >
                {cat === "all" ? "All" : cat}
              </Link>
            ))}
          </div>
        )}

        {/* ── Combined row ── desktop only, hidden on homepage */}
        {!isHomepage && (
          <div className="v-combined-row" style={{ maxWidth: "100%", margin: "0 auto" }}>

            {/* Home button — desktop only */}
            <Link to="/" className="v-home-btn">
              <i className="ti ti-home" />
              Home
            </Link>

            {/* Scrollable category pills */}
            <div className="v-cats-scroll">
              {CATEGORIES.map(cat => (
                <Link
                  key={cat}
                  to={`/products?category=${cat}`}
                  onClick={() => dispatch({ type: "SET_FILTER", filter: { category: cat } })}
                  className={`v-cat${filters.category === cat ? " active" : ""}`}
                >
                  {cat === "all" ? "All" : cat}
                </Link>
              ))}
            </div>

            {/* Filter controls — only when showFilterBar */}
            {showFilterBar && (
              <>
                <div className="v-col-div" />
                <div className="v-filters-group">

                  {/* Sort select */}
                  <select
                    value={sortValue}
                    onChange={e => onSortChange(e.target.value)}
                    className="v-flt-select"
                    style={{ maxWidth: 140 }}
                  >
                    {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>

                  {/* ── Price dropdown ── */}
                  <div ref={priceDropRef} style={{ position: "relative" }}>
                    <button
                      type="button"
                      onClick={() => { setPriceDropOpen(o => !o); setBrandDropOpen(false); }}
                      className={`v-flt-btn${priceDropOpen || priceIsActive ? " act" : ""}`}
                    >
                      <i className="ti ti-currency-dollar" />
                      {priceLabel}
                      <i
                        className="ti ti-chevron-down"
                        style={{ transition: "transform .15s", transform: priceDropOpen ? "rotate(180deg)" : "none" }}
                      />
                    </button>

                    <DropdownPortal
                      anchorRef={priceDropRef}
                      open={priceDropOpen}
                      onMount={node => { pricePortalRef.current = node; }}
                    >
                      <div className="v-drop">
                        <div className="v-drop-lbl">Price range (KES)</div>
                        <div className="v-price-row">
                          <input
                            className="v-price-in"
                            type="number"
                            min="0"
                            placeholder="Min"
                            value={minInput}
                            onChange={e => setMinInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && applyPriceRange()}
                          />
                          <span style={{ textAlign: "center", color: "#9ca3af", fontSize: 12, fontWeight: 600 }}>–</span>
                          <input
                            className="v-price-in"
                            type="number"
                            min="0"
                            placeholder="Max"
                            value={maxInput}
                            onChange={e => setMaxInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && applyPriceRange()}
                          />
                        </div>
                        <p className="v-price-hint">Press Enter or click Apply</p>
                        <button type="button" className="v-apply" onClick={applyPriceRange}>
                          Apply filter
                        </button>
                        {priceIsActive && (
                          <button type="button" className="v-clr-flt" onClick={clearPrice}>
                            Clear price filter
                          </button>
                        )}
                      </div>
                    </DropdownPortal>
                  </div>

                  {/* ── Brand dropdown ── */}
                  <div ref={brandDropRef} style={{ position: "relative" }}>
                    <button
                      type="button"
                      onClick={() => { setBrandDropOpen(o => !o); setPriceDropOpen(false); }}
                      className={`v-flt-btn${brandDropOpen || activeBrandCount > 0 ? " act" : ""}`}
                    >
                      <i className="ti ti-tag" />
                      Brand{activeBrandCount > 0 ? ` (${activeBrandCount})` : ""}
                      <i
                        className="ti ti-chevron-down"
                        style={{ transition: "transform .15s", transform: brandDropOpen ? "rotate(180deg)" : "none" }}
                      />
                    </button>

                    <DropdownPortal
                      anchorRef={brandDropRef}
                      open={brandDropOpen}
                      onMount={node => { brandPortalRef.current = node; }}
                    >
                      <div className="v-drop" style={{ minWidth: 190 }}>
                        <div className="v-drop-lbl">
                          Filter by brand
                          {activeBrandCount > 0 && (
                            <span style={{ marginLeft: 6, color: "#2563eb" }}>({activeBrandCount} selected)</span>
                          )}
                        </div>
                        <div className="v-brand-list">
                          {brands.map(b => (
                            <label key={b} className="v-brand-item">
                              <input
                                type="checkbox"
                                checked={selectedBrands.includes(b)}
                                onChange={() => onToggleBrand(b)}
                              />
                              {b}
                            </label>
                          ))}
                        </div>
                        {activeBrandCount > 0 && (
                          <button
                            type="button"
                            onClick={clearBrands}
                            className="v-clr-flt"
                            style={{ marginTop: 10 }}
                          >
                            Clear brand filters
                          </button>
                        )}
                      </div>
                    </DropdownPortal>
                  </div>

                  {/* Reset all */}
                  {(priceIsActive || activeBrandCount > 0) && (
                    <button
                      type="button"
                      onClick={onResetAll}
                      className="v-flt-btn"
                      style={{ color: "#dc2626", borderColor: "#fecaca" }}
                    >
                      <i className="ti ti-x" /> Reset all
                    </button>
                  )}

                  {/* Item count */}
                  <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500, whiteSpace: "nowrap" }}>
                    {filteredCount != null ? `${filteredCount} item${filteredCount !== 1 ? "s" : ""}` : ""}
                  </span>

                  {/* View toggle */}
                  <div style={{ display: "flex", gap: 3 }}>
                    {[
                      { mode: "grid", icon: "ti-layout-grid" },
                      { mode: "list", icon: "ti-layout-list" },
                    ].map(({ mode, icon }) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => onViewChange(mode)}
                        className={`v-view-btn${viewMode === mode ? " on" : ""}`}
                        title={`${mode} view`}
                      >
                        <i className={`ti ${icon}`} />
                      </button>
                    ))}
                  </div>

                </div>
              </>
            )}

            <div className="v-col-div" />

            {/* Icon group — RIGHT */}
            <div className="v-icons-group">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="v-tab wa">
                <i className="ti ti-brand-whatsapp" />
                <span className="v-tab-lbl">WhatsApp</span>
              </a>
              <a href={TEL_URL} className="v-tab call">
                <i className="ti ti-phone" />
                <span className="v-tab-lbl">Call</span>
              </a>
              <a href={MAIL_URL} className="v-tab mail">
                <i className="ti ti-mail" />
                <span className="v-tab-lbl">Email</span>
              </a>
              <div className="v-divider" />
              <Link to="/wishlist" className="v-tab">
                <i className="ti ti-heart" />
                {wishlist.length > 0 && <span className="v-badge">{wishlist.length > 9 ? "9+" : wishlist.length}</span>}
                <span className="v-tab-lbl">Wishlist</span>
              </Link>
              <Link to="/cart" className="v-tab">
                <i className="ti ti-shopping-cart" />
                {cartCount > 0 && <span className="v-badge">{cartCount > 9 ? "9+" : cartCount}</span>}
                <span className="v-tab-lbl">Cart</span>
              </Link>
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <>
                    <button type="button" onClick={() => setUserMenuOpen(o => !o)} className="v-tab">
                      <div
                        className="neon-av"
                        style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#0ea5e9,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 11 }}
                      >
                        {user.name[0].toUpperCase()}
                      </div>
                      <span className="v-tab-lbl">{user.name.split(" ")[0].slice(0, 8)}</span>
                    </button>
                    {userMenuOpen && (
                      <div className="v-udrop">
                        <div className="v-dh">
                          <div className="v-dh-name">{user.name}</div>
                          <div className="v-dh-email">{user.email}</div>
                        </div>
                        <Link to="/account"  onClick={() => setUserMenuOpen(false)} className="v-dlink"><i className="ti ti-user" />My Account</Link>
                        <Link to="/orders"   onClick={() => setUserMenuOpen(false)} className="v-dlink"><i className="ti ti-package" />My Orders</Link>
                        <Link to="/wishlist" onClick={() => setUserMenuOpen(false)} className="v-dlink"><i className="ti ti-heart" />Wishlist ({wishlist.length})</Link>
                        <button type="button" onClick={() => { logout(); setUserMenuOpen(false); }} className="v-dsignout">
                          <i className="ti ti-logout" />Sign Out
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 8, borderLeft: "1px solid #e5e7eb", marginLeft: 2 }}>
                    <Link to="/auth" style={{ fontSize: 12, fontWeight: 600, color: "#374151", textDecoration: "none" }}>Sign in</Link>
                    <Link to="/auth?mode=register" style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "#2563eb", borderRadius: 100, padding: "4px 12px", textDecoration: "none", whiteSpace: "nowrap" }}>Register</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile bottom tab bar */}
      <div className="v-tabbar sm:hidden">
        <Link to="/" className="v-tab">
          <i className="ti ti-home" />
          <span className="v-tab-lbl">Home</span>
        </Link>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="v-tab wa">
          <i className="ti ti-brand-whatsapp" />
          <span className="v-tab-lbl">Chat</span>
        </a>
        <a href={TEL_URL} className="v-tab call">
          <i className="ti ti-phone" />
          <span className="v-tab-lbl">Call</span>
        </a>
        <Link to="/wishlist" className="v-tab">
          <i className="ti ti-heart" />
          {wishlist.length > 0 && <span className="v-badge">{wishlist.length > 9 ? "9+" : wishlist.length}</span>}
          <span className="v-tab-lbl">Wishlist</span>
        </Link>
        <Link to="/cart" className="v-tab">
          <i className="ti ti-shopping-cart" />
          {cartCount > 0 && <span className="v-badge">{cartCount > 9 ? "9+" : cartCount}</span>}
          <span className="v-tab-lbl">Cart</span>
        </Link>
        <div style={{ flex: 1, position: "relative" }} ref={userMenuRef}>
          {user ? (
            <>
              <button type="button" onClick={() => setUserMenuOpen(o => !o)} className="v-tab" style={{ width: "100%" }}>
                <div
                  className="neon-av"
                  style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#0ea5e9,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 10 }}
                >
                  {user.name[0].toUpperCase()}
                </div>
                <span className="v-tab-lbl">{user.name.split(" ")[0].slice(0, 6)}</span>
              </button>
              {userMenuOpen && (
                <div className="v-udrop-mob">
                  <div className="v-dh">
                    <div className="v-dh-name">{user.name}</div>
                    <div className="v-dh-email">{user.email}</div>
                  </div>
                  <Link to="/account"  onClick={() => setUserMenuOpen(false)} className="v-dlink"><i className="ti ti-user" />My Account</Link>
                  <Link to="/orders"   onClick={() => setUserMenuOpen(false)} className="v-dlink"><i className="ti ti-package" />My Orders</Link>
                  <Link to="/wishlist" onClick={() => setUserMenuOpen(false)} className="v-dlink"><i className="ti ti-heart" />Wishlist ({wishlist.length})</Link>
                  <button type="button" onClick={() => { logout(); setUserMenuOpen(false); }} className="v-dsignout">
                    <i className="ti ti-logout" />Sign Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link to="/auth" className="v-tab" style={{ width: "100%" }}>
              <i className="ti ti-user" />
              <span className="v-tab-lbl">Sign in</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}