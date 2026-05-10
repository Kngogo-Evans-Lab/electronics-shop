// FILE: src/pages/ProductsPage.jsx
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { products, CATEGORIES, BRANDS } from "../data/products";
import ProductCard, { toKsh, formatKES, USD_TO_KSH } from "../components/ProductCard";
import Navbar from "../components/Navbar";

const SORT_OPTIONS = [
  { value: "default",    label: "Featured" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest",     label: "Newest First" },
  { value: "popular",    label: "Most Popular" },
];

// ── Watermark ─────────────────────────────────────────────────────────────────
function Watermark() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0,
        pointerEvents: "none", userSelect: "none",
        overflow: "hidden", zIndex: 0,
      }}
    >
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 23) % 90}%`,
          top: `${(i * 17) % 90}%`,
          transform: `rotate(${-25 + (i * 11) % 50}deg)`,
          fontSize: 32 + (i % 3) * 8,
          fontWeight: 900,
          color: "#1d4ed8",
          opacity: 0.025,
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}>
          VANTIX KENYA
        </div>
      ))}
    </div>
  );
}

// ── Price Range Filter ────────────────────────────────────────────────────────
function PriceRangeFilter({ filters, setPriceRange }) {
  const [minVal, setMinVal] = useState("");
  const [maxVal, setMaxVal] = useState("");

  const handleMin = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    setMinVal(raw);
    const min = raw === "" ? 0 : Number(raw);
    const max = maxVal === "" ? Infinity : Number(maxVal);
    setPriceRange(min / USD_TO_KSH, max === Infinity ? Infinity : max / USD_TO_KSH);
  };

  const handleMax = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    setMaxVal(raw);
    const max = raw === "" ? Infinity : Number(raw);
    const min = minVal === "" ? 0 : Number(minVal);
    setPriceRange(min / USD_TO_KSH, max === Infinity ? Infinity : max / USD_TO_KSH);
  };

  const QUICK = [
    { label: "< 10K",     min: 0,      max: 10000 },
    { label: "10K–50K",   min: 10000,  max: 50000 },
    { label: "50K–100K",  min: 50000,  max: 100000 },
    { label: "100K–200K", min: 100000, max: 200000 },
    { label: "> 200K",    min: 200000, max: Infinity },
    { label: "All",       min: 0,      max: Infinity },
  ];

  return (
    <div>
      <h3 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wide">Price Range</h3>
      <div className="space-y-2 mb-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Min (KES)</label>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500">
            <span className="px-2 text-[11px] text-gray-400 bg-gray-50 border-r border-gray-200 py-2">KES</span>
            <input type="text" inputMode="numeric" placeholder="0" value={minVal} onChange={handleMin}
              className="flex-1 px-2 py-2 text-sm focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Max (KES)</label>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500">
            <span className="px-2 text-[11px] text-gray-400 bg-gray-50 border-r border-gray-200 py-2">KES</span>
            <input type="text" inputMode="numeric" placeholder="Any" value={maxVal} onChange={handleMax}
              className="flex-1 px-2 py-2 text-sm focus:outline-none" />
          </div>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1.5">Quick Select</p>
      <div className="grid grid-cols-2 gap-1">
        {QUICK.map((q) => {
          const aMin = Math.round(filters.minPrice * USD_TO_KSH);
          const aMax = filters.maxPrice === Infinity ? Infinity : Math.round(filters.maxPrice * USD_TO_KSH);
          const active = aMin === q.min && aMax === q.max;
          return (
            <button key={q.label}
              onClick={() => {
                setMinVal(q.min === 0 ? "" : String(q.min));
                setMaxVal(q.max === Infinity ? "" : String(q.max));
                setPriceRange(q.min / USD_TO_KSH, q.max === Infinity ? Infinity : q.max / USD_TO_KSH);
              }}
              className={`text-[11px] px-2 py-1.5 rounded-lg border font-medium transition ${
                active ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-400"
              }`}
            >
              {q.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ filters, setFilter, setPriceRange, selectedBrands, toggleBrand, resetAll }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wide">Category</h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setFilter("category", cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-all flex items-center justify-between ${
                filters.category === cat ? "bg-blue-600 text-white font-semibold" : "text-gray-600 hover:bg-gray-50"
              }`}>
              <span>{cat === "all" ? "All Products" : cat}</span>
              <span className={`text-xs ${filters.category === cat ? "text-blue-100" : "text-gray-400"}`}>
                {products.filter(p => cat === "all" || p.category === cat).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <PriceRangeFilter filters={filters} setPriceRange={setPriceRange} />

      <div>
        <h3 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wide">Brand</h3>
        <div className="space-y-2">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300" />
              <span className="text-sm text-gray-700 group-hover:text-blue-600">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={resetAll}
        className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm py-2 rounded-lg transition">
        Reset All Filters
      </button>
    </div>
  );
}

