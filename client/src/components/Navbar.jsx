// FILE: src/components/Navbar.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/products";

// ── VANTIX Logo (hexagon style from HomePage) ─────────────────────────────────
export function VantixKenyaLogo({ size = 36 }) {
  return (
    <div style={{
      width: size, height: size,
      background: "linear-gradient(140deg,#1a3a8f,#08112a)",
      borderRadius: size * 0.25,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 20 20" fill="none">
        <path d="M10 2L18 7V13L10 18L2 13V7L10 2Z"
          stroke="#f5a623" strokeWidth="1.6" fill="rgba(245,166,35,0.12)" />
        <circle cx="10" cy="10" r="3" fill="#f5a623" />
      </svg>
    </div>
  );
}

export default function Navbar() {
  const { cartCount, wishlist, user, logout, dispatch, searchQuery } = useApp();
  const [searchVal, setSearchVal] = useState(searchQuery || "");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
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

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    dispatch({ type: "SET_SEARCH", query: val });
    if (val.trim()) navigate("/products");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch({ type: "SET_SEARCH", query: searchVal });
    if (searchVal.trim()) navigate("/products");
    setMobileSearchOpen(false);
  };

  const handleClear = () => {
    setSearchVal("");
    dispatch({ type: "SET_SEARCH", query: "" });
  };

  return (
    <>
      <style>{`
        @keyframes neonPulse {
          0%, 100% { box-shadow: 0 0 4px #00f5ff, 0 0 10px #00f5ff, 0 0 20px #00f5ff, 0 0 40px #00bfff; }
          50% { box-shadow: 0 0 6px #00f5ff, 0 0 16px #00f5ff, 0 0 32px #00f5ff, 0 0 60px #00bfff; }
        }
        .neon-avatar { animation: neonPulse 2s ease-in-out infinite; border: 2px solid #00f5ff; }
        .nav-icon-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6px 12px;
          border-radius: 10px;
          color: #374151;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          position: relative;
          min-width: 56px;
          background: none;
          border: none;
          cursor: pointer;
        }
        .nav-icon-btn:hover { background: #eff6ff; color: #2563eb; }
        .nav-icon-btn svg { width: 22px; height: 22px; }
        .nav-icon-label {
          font-size: 10px;
          font-weight: 700;
          margin-top: 2px;
          color: #6b7280;
          white-space: nowrap;
        }
        .nav-badge {
          position: absolute;
          top: 3px;
          right: 8px;
          min-width: 17px;
          height: 17px;
          padding: 0 4px;
          border-radius: 9px;
          background: #ef4444;
          font-size: 10px;
          font-weight: 800;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .mobile-search-bar {
          position: fixed;
          top: 64px;
          left: 0; right: 0;
          background: #fff;
          border-bottom: 2px solid #2563eb;
          padding: 10px 16px;
          z-index: 49;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
      `}</style>

      {/* ── Top utility bar (desktop only) ── */}
      <div className="bg-blue-700 text-white text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>📦 Free shipping on orders over KES 5,000</span>
            <span>|</span>
            <span>🚚 Fast delivery across Kenya</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/orders" className="hover:underline">Track Order</Link>
            <span>|</span>
            <Link to="/help" className="hover:underline">Help Center</Link>
          </div>
        </div>
      </div>

      {/* ── Main navbar ── */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-2 sm:gap-6">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <VantixKenyaLogo size={36} />
              <div className="flex flex-col leading-none">
                <span className="font-black text-base sm:text-lg text-gray-900 tracking-tight">
                  VANTIX<span style={{ color: "#f5a623" }}>.</span>
                </span>
                <span className="text-[9px] font-bold tracking-widest uppercase -mt-0.5" style={{ color: "#6b7a99" }}>
                  SHOP254
                </span>
              </div>
            </Link>

            {/* Desktop search bar */}
            <form onSubmit={handleSearch} className="flex-1 hidden sm:flex items-center">
              <div className="flex w-full items-center border-2 border-blue-600 rounded-full overflow-hidden bg-white shadow-sm">
                <select
                  onChange={(e) => dispatch({ type: "SET_FILTER", filter: { category: e.target.value } })}
                  className="pl-4 pr-2 py-2.5 bg-transparent text-sm text-gray-600 focus:outline-none cursor-pointer capitalize border-r border-gray-200 shrink-0"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c} className="capitalize">
                      {c === "all" ? "All Categories" : c}
                    </option>
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
                <button type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-sm font-semibold transition-colors shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
                  </svg>
                  Search
                </button>
              </div>
            </form>

            {/* Mobile search toggle — MOBILE ONLY */}
            <button
              onClick={() => setMobileSearchOpen(o => !o)}
              className="sm:hidden flex flex-col items-center nav-icon-btn"
              style={{ minWidth: 40, padding: "6px 8px" }}
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 22, height: 22 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
              </svg>
              <span className="nav-icon-label">Search</span>
            </button>

            {/* ── Right action icons ── */}
            <div className="flex items-center gap-1 ml-auto sm:ml-0 shrink-0">

              {/* Wishlist */}
              <Link to="/wishlist" className="nav-icon-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {wishlist.length > 0 && (
                  <span className="nav-badge">{wishlist.length > 9 ? "9+" : wishlist.length}</span>
                )}
                <span className="nav-icon-label">Wishlist</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="nav-icon-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="nav-badge">{cartCount > 9 ? "9+" : cartCount}</span>
                )}
                <span className="nav-icon-label">Cart</span>
              </Link>

              {/* Account / Profile */}
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <>
                    <button onClick={() => setUserMenuOpen(o => !o)} className="nav-icon-btn">
                      <div
                        className="neon-avatar rounded-full flex items-center justify-center text-white font-black"
                        style={{
                          width: 28, height: 28, fontSize: 13,
                          background: "linear-gradient(135deg,#0ea5e9,#06b6d4,#0891b2)"
                        }}
                      >
                        {user.name[0].toUpperCase()}
                      </div>
                      <span className="nav-icon-label" style={{ marginTop: 3 }}>
                        {user.name.split(" ")[0].slice(0, 8)}
                      </span>
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link to="/account" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                          </svg>
                          My Account
                        </Link>
                        <Link to="/orders" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          My Orders
                        </Link>
                        <Link to="/wishlist" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                          </svg>
                          Wishlist ({wishlist.length})
                        </Link>
                        <div className="border-t border-gray-100 mt-1">
                          <button onClick={() => { logout(); setUserMenuOpen(false); }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
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
                  <>
                    {/* Mobile: icon + label */}
                    <Link to="/auth" className="nav-icon-btn sm:hidden">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                      </svg>
                      <span className="nav-icon-label">Account</span>
                    </Link>
                    {/* Desktop: text buttons */}
                    <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200 ml-2">
                      <Link to="/auth"
                        className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap px-2 py-1">
                        Sign in
                      </Link>
                      <Link to="/auth?mode=register"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors whitespace-nowrap">
                        Create account
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile search dropdown */}
        {mobileSearchOpen && (
          <div className="sm:hidden mobile-search-bar">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="flex flex-1 items-center border-2 border-blue-600 rounded-full overflow-hidden bg-white">
                <input
                  type="text"
                  value={searchVal}
                  onChange={handleSearchChange}
                  placeholder="Search products..."
                  autoFocus
                  className="flex-1 px-4 py-2 text-sm focus:outline-none bg-transparent"
                />
                {searchVal && (
                  <button type="button" onClick={handleClear}
                    className="pr-3 text-gray-400 hover:text-gray-600 text-lg">×</button>
                )}
              </div>
              <button type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold shrink-0 transition-colors">
                Go
              </button>
            </form>
          </div>
        )}

        {/* Category nav bar — desktop */}
        <div className="border-t border-gray-100 hidden sm:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${cat}`}
                  onClick={() => dispatch({ type: "SET_FILTER", filter: { category: cat } })}
                  className="shrink-0 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors capitalize whitespace-nowrap"
                >
                  {cat === "all" ? "All Products" : cat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Category nav — mobile horizontal scroll */}
        <div className="border-t border-gray-100 sm:hidden">
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