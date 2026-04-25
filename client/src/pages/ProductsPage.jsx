// FILE: src/pages/ProductsPage.jsx
import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { products, CATEGORIES, BRANDS } from "../data/products";
import ProductCard from "../components/ProductCard";

const SORT_OPTIONS = [
  { value: "default",    label: "Featured" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating",     label: "Highest Rated" },
  { value: "newest",     label: "Newest First" },
  { value: "popular",    label: "Most Popular" },
];

function Sidebar({ filters, setFilter, selectedBrands, toggleBrand, resetAll }) {
  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wide">Category</h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter("category", cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-all flex items-center justify-between ${
                filters.category === cat ? "bg-blue-600 text-white font-semibold" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{cat === "all" ? "All Products" : cat}</span>
              <span className={`text-xs ${filters.category === cat ? "text-blue-100" : "text-gray-400"}`}>
                {products.filter(p => cat === "all" || p.category === cat).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wide">Price Range</h3>
        <div className="space-y-1">
          {[
            { label: "All Prices",      min: 0,    max: Infinity },
            { label: "Under $100",      min: 0,    max: 100 },
            { label: "$100 – $500",     min: 100,  max: 500 },
            { label: "$500 – $1,000",   min: 500,  max: 1000 },
            { label: "$1,000 – $2,000", min: 1000, max: 2000 },
            { label: "Over $2,000",     min: 2000, max: Infinity },
          ].map((range) => {
            const active = filters.minPrice === range.min && filters.maxPrice === range.max;
            return (
              <button
                key={range.label}
                onClick={() => { setFilter("minPrice", range.min); setFilter("maxPrice", range.max); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  active ? "bg-blue-600 text-white font-semibold" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h3 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wide">Brand</h3>
        <div className="space-y-2">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wide">Min Rating</h3>
        <div className="space-y-1">
          {[4.5, 4, 3.5, 0].map((r) => (
            <button
              key={r}
              onClick={() => setFilter("rating", r)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                filters.rating === r ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {r === 0 ? "All Ratings" : (
                <><span>{"★".repeat(Math.floor(r))}</span><span>& above ({r}+)</span></>
              )}
            </button>
          ))}
        </div>
      </div>

      <button onClick={resetAll} className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm py-2 rounded-lg transition">
        Reset All Filters
      </button>
    </div>
  );
}

export default function ProductsPage() {
  const { searchQuery, filters, dispatch, addToCart } = useApp();
  const [viewMode, setViewMode] = useState("grid");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }

    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    result = result.filter(
      (p) => p.price >= filters.minPrice && p.price <= (filters.maxPrice || Infinity)
    );

    if (filters.rating > 0) {
      result = result.filter((p) => p.rating >= filters.rating);
    }

    switch (filters.sort) {
      case "price-asc":  result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating":     result.sort((a, b) => b.rating - a.rating); break;
      case "popular":    result.sort((a, b) => b.sold - a.sold); break;
      case "newest":     result.sort((a, b) => b.id - a.id); break;
      default: break;
    }

    return result;
  }, [searchQuery, filters, selectedBrands]);

  const setFilter = (key, value) => dispatch({ type: "SET_FILTER", filter: { [key]: value } });

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const resetAll = () => {
    dispatch({ type: "RESET_FILTERS" });
    setSelectedBrands([]);
  };

  const sidebarProps = { filters, setFilter, selectedBrands, toggleBrand, resetAll };

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 pt-4 pb-6">
      <div className="flex gap-5">

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-24">
            <Sidebar {...sidebarProps} />
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
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
              <Sidebar {...sidebarProps} />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">

          {/* Sort bar — product count + title live here */}
          <div className="flex items-center justify-between mb-4 bg-white rounded-xl border border-gray-100 p-3">
            <div className="flex items-center gap-3">
              {/* Title + count */}
              <span className="text-sm font-semibold text-gray-800 hidden sm:block">
                {searchQuery
                  ? `"${searchQuery}"`
                  : filters.category === "all" ? "All Products" : filters.category}
              </span>
              <span className="text-xs text-gray-400 hidden sm:block">
                {filtered.length} of {products.length}
              </span>
              <div className="w-px h-4 bg-gray-200 hidden sm:block" />

              {/* Mobile filter button — moved here, no more separate header */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 border border-gray-300 px-3 py-1.5 rounded-lg text-sm text-gray-600"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                Filters
              </button>

              <label className="text-sm text-gray-500">Sort by:</label>
              <select
                value={filters.sort}
                onChange={(e) => setFilter("sort", e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-100"}`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition ${viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-100"}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Products */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
              <button onClick={resetAll} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
                Clear Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 hover:shadow-md transition-shadow">
                  <img src={p.image} alt={p.title} className="w-32 h-32 object-cover rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-blue-600 font-semibold uppercase mb-1">{p.brand}</p>
                    <h3 className="font-semibold text-gray-800 mb-2">{p.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} viewBox="0 0 24 24" className={`w-3.5 h-3.5 ${i < Math.floor(p.rating) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">({p.reviewCount})</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">${p.price.toFixed(2)}</span>
                        {p.originalPrice && <span className="text-sm text-gray-400 line-through">${p.originalPrice.toFixed(2)}</span>}
                      </div>
                      <button
                        onClick={() => addToCart(p)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}