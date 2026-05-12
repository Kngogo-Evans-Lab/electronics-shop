// FILE: src/components/Navbar.jsx
// CHANGES:
// 1) WhatsApp replaced with Phone "Contact Seller" icon (desktop + mobile)
// 2) Mobile navbar: icons pushed to top-right, compact & organized layout
// 3) Everything else untouched

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/products";

export function VantixKenyaLogo({ size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: "linear-gradient(140deg,#1a3a8f,#08112a)",
        borderRadius: size * 0.25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2L18 7V13L10 18L2 13V7L10 2Z"
          stroke="#f5a623"
          strokeWidth="1.6"
          fill="rgba(245,166,35,0.12)"
        />
        <circle cx="10" cy="10" r="3" fill="#f5a623" />
      </svg>
    </div>
  );
}

export default function Navbar({
  filteredCount,
  sortValue,
  onSortChange,
  sortOptions,
  viewMode,
  onViewChange,
  onPriceRange,
  activePriceMin,
  activePriceMax,
  brands,
  selectedBrands,
  onToggleBrand,
  onResetAll,
  onOpenMobileFilters,
}) {
  const { cartCount, wishlist, user, logout, dispatch } = useApp();
  const [searchVal, setSearchVal] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [brandDropOpen, setBrandDropOpen] = useState(false);
  const [priceDropOpen, setPriceDropOpen] = useState(false);
  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");

  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const brandDropRef = useRef(null);
  const priceDropRef = useRef(null);

  const showFilterBar = !!(sortOptions && onSortChange);

  useEffect(() => {
    if (activePriceMin === 0 && activePriceMax === Infinity) {
      setMinInput("");
      setMaxInput("");
    }
  }, [activePriceMin, activePriceMax]);

  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (brandDropRef.current && !brandDropRef.current.contains(e.target)) setBrandDropOpen(false);
      if (priceDropRef.current && !priceDropRef.current.contains(e.target)) setPriceDropOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    navigate(val.trim() ? `/products?search=${encodeURIComponent(val.trim())}` : "/products");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(searchVal.trim() ? `/products?search=${encodeURIComponent(searchVal.trim())}` : "/products");
    setMobileSearchOpen(false);
  };

  const handleClear = () => {
    setSearchVal("");
    navigate("/products");
  };

  const applyPriceRange = () => {
    const min = minInput === "" ? 0 : Number(minInput.replace(/,/g, ""));
    const max = maxInput === "" ? Infinity : Number(maxInput.replace(/,/g, ""));
    if (!isNaN(min) && !isNaN(max)) {
      onPriceRange(min, max);
      setPriceDropOpen(false);
    }
  };

  const clearPrice = () => {
    setMinInput("");
    setMaxInput("");
    onPriceRange(0, Infinity);
  };

  const priceIsActive = activePriceMin > 0 || activePriceMax !== Infinity;
  const priceLabel = (() => {
    if (!priceIsActive) return "Price";
    const fmt = (n) => (n >= 1000 ? `${Math.round(n / 1000)}K` : String(n));
    if (activePriceMax === Infinity) return `> ${fmt(activePriceMin)}`;
    if (activePriceMin === 0) return `< ${fmt(activePriceMax)}`;
    return `${fmt(activePriceMin)} – ${fmt(activePriceMax)}`;
  })();

  const activeBrandCount = selectedBrands?.length ?? 0;

  return (
    <>
      <style>{`
        @keyframes marqueeScroll { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
        .marquee-track { display:inline-flex; animation:marqueeScroll 28s linear infinite; }
        .marquee-track:hover { animation-play-state:paused; }

        @keyframes neonPulse {
          0%,100% { box-shadow:0 0 4px #00f5ff,0 0 10px #00f5ff,0 0 20px #00f5ff,0 0 40px #00bfff; }
          50% { box-shadow:0 0 6px #00f5ff,0 0 16px #00f5ff,0 0 32px #00f5ff,0 0 60px #00bfff; }
        }
        .neon-avatar { animation:neonPulse 2s ease-in-out infinite; border:2px solid #00f5ff; }

        .nav-icon-btn {
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          padding:6px 12px; border-radius:10px; color:#374151; text-decoration:none;
          transition:background .15s,color .15s; position:relative;
          min-width:56px; background:none; border:none; cursor:pointer;
        }
        .nav-icon-btn:hover { background:#eff6ff; color:#2563eb; }
        .nav-icon-btn svg { width:22px; height:22px; }
        .nav-icon-label { font-size:10px; font-weight:700; margin-top:2px; color:#6b7280; white-space:nowrap; }
        .nav-badge {
          position:absolute; top:3px; right:8px;
          min-width:17px; height:17px; padding:0 4px; border-radius:9px;
          background:#ef4444; font-size:10px; font-weight:800; color:#fff;
          display:flex; align-items:center; justify-content:center; line-height:1;
        }

        .mob-icon-btn {
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          padding:3px 4px; border-radius:8px; color:#374151; text-decoration:none;
          transition:background .15s,color .15s; position:relative;
          background:none; border:none; cursor:pointer; gap:1px;
          min-width:38px;
        }
        .mob-icon-btn:hover { background:#eff6ff; color:#2563eb; }
        .mob-icon-btn svg { width:18px; height:18px; flex-shrink:0; }
        .mob-icon-label { font-size:8px; font-weight:700; color:#6b7280; white-space:nowrap; line-height:1; }
        .mob-badge {
          position:absolute; top:0px; right:0px;
          min-width:14px; height:14px; padding:0 3px; border-radius:8px;
          background:#ef4444; font-size:8px; font-weight:800; color:#fff;
          display:flex; align-items:center; justify-content:center; line-height:1;
        }

        #mobile-search-btn { display:none !important; }
        @media (max-width:639px) { #mobile-search-btn { display:flex !important; } }

        .mobile-search-bar {
          position:fixed; top:64px; left:0; right:0;
          background:#fff; border-bottom:2px solid #2563eb;
          padding:10px 16px; z-index:49; box-shadow:0 4px 16px rgba(0,0,0,.08);
        }

        .flt-select {
          border:1px solid #e5e7eb; border-radius:7px;
          padding:3px 6px 3px 8px; font-size:12px; color:#374151;
          background:#fff; cursor:pointer; outline:none; transition:border-color .15s; height:28px;
        }
        .flt-select:hover { border-color:#93c5fd; }
        .flt-select:focus { border-color:#3b82f6; }
        .flt-drop-btn {
          display:flex; align-items:center; gap:4px;
          padding:3px 10px; border-radius:7px; font-size:12px; font-weight:600;
          color:#4b5563; border:1px solid #e5e7eb; background:#fff;
          cursor:pointer; height:28px; white-space:nowrap; transition:all .12s;
        }
        .flt-drop-btn:hover { border-color:#93c5fd; color:#2563eb; }
        .flt-drop-btn.active { background:#eff6ff; border-color:#93c5fd; color:#2563eb; }
        .flt-drop-btn svg { width:12px; height:12px; }
        .flt-dropdown {
          position:absolute; top:calc(100% + 6px); left:0;
          background:#fff; border:1px solid #e5e7eb; border-radius:12px;
          box-shadow:0 8px 24px rgba(0,0,0,.1); z-index:100; padding:12px; min-width:220px;
        }
        .price-inputs { display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:6px; margin-top:4px; }
        .price-input {
          width:100%; padding:5px 8px; border:1px solid #e5e7eb; border-radius:7px;
          font-size:12px; color:#374151; outline:none; transition:border-color .15s; box-sizing:border-box;
        }
        .price-input:focus { border-color:#3b82f6; }
        .price-input::placeholder { color:#9ca3af; }
        .price-sep { font-size:12px; color:#9ca3af; text-align:center; }
        .price-apply {
          width:100%; margin-top:10px; padding:6px; border-radius:7px;
          background:#2563eb; color:#fff; border:none; font-size:12px; font-weight:600;
          cursor:pointer; transition:background .15s;
        }
        .price-apply:hover { background:#1d4ed8; }
        .price-clear {
          width:100%; margin-top:6px; padding:5px; border-radius:7px;
          background:transparent; color:#6b7280; border:1px solid #e5e7eb;
          font-size:11px; cursor:pointer; transition:all .12s;
        }
        .price-clear:hover { border-color:#f87171; color:#ef4444; }
        .view-btn {
          padding:4px; border-radius:6px; border:none; cursor:pointer;
          transition:background .15s,color .15s; display:flex; align-items:center; justify-content:center;
        }
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
        .cat-filter-divider { width:1px; background:#e5e7eb; height:20px; flex-shrink:0; margin:0 8px; }

        @media (max-width:639px) {
          .mobile-nav-row {
            display:flex; align-items:center;
            height:54px; padding:0 10px 0 12px; gap:6px;
          }
          .mobile-nav-logo { flex-shrink:0; min-width:0; }
          .mobile-nav-icons {
            display:flex; align-items:center; gap:10px; flex-shrink:0; margin-left:auto;
          }
        }

        .mob-search-expand {
          overflow:hidden;
          max-height:0;
          transition:max-height 0.22s ease, opacity 0.18s ease;
          opacity:0;
          background:#fff;
          border-top:1px solid #f3f4f6;
        }
        .mob-search-expand.open {
          max-height:60px;
          opacity:1;
        }
        .mob-search-inner {
          display:flex; align-items:center; gap:8px;
          padding:8px 12px;
        }
        .mob-search-inner input {
          flex:1; padding:7px 12px; font-size:13px; color:#374151;
          border:1.5px solid #2563eb; border-radius:20px; outline:none;
          background:#f9fafb;
        }
        .mob-search-inner input::placeholder { color:#9ca3af; }
        .mob-search-submit {
          flex-shrink:0; padding:7px 14px;
          background:#2563eb; color:#fff; border:none; border-radius:20px;
          font-size:12px; font-weight:700; cursor:pointer;
        }
        .mob-search-clear {
          flex-shrink:0; background:none; border:none; font-size:18px;
          color:#9ca3af; cursor:pointer; line-height:1; padding:0 2px;
        }
      `}</style>

      <header className="fixed top-0 left-0 right-0 w-full z-50 shadow-sm" style={{ background: "#fff" }}>
        <div style={{ background: "#08112a", color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 600, padding: "5px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
          <div className="marquee-track">
            {[
              "⚡ Flash deals every day — don't miss out!",
              "🚚 Fast delivery countrywide",
              "🔒 100% secure payments",
              "↩️ Easy returns",
              "⚡ Flash deals every day — don't miss out!",
              "🚚 Fast delivery countrywide",
              "🔒 100% secure payments",
              "↩️ Easy returns",
              "⚡ Vantix — Your Shopping Partner!",

            ].map((text, i) => (
              <span key={i} style={{ padding: "0 48px" }}>{text}</span>
            ))}
          </div>
        </div>

        <div className="bg-white border-b border-gray-200 hidden sm:block">
          <div className="w-full px-3 sm:px-5 lg:px-8">
            <div className="flex items-center h-16 gap-2 sm:gap-8">
              <Link to="/" className="flex items-center gap-2 shrink-0">
                <VantixKenyaLogo size={36} />
                <div className="flex flex-col leading-none">
                  <span className="font-black text-base sm:text-lg text-gray-900 tracking-tight">
                    VANTIX<span style={{ color: "#f5a623" }}>.</span>
                  </span>
                  <span className="text-[9px] font-bold tracking-widest uppercase -mt-0.5" style={{ color: "#6b7a99" }}>SHOP254</span>
                </div>
              </Link>

              <form onSubmit={handleSearch} className="flex-1 flex items-center">
                <div className="flex w-full items-center border-2 border-blue-600 rounded-full overflow-hidden bg-white shadow-sm">
                  <select
                    onChange={(e) => dispatch({ type: "SET_FILTER", filter: { category: e.target.value } })}
                    className="pl-4 pr-2 py-2.5 bg-transparent text-sm text-gray-600 focus:outline-none cursor-pointer capitalize border-r border-gray-200 shrink-0"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c} className="capitalize">{c === "all" ? "All Categories" : c}</option>
                    ))}
                  </select>
                  <div className="relative flex-1 flex items-center">
                    <input
                      type="text"
                      value={searchVal}
                      onChange={handleSearchChange}
                      placeholder="Search for products, brands and more..."
                      className="w-full px-4 py-2.5 text-sm focus:outline-none bg-transparent"
                    />
                    {searchVal && (
                      <button type="button" onClick={handleClear}
                        className="absolute right-2 text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-sm font-semibold transition-colors shrink-0"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
                    </svg>
                    Search
                  </button>
                </div>
              </form>

              <div className="flex items-center gap-1 ml-auto sm:ml-0 sm:gap-3 shrink-0">
                <a href="tel:+254700000000" className="nav-icon-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 22, height: 22, color: "#16a34a" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span className="nav-icon-label">Contact Seller</span>
                </a>

                <Link to="/wishlist" className="nav-icon-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  {wishlist.length > 0 && <span className="nav-badge">{wishlist.length > 9 ? "9+" : wishlist.length}</span>}
                  <span className="nav-icon-label">Wishlist</span>
                </Link>

                <Link to="/cart" className="nav-icon-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  {cartCount > 0 && <span className="nav-badge">{cartCount > 9 ? "9+" : cartCount}</span>}
                  <span className="nav-icon-label">Cart</span>
                </Link>

                <div className="relative" ref={userMenuRef}>
                  {user ? (
                    <>
                      <button onClick={() => setUserMenuOpen(o => !o)} className="nav-icon-btn">
                        <div
                          className="neon-avatar rounded-full flex items-center justify-center text-white font-black"
                          style={{ width: 28, height: 28, fontSize: 13, background: "linear-gradient(135deg,#0ea5e9,#06b6d4,#0891b2)" }}
                        >
                          {user.name[0].toUpperCase()}
                        </div>
                        <span className="nav-icon-label" style={{ marginTop: 3 }}>{user.name.split(" ")[0].slice(0, 8)}</span>
                      </button>
                      {userMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          {[
                            { to: "/account", label: "My Account", d: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" },
                            { to: "/orders", label: "My Orders", d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                            { to: "/wishlist", label: `Wishlist (${wishlist.length})`, d: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" },
                          ].map(item => (
                            <Link
                              key={item.to}
                              to={item.to}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d={item.d} />
                              </svg>
                              {item.label}
                            </Link>
                          ))}
                          <div className="border-t border-gray-100 mt-1">
                            <button
                              onClick={() => {
                                logout();
                                setUserMenuOpen(false);
                              }}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                              </svg>
                              Sign Out
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="hidden sm:flex items-center gap-6 pl-4 border-l border-gray-200">
                      <Link to="/auth" className="text-sm font-semibold text-gray-700 hover:text-blue-600 whitespace-nowrap px-2 py-1">Sign in</Link>
                      <Link to="/auth?mode=register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-full whitespace-nowrap">Create account</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sm:hidden bg-white border-b border-gray-200">
          <div className="mobile-nav-row">
            <Link to="/" className="mobile-nav-logo flex items-center gap-1.5 shrink-0">
              <VantixKenyaLogo size={30} />
              <div className="flex flex-col leading-none">
                <span className="font-black text-sm text-gray-900 tracking-tight">
                  VANTIX<span style={{ color: "#f5a623" }}>.</span>
                </span>
                <span className="text-[8px] font-bold tracking-widest uppercase" style={{ color: "#6b7a99" }}>SHOP254</span>
              </div>
            </Link>

            <div className="mobile-nav-icons">
              <button onClick={() => setMobileSearchOpen(o => !o)} className="mob-icon-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ color: mobileSearchOpen ? "#2563eb" : "currentColor" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
                </svg>
                <span className="mob-icon-label">Search</span>
              </button>

              <a href="tel:+254700000000" className="mob-icon-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ color: "#16a34a" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span className="mob-icon-label">Call</span>
              </a>

              <Link to="/wishlist" className="mob-icon-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {wishlist.length > 0 && <span className="mob-badge">{wishlist.length > 9 ? "9+" : wishlist.length}</span>}
                <span className="mob-icon-label">Wishlist</span>
              </Link>

              <Link to="/cart" className="mob-icon-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {cartCount > 0 && <span className="mob-badge">{cartCount > 9 ? "9+" : cartCount}</span>}
                <span className="mob-icon-label">Cart</span>
              </Link>

              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <>
                    <button onClick={() => setUserMenuOpen(o => !o)} className="mob-icon-btn">
                      <div
                        className="neon-avatar rounded-full flex items-center justify-center text-white font-black"
                        style={{ width: 22, height: 22, fontSize: 11, background: "linear-gradient(135deg,#0ea5e9,#06b6d4,#0891b2)" }}
                      >
                        {user.name[0].toUpperCase()}
                      </div>
                      <span className="mob-icon-label">{user.name.split(" ")[0].slice(0, 6)}</span>
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        {[
                          { to: "/account", label: "My Account", d: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" },
                          { to: "/orders", label: "My Orders", d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                          { to: "/wishlist", label: `Wishlist (${wishlist.length})`, d: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" },
                        ].map(item => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0">
                              <path strokeLinecap="round" strokeLinejoin="round" d={item.d} />
                            </svg>
                            {item.label}
                          </Link>
                        ))}
                        <div className="border-t border-gray-100 mt-1">
                          <button
                            onClick={() => {
                              logout();
                              setUserMenuOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link to="/auth" className="mob-icon-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                    </svg>
                    <span className="mob-icon-label">Sign in</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className={`mob-search-expand${mobileSearchOpen ? " open" : ""}`}>
            <form onSubmit={handleSearch} className="mob-search-inner">
              <input
                type="text"
                value={searchVal}
                onChange={handleSearchChange}
                placeholder="Search products…"
                autoFocus={mobileSearchOpen}
              />
              {searchVal && (
                <button type="button" onClick={handleClear} className="mob-search-clear">×</button>
              )}
              <button type="submit" className="mob-search-submit">Go</button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-100 hidden sm:block bg-white">
          <div className="w-full px-5 lg:px-8">
            <div className="flex items-center h-10">
              <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide flex-shrink-0">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    to={`/products?category=${cat}`}
                    onClick={() => dispatch({ type: "SET_FILTER", filter: { category: cat } })}
                    className="shrink-0 px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors capitalize whitespace-nowrap"
                  >
                    {cat === "all" ? "All Products" : cat}
                  </Link>
                ))}
              </div>

              {showFilterBar && (
                <>
                  <div className="cat-filter-divider" />
                  <div className="flex items-center gap-2 ml-auto shrink-0">
                    <select
                      value={sortValue}
                      onChange={e => onSortChange(e.target.value)}
                      className="flt-select"
                      style={{ maxWidth: 140 }}
                    >
                      {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>

                    <div className="relative" ref={priceDropRef}>
                      <button
                        onClick={() => { setPriceDropOpen(o => !o); setBrandDropOpen(false); }}
                        className={`flt-drop-btn ${priceDropOpen || priceIsActive ? "active" : ""}`}
                      >
                        {priceLabel}
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          style={{ transform: priceDropOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                      {priceDropOpen && (
                        <div className="flt-dropdown" style={{ minWidth: 220 }}>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3 px-1">Price range (KES)</p>
                          <div className="price-inputs">
                            <input
                              className="price-input"
                              type="number"
                              min="0"
                              placeholder="Min"
                              value={minInput}
                              onChange={e => setMinInput(e.target.value)}
                              onKeyDown={e => e.key === "Enter" && applyPriceRange()}
                            />
                            <span className="price-sep">–</span>
                            <input
                              className="price-input"
                              type="number"
                              min="0"
                              placeholder="Max"
                              value={maxInput}
                              onChange={e => setMaxInput(e.target.value)}
                              onKeyDown={e => e.key === "Enter" && applyPriceRange()}
                            />
                          </div>
                          <button className="price-apply" onClick={applyPriceRange}>Apply</button>
                          {priceIsActive && <button className="price-clear" onClick={clearPrice}>Clear price filter</button>}
                        </div>
                      )}
                    </div>

                    <div className="relative" ref={brandDropRef}>
                      <button
                        onClick={() => { setBrandDropOpen(o => !o); setPriceDropOpen(false); }}
                        className={`flt-drop-btn ${brandDropOpen || activeBrandCount > 0 ? "active" : ""}`}
                      >
                        Brand{activeBrandCount > 0 ? ` (${activeBrandCount})` : ""}
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          style={{ transform: brandDropOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                      {brandDropOpen && (
                        <div className="flt-dropdown" style={{ minWidth: 160 }}>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2 px-1">Brand</p>
                          <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto">
                            {brands.map(b => (
                              <label key={b} className="flex items-center gap-2 cursor-pointer px-1 py-0.5 rounded hover:bg-gray-50">
                                <input
                                  type="checkbox"
                                  checked={selectedBrands.includes(b)}
                                  onChange={() => onToggleBrand(b)}
                                  className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 cursor-pointer"
                                />
                                <span className="text-sm text-gray-700">{b}</span>
                              </label>
                            ))}
                          </div>
                          {activeBrandCount > 0 && (
                            <button
                              onClick={() => { brands.forEach(b => selectedBrands.includes(b) && onToggleBrand(b)); }}
                              className="text-[11px] text-blue-600 hover:underline mt-2 px-1 block"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {(priceIsActive || activeBrandCount > 0) && (
                      <button
                        onClick={onResetAll}
                        className="flt-drop-btn text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
                      >
                        Reset
                      </button>
                    )}

                    <div className="cat-filter-divider" />
                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                      {filteredCount} item{filteredCount !== 1 ? "s" : ""}
                    </span>

                    <div className="flex items-center gap-1">
                      {[
                        { mode: "grid", icon: <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" /> },
                        { mode: "list", icon: <><rect x="3" y="4" width="18" height="4" rx="1" /><rect x="3" y="10" width="18" height="4" rx="1" /><rect x="3" y="16" width="18" height="4" rx="1" /></> },
                      ].map(({ mode, icon }) => (
                        <button
                          key={mode}
                          onClick={() => onViewChange(mode)}
                          className="view-btn"
                          style={{
                            background: viewMode === mode ? "#2563eb" : "#fff",
                            color: viewMode === mode ? "#fff" : "#9ca3af",
                            border: viewMode === mode ? "none" : "1px solid #e5e7eb",
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 15, height: 15 }}>{icon}</svg>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 sm:hidden bg-white">
          <div className="flex items-center gap-1 overflow-x-auto px-3 py-1.5 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                onClick={() => dispatch({ type: "SET_FILTER", filter: { category: cat } })}
                className="shrink-0 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full border border-gray-200 transition-colors capitalize whitespace-nowrap"
              >
                {cat === "all" ? "All" : cat}
              </Link>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}