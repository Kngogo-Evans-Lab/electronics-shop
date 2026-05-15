// FILE: src/pages/ProductsPage.jsx

import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { products, CATEGORIES, BRANDS } from "../data/products";
import ProductCard, { toKsh, USD_TO_KSH } from "../components/ProductCard";

const PAGE_CSS = `
  .products-page-wrap {
    box-sizing: border-box;
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
    background: #f1f5f9;
    /* mobile: promobar 28 + nav 58 + bottom tabs ~56 */
    padding-top: 90px;
    padding-bottom: 72px;
    padding-left: 3px;
    padding-right: 3px;
  }
  @media (min-width: 640px) {
    .products-page-wrap {
      /* desktop: promobar 28 + nav 58 */
      padding-top: 94px;
      padding-bottom: 24px;
      padding-left: 5px;
      padding-right: 5px;
    }
  }

  /* ── Dense product grid ── */
  .pp-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3px;
    width: 100%;
  }
  @media (min-width: 480px)  { .pp-grid { grid-template-columns: repeat(3, 1fr); gap: 4px; } }
  @media (min-width: 640px)  { .pp-grid { grid-template-columns: repeat(4, 1fr); gap: 5px; } }
  @media (min-width: 860px)  { .pp-grid { grid-template-columns: repeat(5, 1fr); gap: 6px; } }
  @media (min-width: 1100px) { .pp-grid { grid-template-columns: repeat(6, 1fr); gap: 6px; } }
  @media (min-width: 1350px) { .pp-grid { grid-template-columns: repeat(7, 1fr); gap: 7px; } }
  @media (min-width: 1600px) { .pp-grid { grid-template-columns: repeat(8, 1fr); gap: 8px; } }

  /* ── List view ── */
  .pp-list { display: flex; flex-direction: column; gap: 4px; }

  .pp-list-card {
    background: #fff;
    border-radius: 0;
    display: flex;
    overflow: hidden;
    transition: background 0.12s;
  }
  .pp-list-card:hover { background: #f8faff; }

  /* ── Filter drawer ── */
  .pp-filter-drawer {
    position: fixed; inset: 0; z-index: 50;
  }
  .pp-filter-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.5);
  }
  .pp-filter-panel {
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 280px; background: #fff;
    overflow-y: auto; padding: 16px;
    box-shadow: 4px 0 24px rgba(0,0,0,0.12);
  }

  /* ── Empty state ── */
  .pp-empty {
    grid-column: 1 / -1;
    display: flex; flex-direction: column; align-items: center;
    padding: 64px 24px; text-align: center;
    background: #fff;
  }

  /* ── Watermark ── */
  .pp-watermark {
    position: absolute; inset: 0;
    pointer-events: none; user-select: none;
    overflow: hidden; z-index: 0;
  }
`;