// ── List Card ─────────────────────────────────────────────────────────────────
function ListCard({ product }) {
  const { addToCart } = useApp();
  const navigate = useNavigate();
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all flex">
      <Link to={`/product/${product.id}`} className="relative shrink-0">
        <img src={product.image} alt={product.title} loading="lazy"
          className="w-28 sm:w-36 h-full object-cover" style={{ minHeight: 100 }} />
        {discount > 0 && (
          <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
            -{discount}%
          </span>
        )}
      </Link>
      <div className="p-3 flex flex-col flex-1 min-w-0">
        <p className="text-[10px] text-blue-600 font-bold uppercase mb-0.5">{product.brand}</p>
        <Link to={`/product/${product.id}`}
          className="text-sm font-medium text-gray-800 hover:text-blue-600 line-clamp-2 leading-snug flex-1 mb-2">
          {product.title}
        </Link>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <p className="text-sm font-bold text-gray-900">{toKsh(product.price)}</p>
            {product.originalPrice && (
              <p className="text-xs text-gray-400 line-through">{toKsh(product.originalPrice)}</p>
            )}
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => addToCart(product)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition">
              Add to Cart
            </button>
            <button onClick={() => { addToCart(product); navigate("/checkout"); }}
              className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const { filters, dispatch, addToCart } = useApp();
  const [viewMode, setViewMode] = useState("grid");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [localSearch, setLocalSearch] = useState("");

  const filtered = useMemo(() => {
    let result = [...products];
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    }
    if (filters.category !== "all") result = result.filter(p => p.category === filters.category);
    if (selectedBrands.length > 0)  result = result.filter(p => selectedBrands.includes(p.brand));
    result = result.filter(p => p.price >= filters.minPrice && p.price <= (filters.maxPrice || Infinity));
    switch (filters.sort) {
      case "price-asc":  result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "popular":    result.sort((a, b) => b.sold - a.sold); break;
      case "newest":     result.sort((a, b) => b.id - a.id); break;
      default: break;
    }
    return result;
  }, [localSearch, filters, selectedBrands]);

  const setFilter = (key, value) => dispatch({ type: "SET_FILTER", filter: { [key]: value } });
  const setPriceRange = (min, max) => dispatch({ type: "SET_FILTER", filter: { minPrice: min, maxPrice: max } });
  const toggleBrand = (b) => setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  const resetAll = () => { dispatch({ type: "RESET_FILTERS" }); setSelectedBrands([]); setLocalSearch(""); };

  return (
    <>
      {/* ── Fixed Navbar ── */}
      <Navbar />

      {/*
        Spacer: matches fixed Navbar height:
        - Mobile: 64px (just the nav bar; utility bar & category bar hidden)
        - sm (640px+): still 64px
        - md (768px+): 36px utility + 64px nav + 44px category = 144px
        Using pt-16 (64px) mobile, pt-36 (144px) md+
      */}
      <div
        style={{ boxSizing: "border-box", width: "100%", overflowX: "hidden" }}
        className="pt-16 md:pt-36 px-3 sm:px-6 lg:px-8 pb-8"
      >
        <div className="flex gap-5">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-40">
              <Sidebar filters={filters} setFilter={setFilter} setPriceRange={setPriceRange}
                selectedBrands={selectedBrands} toggleBrand={toggleBrand} resetAll={resetAll} />
            </div>
          </aside>

          {/* Mobile Sidebar drawer */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900">Filters</h2>
                  <button onClick={() => setMobileSidebarOpen(false)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <Sidebar filters={filters} setFilter={setFilter} setPriceRange={setPriceRange}
                  selectedBrands={selectedBrands} toggleBrand={toggleBrand} resetAll={resetAll} />
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0 w-full" style={{ minWidth: 0, overflow: "hidden" }}>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 bg-white rounded-xl border border-gray-100 p-2 sm:p-3">

              {/* Mobile filter btn */}
              <button onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden flex items-center gap-1.5 border border-gray-300 px-3 py-1.5 rounded-lg text-sm text-gray-600 shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                Filters
              </button>

              {/* Live search — takes remaining space */}
              <div className="relative flex-1 min-w-0" style={{ minWidth: 100 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
                </svg>
                <input
                  type="text"
                  value={localSearch}
                  onChange={e => setLocalSearch(e.target.value)}
                  placeholder="Search products…"
                  className="w-full pl-8 pr-7 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {localSearch && (
                  <button onClick={() => setLocalSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">✕</button>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-1 shrink-0">
                <label className="text-xs text-gray-500 hidden sm:block">Sort:</label>
                <select
                  value={filters.sort}
                  onChange={e => setFilter("sort", e.target.value)}
                  className="text-xs sm:text-sm border border-gray-200 rounded-lg px-1.5 sm:px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ maxWidth: 130 }}
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Count — hidden on smallest screens to save space */}
              <span className="text-xs text-gray-400 hidden sm:block shrink-0">
                {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              </span>

              {/* View toggle */}
              <div className="flex items-center gap-1 ml-auto shrink-0">
                {[
                  { mode: "grid", icon: <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/> },
                  { mode: "list", icon: <><rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="16" width="18" height="4" rx="1"/></> },
                ].map(({ mode, icon }) => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    className={`p-1.5 rounded-lg transition ${viewMode === mode ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-100"}`}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">{icon}</svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Products area */}
            <div className="relative">
              <Watermark />

              {filtered.length === 0 ? (
                <div className="relative z-10 bg-white rounded-xl p-12 text-center">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                  <button onClick={resetAll} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
                    Clear Filters
                  </button>
                </div>

              ) : viewMode === "grid" ? (
                /*
                  Mobile: 2 columns
                  sm (640px+): 3 columns (sidebar absent so more room)
                  lg (1024px+): 4 columns (sidebar present)
                  xl (1280px+): 5 columns
                  Note: grid-cols-4 on mobile was the original bug — caused tiny unreadable cards.
                */
                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
                  {filtered.map(p => <ProductCard key={p.id} product={p} />)}
                </div>

              ) : (
                <div className="relative z-10 flex flex-col gap-3">
                  {filtered.map(p => <ListCard key={p.id} product={p} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}