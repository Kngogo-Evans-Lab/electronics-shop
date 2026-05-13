// FILE: src/components/Navbar.jsx

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export default function Navbar({
  filteredCount, sortValue, onSortChange, sortOptions,
  viewMode, onViewChange, onPriceRange,
  activePriceMin, activePriceMax,
  brands, selectedBrands, onToggleBrand, onResetAll,
}) {
  const { cartCount, wishlist, user, logout, dispatch } = useApp();
  const [searchVal, setSearchVal]         = useState("");
  const [userMenuOpen, setUserMenuOpen]   = useState(false);
  const [brandDropOpen, setBrandDropOpen] = useState(false);
  const [priceDropOpen, setPriceDropOpen] = useState(false);
  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");

  const navigate     = useNavigate();
  const userMenuRef  = useRef(null);
  const brandDropRef = useRef(null);
  const priceDropRef = useRef(null);

  const showFilterBar = !!(sortOptions && onSortChange);

  useEffect(() => {
    if (activePriceMin === 0 && activePriceMax === Infinity) { setMinInput(""); setMaxInput(""); }
  }, [activePriceMin, activePriceMax]);

  useEffect(() => {
    function close(e) {
      if (userMenuRef.current  && !userMenuRef.current.contains(e.target))  setUserMenuOpen(false);
      if (brandDropRef.current && !brandDropRef.current.contains(e.target)) setBrandDropOpen(false);
      if (priceDropRef.current && !priceDropRef.current.contains(e.target)) setPriceDropOpen(false);
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
    const min = minInput === "" ? 0 : Number(minInput.replace(/,/g, ""));
    const max = maxInput === "" ? Infinity : Number(maxInput.replace(/,/g, ""));
    if (!isNaN(min) && !isNaN(max)) { onPriceRange(min, max); setPriceDropOpen(false); }
  };
  const clearPrice = () => { setMinInput(""); setMaxInput(""); onPriceRange(0, Infinity); };

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
      {/* Tabler Icons */}
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

        /* Category pills */
        .v-cats { display:flex; gap:6px; overflow-x:auto; padding:7px 14px; }
        .v-cats::-webkit-scrollbar { display:none; }
        .v-cats { scrollbar-width:none; }
        .v-cat {
          flex-shrink:0; font-size:12px; font-weight:600; padding:4px 12px;
          border-radius:100px; border:1px solid #e5e7eb; color:#4b5563;
          background:#fff; text-decoration:none; white-space:nowrap; transition:all .12s;
        }
        .v-cat:hover { border-color:#93c5fd; color:#2563eb; background:#eff6ff; }

        /* Filter bar */
        .v-flt-select {
          border:1px solid #e5e7eb; border-radius:7px; padding:0 8px; height:28px;
          font-size:12px; color:#374151; background:#fff; cursor:pointer; outline:none;
        }
        .v-flt-btn {
          display:flex; align-items:center; gap:4px; padding:0 10px; height:28px;
          border-radius:7px; font-size:12px; font-weight:600; color:#4b5563;
          border:1px solid #e5e7eb; background:#fff; cursor:pointer; white-space:nowrap; transition:all .12s;
        }
        .v-flt-btn:hover { border-color:#93c5fd; color:#2563eb; }
        .v-flt-btn.act  { background:#eff6ff; border-color:#93c5fd; color:#2563eb; }
        .v-flt-btn i    { font-size:13px; }
        .v-drop {
          position:absolute; top:calc(100% + 6px); left:0; z-index:200;
          background:#fff; border:1px solid #e5e7eb; border-radius:12px;
          box-shadow:0 8px 24px rgba(0,0,0,.1); padding:12px; min-width:220px;
        }
        .v-drop-lbl { font-size:10px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:.06em; margin-bottom:10px; }
        .v-price-row { display:grid; grid-template-columns:1fr 14px 1fr; align-items:center; gap:6px; }
        .v-price-in {
          border:1px solid #e5e7eb; border-radius:7px; padding:5px 8px;
          font-size:12px; color:#374151; outline:none; width:100%;
        }
        .v-price-in:focus { border-color:#3b82f6; }
        .v-price-in::placeholder { color:#9ca3af; }
        .v-apply {
          width:100%; margin-top:10px; padding:6px; border-radius:7px;
          background:#2563eb; color:#fff; border:none; font-size:12px; font-weight:600; cursor:pointer;
        }
        .v-apply:hover { background:#1d4ed8; }
        .v-clr-flt {
          width:100%; margin-top:6px; padding:5px; border-radius:7px;
          background:transparent; color:#6b7280; border:1px solid #e5e7eb; font-size:11px; cursor:pointer;
        }
        .v-clr-flt:hover { border-color:#f87171; color:#ef4444; }
        .v-view-btn {
          padding:4px 5px; border-radius:6px; border:1px solid #e5e7eb;
          background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center;
        }
        .v-view-btn.on { background:#2563eb; border-color:#2563eb; }
        .v-view-btn i  { font-size:15px; color:#9ca3af; }
        .v-view-btn.on i { color:#fff; }

        /* Bottom tab bar — always fixed */
        .v-tabbar {
          display:flex; align-items:stretch; background:#fff;
          border-top:1px solid #e5e7eb;
          position:fixed; bottom:0; left:0; right:0; z-index:999;
          padding-bottom:env(safe-area-inset-bottom,0);
          box-shadow:0 -1px 10px rgba(0,0,0,.08);
        }
        @media(min-width:640px) {
          .v-tabbar { display:none; }
          .v-tabbar-desk { display:flex !important; }
        }
        .v-tabbar-desk {
          display:none; align-items:center; justify-content:flex-end;
          gap:0; padding:0 20px; height:40px;
          background:#fff; border-bottom:1px solid #f3f4f6;
        }

        .v-tab {
          flex:1; display:flex; flex-direction:column; align-items:center;
          justify-content:center; gap:3px; padding:7px 2px 9px;
          border:none; background:none; cursor:pointer; text-decoration:none;
          position:relative; color:#6b7280; transition:color .12s;
        }
        .v-tab:hover { color:#2563eb; }
        .v-tab.wa   { color:#25D366; }
        .v-tab.call { color:#16a34a; }
        .v-tab.mail { color:#2563eb; }
        .v-tab.wa:hover,.v-tab.call:hover,.v-tab.mail:hover { opacity:.8; color:inherit; }
        .v-tab i    { font-size:21px; line-height:1; }
        .v-tab-lbl  { font-size:9px; font-weight:700; line-height:1; white-space:nowrap; }
        .v-badge {
          position:absolute; top:5px; right:calc(50% - 18px);
          background:#ef4444; color:#fff; font-size:8px; font-weight:800;
          min-width:14px; height:14px; border-radius:100px;
          display:flex; align-items:center; justify-content:center; padding:0 3px;
        }

        /* Desktop tab items */
        .v-tabbar-desk .v-tab {
          flex:none; flex-direction:column; padding:4px 12px; gap:2px;
          border-radius:8px; min-width:52px;
        }
        .v-tabbar-desk .v-tab i   { font-size:18px; }
        .v-tabbar-desk .v-tab-lbl { font-size:9px; }
        .v-tabbar-desk .v-badge   { right:6px; top:2px; }
        .v-divider { width:1px; height:20px; background:#e5e7eb; margin:0 6px; flex-shrink:0; align-self:center; }

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

        {/* Top bar: Search only — full width, no logo */}
<div style={{ background: "#fff", padding: "5px 10px", borderBottom: "1px solid #2ce714" }}>
  <form onSubmit={handleSearch} style={{ maxWidth: 1280, margin: "0 auto" }}>
    <div className="v-search" style={{ height: 36, borderRadius: 109, width: "102%" }}>
      <select onChange={e => dispatch({ type: "SET_FILTER", filter: { category: e.target.value } })}>
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
        {/* Desktop icon row */}
        <div className="v-tabbar-desk">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="v-tab wa">
            <i className="ti ti-brand-whatsapp" aria-hidden="true" />
            <span className="v-tab-lbl">WhatsApp</span>
          </a>
          <a href={TEL_URL} className="v-tab call">
            <i className="ti ti-phone" aria-hidden="true" />
            <span className="v-tab-lbl">Call</span>
          </a>
          <a href={MAIL_URL} className="v-tab mail">
            <i className="ti ti-mail" aria-hidden="true" />
            <span className="v-tab-lbl">Email</span>
          </a>
          <div className="v-divider" />
          <Link to="/wishlist" className="v-tab">
            <i className="ti ti-heart" aria-hidden="true" />
            {wishlist.length > 0 && <span className="v-badge">{wishlist.length > 9 ? "9+" : wishlist.length}</span>}
            <span className="v-tab-lbl">Wishlist</span>
          </Link>
          <Link to="/cart" className="v-tab">
            <i className="ti ti-shopping-cart" aria-hidden="true" />
            {cartCount > 0 && <span className="v-badge">{cartCount > 9 ? "9+" : cartCount}</span>}
            <span className="v-tab-lbl">Cart</span>
          </Link>
          <div className="relative" ref={userMenuRef}>
            {user ? (
              <>
                <button onClick={() => setUserMenuOpen(o => !o)} className="v-tab">
                  <div className="neon-av" style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#0ea5e9,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 11 }}>
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
                    <button onClick={() => { logout(); setUserMenuOpen(false); }} className="v-dsignout">
                      <i className="ti ti-logout" />Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 10, borderLeft: "1px solid #e5e7eb", marginLeft: 4 }}>
                <Link to="/auth" style={{ fontSize: 13, fontWeight: 600, color: "#374151", textDecoration: "none" }}>Sign in</Link>
                <Link to="/auth?mode=register" style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "#2563eb", borderRadius: 100, padding: "5px 14px", textDecoration: "none", whiteSpace: "nowrap" }}>Register</Link>
              </div>
            )}
          </div>
        </div>

        {/* Category pills + filter bar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div className="v-cats">
              {CATEGORIES.map(cat => (
                <Link key={cat} to={`/products?category=${cat}`}
                  onClick={() => dispatch({ type: "SET_FILTER", filter: { category: cat } })}
                  className="v-cat">
                  {cat === "all" ? "All" : cat}
                </Link>
              ))}
            </div>

            {showFilterBar && (
              <div className="hidden sm:flex items-center gap-2 px-4 pb-2">
                <select value={sortValue} onChange={e => onSortChange(e.target.value)} className="v-flt-select" style={{ maxWidth: 150 }}>
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>

                <div className="relative" ref={priceDropRef}>
                  <button onClick={() => { setPriceDropOpen(o => !o); setBrandDropOpen(false); }}
                    className={`v-flt-btn ${priceDropOpen || priceIsActive ? "act" : ""}`}>
                    <i className="ti ti-currency-dollar" />
                    {priceLabel}
                    <i className="ti ti-chevron-down" style={{ transition: "transform .15s", transform: priceDropOpen ? "rotate(180deg)" : "none" }} />
                  </button>
                  {priceDropOpen && (
                    <div className="v-drop">
                      <div className="v-drop-lbl">Price range (KES)</div>
                      <div className="v-price-row">
                        <input className="v-price-in" type="number" min="0" placeholder="Min" value={minInput}
                          onChange={e => setMinInput(e.target.value)} onKeyDown={e => e.key === "Enter" && applyPriceRange()} />
                        <span style={{ textAlign: "center", color: "#9ca3af", fontSize: 12 }}>–</span>
                        <input className="v-price-in" type="number" min="0" placeholder="Max" value={maxInput}
                          onChange={e => setMaxInput(e.target.value)} onKeyDown={e => e.key === "Enter" && applyPriceRange()} />
                      </div>
                      <button className="v-apply" onClick={applyPriceRange}>Apply</button>
                      {priceIsActive && <button className="v-clr-flt" onClick={clearPrice}>Clear</button>}
                    </div>
                  )}
                </div>

                <div className="relative" ref={brandDropRef}>
                  <button onClick={() => { setBrandDropOpen(o => !o); setPriceDropOpen(false); }}
                    className={`v-flt-btn ${brandDropOpen || activeBrandCount > 0 ? "act" : ""}`}>
                    <i className="ti ti-tag" />
                    Brand{activeBrandCount > 0 ? ` (${activeBrandCount})` : ""}
                    <i className="ti ti-chevron-down" style={{ transition: "transform .15s", transform: brandDropOpen ? "rotate(180deg)" : "none" }} />
                  </button>
                  {brandDropOpen && (
                    <div className="v-drop" style={{ minWidth: 160 }}>
                      <div className="v-drop-lbl">Brand</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto" }}>
                        {brands.map(b => (
                          <label key={b} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#374151", cursor: "pointer" }}>
                            <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => onToggleBrand(b)} style={{ width: 14, height: 14, cursor: "pointer" }} />
                            {b}
                          </label>
                        ))}
                      </div>
                      {activeBrandCount > 0 && (
                        <button onClick={() => brands.forEach(b => selectedBrands.includes(b) && onToggleBrand(b))}
                          style={{ fontSize: 11, color: "#2563eb", marginTop: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                          Clear brands
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {(priceIsActive || activeBrandCount > 0) && (
                  <button onClick={onResetAll} className="v-flt-btn" style={{ color: "#dc2626", borderColor: "#fecaca" }}>
                    <i className="ti ti-x" /> Reset all
                  </button>
                )}

                <span style={{ marginLeft: "auto", fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>
                  {filteredCount} item{filteredCount !== 1 ? "s" : ""}
                </span>

                <div style={{ display: "flex", gap: 4 }}>
                  {[
                    { mode: "grid", icon: "ti-layout-grid" },
                    { mode: "list", icon: "ti-layout-list" },
                  ].map(({ mode, icon }) => (
                    <button key={mode} onClick={() => onViewChange(mode)} className={`v-view-btn ${viewMode === mode ? "on" : ""}`}>
                      <i className={`ti ${icon}`} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar — fixed always */}
      <div className="v-tabbar sm:hidden">
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="v-tab wa">
          <i className="ti ti-brand-whatsapp" aria-hidden="true" />
          <span className="v-tab-lbl">Chat</span>
        </a>
        <a href={TEL_URL} className="v-tab call">
          <i className="ti ti-phone" aria-hidden="true" />
          <span className="v-tab-lbl">Call</span>
        </a>
        <a href={MAIL_URL} className="v-tab mail">
          <i className="ti ti-mail" aria-hidden="true" />
          <span className="v-tab-lbl">Email</span>
        </a>
        <Link to="/wishlist" className="v-tab">
          <i className="ti ti-heart" aria-hidden="true" />
          {wishlist.length > 0 && <span className="v-badge">{wishlist.length > 9 ? "9+" : wishlist.length}</span>}
          <span className="v-tab-lbl">Wishlist</span>
        </Link>
        <Link to="/cart" className="v-tab">
          <i className="ti ti-shopping-cart" aria-hidden="true" />
          {cartCount > 0 && <span className="v-badge">{cartCount > 9 ? "9+" : cartCount}</span>}
          <span className="v-tab-lbl">Cart</span>
        </Link>
        <div style={{ flex: 1, position: "relative" }} ref={userMenuRef}>
          {user ? (
            <>
              <button onClick={() => setUserMenuOpen(o => !o)} className="v-tab" style={{ width: "100%" }}>
                <div className="neon-av" style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#0ea5e9,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 10 }}>
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
                  <button onClick={() => { logout(); setUserMenuOpen(false); }} className="v-dsignout">
                    <i className="ti ti-logout" />Sign Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link to="/auth" className="v-tab" style={{ width: "100%" }}>
              <i className="ti ti-user" aria-hidden="true" />
              <span className="v-tab-lbl">Sign in</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}