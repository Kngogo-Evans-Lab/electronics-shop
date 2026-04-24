// FILE: src/components/Navbar.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/products";

export default function Navbar() {
  const { cartCount, wishlist, user, logout, dispatch, searchQuery } = useApp();
  const [searchVal, setSearchVal] = useState(searchQuery || "");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    dispatch({ type: "SET_SEARCH", query: searchVal });
    navigate("/products");
    setSearchOpen(false);
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-blue-700 text-white text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>📦 Free shipping on orders over $50</span>
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

      {/* Main navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z"/>
                  <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z"/>
                  <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"/>
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-900 hidden sm:block">
                Tech<span className="text-blue-600">Store</span>
              </span>
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden sm:flex">
              <div className="flex w-full border-2 border-blue-600 rounded-lg overflow-hidden">
                <select
                  onChange={(e) => dispatch({ type: "SET_FILTER", filter: { category: e.target.value } })}
                  className="px-3 py-2 bg-gray-50 border-r border-gray-200 text-sm text-gray-700 focus:outline-none cursor-pointer capitalize"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c} className="capitalize">{c === "all" ? "All Categories" : c}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search for products, brands and more..."
                  className="flex-1 px-4 py-2 text-sm focus:outline-none"
                />
                <button type="submit" className="px-5 bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-1 ml-auto sm:ml-0">

              {/* Mobile search */}
              <button onClick={() => setSearchOpen(!searchOpen)} className="sm:hidden p-2 text-gray-600 hover:text-blue-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
                </svg>
              </button>

              {/* Account */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex flex-col items-center px-3 py-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {user ? (
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {user.name[0].toUpperCase()}
                    </div>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  )}
                  <span className="text-[10px] mt-0.5 hidden sm:block">{user ? user.name.split(" ")[0] : "Account"}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link to="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                          My Account
                        </Link>
                        <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                          My Orders
                        </Link>
                        <Link to="/wishlist" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                          Wishlist ({wishlist.length})
                        </Link>
                        <div className="border-t border-gray-100 mt-1">
                          <button onClick={() => { logout(); setUserMenuOpen(false); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3">
                          <p className="text-sm text-gray-600 mb-3">Sign in for the best experience</p>
                          <Link to="/auth" onClick={() => setUserMenuOpen(false)} className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg text-center transition">
                            Sign In
                          </Link>
                          <p className="text-xs text-center mt-2 text-gray-500">
                            New customer? <Link to="/auth?mode=register" onClick={() => setUserMenuOpen(false)} className="text-blue-600 font-medium hover:underline">Register</Link>
                          </p>
                        </div>
                        <div className="border-t border-gray-100 pt-1">
                          <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            Track Order
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link to="/wishlist" className="flex flex-col items-center px-2 py-1 text-gray-600 hover:text-blue-600 transition-colors relative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
                <span className="text-[10px] mt-0.5 hidden sm:block">Wishlist</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="flex flex-col items-center px-2 py-1 text-gray-600 hover:text-blue-600 transition-colors relative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
                <span className="text-[10px] mt-0.5 hidden sm:block">Cart</span>
              </Link>
            </div>
          </div>

          {/* Mobile search bar */}
          {searchOpen && (
            <div className="sm:hidden pb-3">
              <form onSubmit={handleSearch} className="flex border-2 border-blue-600 rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2 text-sm focus:outline-none"
                  autoFocus
                />
                <button type="submit" className="px-4 bg-blue-600 text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Category nav bar */}
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
      </header>
    </>
  );
}