// ── Watermark ─────────────────────────────────────────────────────────────────
function Watermark() {
  return (
    <div aria-hidden="true" className="pp-watermark">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 23) % 90}%`,
          top:  `${(i * 17) % 90}%`,
          transform: `rotate(${-25 + (i * 11) % 50}deg)`,
          fontSize: 32 + (i % 3) * 8,
          fontWeight: 900, color: "#1d4ed8", opacity: 0.022,
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
    <div className="pp-list-card">
      <Link to={`/product/${product.id}`} style={{ position:"relative", flexShrink:0 }}>
        <img src={product.image} alt={product.title} loading="lazy"
          style={{ width:110, height:110, objectFit:"cover", display:"block" }} />
        {discount > 0 && (
          <span style={{ position:"absolute", top:4, left:4, background:"#ef4444", color:"#fff", fontSize:9, fontWeight:800, padding:"1px 5px", borderRadius:4 }}>
            -{discount}%
          </span>
        )}
      </Link>
      <div style={{ padding:"10px 12px", display:"flex", flexDirection:"column", flex:1, minWidth:0 }}>
        <p style={{ fontSize:10, color:"#2563eb", fontWeight:800, textTransform:"uppercase", marginBottom:2 }}>{product.brand}</p>
        <Link to={`/product/${product.id}`}
          style={{ fontSize:13, fontWeight:600, color:"#111827", textDecoration:"none", flex:1, marginBottom:8, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {product.title}
        </Link>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, flexWrap:"wrap" }}>
          <div>
            <p style={{ fontSize:13, fontWeight:800, color:"#111827", margin:0 }}>{toKsh(product.price)}</p>
            {product.originalPrice && (
              <p style={{ fontSize:11, color:"#9ca3af", textDecoration:"line-through", margin:0 }}>{toKsh(product.originalPrice)}</p>
            )}
          </div>
          <div style={{ display:"flex", gap:5 }}>
            <button onClick={() => addToCart(product)}
              style={{ background:"#2563eb", color:"#fff", fontSize:11, fontWeight:700, padding:"5px 10px", borderRadius:7, border:"none", cursor:"pointer" }}>
              Add to Cart
            </button>
            <button onClick={() => { addToCart(product); navigate("/checkout"); }}
              style={{ background:"#111827", color:"#fff", fontSize:11, fontWeight:700, padding:"5px 10px", borderRadius:7, border:"none", cursor:"pointer" }}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductsPage({
  viewMode, setViewMode,
  selectedBrands, setSelectedBrands,
  priceMin, setPriceMin,
  priceMax, setPriceMax,
  mobileFilterOpen, setMobileFilterOpen,
  resetAll,
}) {
  const { filters, dispatch } = useApp();
  const [localSearch, setLocalSearch] = useState("");
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

  const applyMobilePrice = () => {
    const min = mobileMinInput === "" ? 0        : Number(mobileMinInput);
    const max = mobileMaxInput === "" ? Infinity : Number(mobileMaxInput);
    if (!isNaN(min) && !isNaN(max)) {
      setPriceMin(min);
      setPriceMax(max);
      setMobileFilterOpen(false);
    }
  };

  const handleResetAll = () => {
    resetAll();
    setLocalSearch("");
    setMobileMinInput("");
    setMobileMaxInput("");
  };

  return (
    <>
      <style>{PAGE_CSS}</style>

      <div className="products-page-wrap">

        {/* Mobile filter drawer */}
        {mobileFilterOpen && (
          <div className="pp-filter-drawer">
            <div className="pp-filter-overlay" onClick={() => setMobileFilterOpen(false)} />
            <div className="pp-filter-panel">
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                <h2 style={{ fontWeight:800, fontSize:15, color:"#111827", margin:0 }}>Filters</h2>
                <button onClick={() => setMobileFilterOpen(false)}
                  style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width:20, height:20 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div style={{ marginBottom:20 }}>
                <p style={{ fontSize:10, fontWeight:800, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Price range (KES)</p>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <input type="number" min="0" placeholder="Min"
                    value={mobileMinInput}
                    onChange={e => setMobileMinInput(e.target.value)}
                    style={{ flex:1, border:"1.5px solid #e5e7eb", borderRadius:8, padding:"8px 10px", fontSize:13, outline:"none" }}
                  />
                  <span style={{ color:"#9ca3af", fontSize:13 }}>–</span>
                  <input type="number" min="0" placeholder="Max"
                    value={mobileMaxInput}
                    onChange={e => setMobileMaxInput(e.target.value)}
                    style={{ flex:1, border:"1.5px solid #e5e7eb", borderRadius:8, padding:"8px 10px", fontSize:13, outline:"none" }}
                  />
                </div>
                <button onClick={applyMobilePrice}
                  style={{ marginTop:8, width:"100%", background:"#2563eb", color:"#fff", fontSize:13, fontWeight:700, padding:"9px 0", borderRadius:8, border:"none", cursor:"pointer" }}>
                  Apply
                </button>
                {(priceMin > 0 || priceMax !== Infinity) && (
                  <button onClick={() => { setPriceMin(0); setPriceMax(Infinity); setMobileMinInput(""); setMobileMaxInput(""); }}
                    style={{ marginTop:6, width:"100%", border:"1.5px solid #e5e7eb", background:"none", color:"#6b7280", fontSize:12, padding:"7px 0", borderRadius:8, cursor:"pointer" }}>
                    Clear price filter
                  </button>
                )}
              </div>

              <div style={{ marginBottom:20 }}>
                <p style={{ fontSize:10, fontWeight:800, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Brand</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {BRANDS.map(brand => (
                    <label key={brand} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                      <input type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => setSelectedBrands(prev =>
                          prev.includes(brand) ? prev.filter(x => x !== brand) : [...prev, brand]
                        )}
                        style={{ width:15, height:15 }}
                      />
                      <span style={{ fontSize:13, color:"#374151" }}>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={() => { handleResetAll(); setMobileFilterOpen(false); }}
                style={{ width:"100%", border:"1.5px solid #d1d5db", background:"none", color:"#4b5563", fontSize:13, padding:"9px 0", borderRadius:8, cursor:"pointer" }}>
                Reset All
              </button>
            </div>
          </div>
        )}

        {/* Products — completely frameless, edge to edge */}
        <div style={{ position:"relative" }}>
          <Watermark />
          {filtered.length === 0 ? (
            <div className="pp-empty">
              <div style={{ fontSize:52, marginBottom:12 }}>🔍</div>
              <h3 style={{ fontWeight:800, color:"#1f2937", fontSize:17, marginBottom:6 }}>No products found</h3>
              <p style={{ color:"#6b7280", marginBottom:16, fontSize:13 }}>Try adjusting your search or filters</p>
              <button onClick={handleResetAll}
                style={{ background:"#2563eb", color:"#fff", padding:"9px 24px", borderRadius:9, fontSize:13, fontWeight:700, border:"none", cursor:"pointer" }}>
                Clear Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="pp-grid" style={{ position:"relative", zIndex:1 }}>
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="pp-list" style={{ position:"relative", zIndex:1 }}>
              {filtered.map(p => <ListCard key={p.id} product={p} />)}
            </div>
          )}
        </div>

      </div>
    </>
  );
}