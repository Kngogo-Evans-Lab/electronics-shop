// FILE: src/pages/ProductsPage.jsx
// Price filter changed from presets → custom min/max KES inputs

import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { products, CATEGORIES, BRANDS } from "../data/products";
import ProductCard, { toKsh, USD_TO_KSH } from "../components/ProductCard";
import Navbar from "../components/Navbar";

const SORT_OPTIONS = [
  { value: "default",    label: "Featured" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "newest",     label: "Newest" },
  { value: "popular",    label: "Most Popular" },
];

// ── Watermark ─────────────────────────────────────────────────────────────────
function Watermark() {
  return (
    <div aria-hidden="true" style={{
      position: "absolute", inset: 0,
      pointerEvents: "none", userSelect: "none",
      overflow: "hidden", zIndex: 0,
    }}>
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 23) % 90}%`,
          top:  `${(i * 17) % 90}%`,
          transform: `rotate(${-25 + (i * 11) % 50}deg)`,
          fontSize: 32 + (i % 3) * 8,
          fontWeight: 900, color: "#1d4ed8", opacity: 0.025,
          whiteSpace: "nowrap", lineHeight: 1,
        }}>VANTIX KENYA</div>
      ))}
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
  const { filters, dispatch } = useApp();
  const [viewMode,       setViewMode]       = useState("grid");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [localSearch,    setLocalSearch]    = useState("");
  // ── price range: stored directly as KES numbers ────────────────────────────
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(Infinity);
  // ──────────────────────────────────────────────────────────────────────────
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  // Mobile price inputs (inside the drawer)
  const [mobileMinInput, setMobileMinInput] = useState("");
  const [mobileMaxInput, setMobileMaxInput] = useState("");

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q   = params.get("search")   || "";
    const cat = params.get("category") || "";
    setLocalSearch(q);
    if (cat) dispatch({ type: "SET_FILTER", filter: { category: cat } });
  }, [location.search]);

  // Products are priced in USD internally; convert KES input for filtering
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

    // Price filter — convert KES bounds to USD for comparison against p.price
    const minUSD = priceMin / USD_TO_KSH;
    const maxUSD = priceMax === Infinity ? Infinity : priceMax / USD_TO_KSH;
    result = result.filter(p => p.price >= minUSD && p.price <= maxUSD);

    switch (filters.sort) {
      case "price-asc":  result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "popular":    result.sort((a, b) => b.sold  - a.sold);  break;
      case "newest":     result.sort((a, b) => b.id    - a.id);    break;
      default: break;
    }
    return result;
  }, [localSearch, filters, selectedBrands, priceMin, priceMax]);

  const setFilter = (k, v) => dispatch({ type: "SET_FILTER", filter: { [k]: v } });

  // Called by Navbar's price dropdown — values are already in KES
  const handlePriceRange = (min, max) => {
    setPriceMin(min);
    setPriceMax(max);
  };

  const resetAll = () => {
    dispatch({ type: "RESET_FILTERS" });
    setSelectedBrands([]);
    setLocalSearch("");
    setPriceMin(0);
    setPriceMax(Infinity);
    setMobileMinInput("");
    setMobileMaxInput("");
  };

  const applyMobilePrice = () => {
    const min = mobileMinInput === "" ? 0        : Number(mobileMinInput);
    const max = mobileMaxInput === "" ? Infinity : Number(mobileMaxInput);
    if (!isNaN(min) && !isNaN(max)) {
      setPriceMin(min);
      setPriceMax(max);
      setMobileFilterOpen(false);
    }
  };

  return (
    <>
      <Navbar
        filteredCount={filtered.length}
        sortValue={filters.sort}
        onSortChange={(val) => setFilter("sort", val)}
        sortOptions={SORT_OPTIONS}
        viewMode={viewMode}
        onViewChange={setViewMode}
        // ── new price props ──
        onPriceRange={handlePriceRange}
        activePriceMin={priceMin}
        activePriceMax={priceMax}
        // ────────────────────
        brands={BRANDS}
        selectedBrands={selectedBrands}
        onToggleBrand={(b) => setSelectedBrands(prev =>
          prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]
        )}
        onResetAll={resetAll}
        onOpenMobileFilters={() => setMobileFilterOpen(true)}
      />

      <div
        style={{ boxSizing: "border-box", width: "100%", overflowX: "hidden" }}
        className="pt-16 md:pt-36 px-3 sm:px-6 lg:px-8 pb-10"
      >
        {/* Mobile filter drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Filters</h2>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile: custom price range */}
              <div className="mb-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Price range (KES)</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={mobileMinInput}
                    onChange={e => setMobileMinInput(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-gray-400 text-sm shrink-0">–</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={mobileMaxInput}
                    onChange={e => setMobileMaxInput(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={applyMobilePrice}
                  className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition"
                >
                  Apply
                </button>
                {(priceMin > 0 || priceMax !== Infinity) && (
                  <button
                    onClick={() => { setPriceMin(0); setPriceMax(Infinity); setMobileMinInput(""); setMobileMaxInput(""); }}
                    className="mt-1.5 w-full border border-gray-200 text-gray-500 text-xs py-1.5 rounded-lg hover:border-red-300 hover:text-red-500 transition"
                  >
                    Clear price filter
                  </button>
                )}
              </div>

              {/* Mobile: Brands */}
              <div className="mb-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Brand</p>
                <div className="space-y-2">
                  {BRANDS.map(brand => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => setSelectedBrands(prev =>
                          prev.includes(brand) ? prev.filter(x => x !== brand) : [...prev, brand]
                        )}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                      <span className="text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={() => { resetAll(); setMobileFilterOpen(false); }}
                className="w-full border border-gray-300 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50 transition">
                Reset All
              </button>
            </div>
          </div>
        )}

        {/* Products grid */}
        <div className="relative">
          <Watermark />
          {filtered.length === 0 ? (
            <div className="relative z-10 bg-white rounded-xl p-12 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
              <button onClick={resetAll}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
                Clear Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="relative z-10 flex flex-col gap-3">
              {filtered.map(p => <ListCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}