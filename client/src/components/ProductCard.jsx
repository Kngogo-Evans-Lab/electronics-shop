// FILE: src/components/ProductCard.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

// ── Currency helpers ──────────────────────────────────────────────────────────
export const USD_TO_KSH = 130;
export const toKsh = (usd) => `KES ${Math.round(usd * USD_TO_KSH).toLocaleString("en-KE")}`;
export const formatKES = toKsh;

// ── Vantix Logo ───────────────────────────────────────────────────────────────
export function VantixLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <path d="M20 2 L36 11 L36 29 L20 38 L4 29 L4 11 Z" fill="url(#vg)" />
      <path d="M11 13 L20 27 L29 13" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// ── Login Prompt Modal ────────────────────────────────────────────────────────
function LoginPrompt({ message, onClose }) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <VantixLogo size={22} />
          <span className="text-base font-black text-gray-900">VAN<span className="text-blue-600">TIX</span></span>
        </div>
        <div className="w-11 h-11 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-gray-900 mb-1">Sign in required</h3>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">{message}</p>
        <div className="flex gap-2 mb-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 font-semibold text-xs py-2.5 rounded-xl hover:bg-gray-50 transition">Cancel</button>
          <button onClick={() => { onClose(); navigate("/auth"); }} className="flex-1 bg-blue-600 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-blue-700 transition">Sign In</button>
        </div>
        <p className="text-[11px] text-gray-400">
          No account?{" "}
          <button onClick={() => { onClose(); navigate("/auth?mode=register"); }} className="text-blue-600 font-semibold hover:underline bg-transparent border-none cursor-pointer p-0">
            Create one for free
          </button>
        </p>
      </div>
    </div>
  );
}

// ── Main ProductCard ──────────────────────────────────────────────────────────
export default function ProductCard({ product, compact = false }) {
  const { addToCart, toggleWishlist, isWishlisted, user } = useApp();
  const navigate = useNavigate();
  const [loginPrompt, setLoginPrompt] = useState(null);

  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleWishlist = () => {
    if (!user) { setLoginPrompt("Please sign in to save items to your wishlist."); return; }
    toggleWishlist(product);
  };

  const handleBuyNow = () => {
    if (!user) { setLoginPrompt("Please sign in to proceed to checkout."); return; }
    addToCart(product);
    navigate("/checkout");
  };

  // ── Compact variant (Flash Sale) ──────────────────────────────────────────
  if (compact) {
    return (
      <>
        {loginPrompt && <LoginPrompt message={loginPrompt} onClose={() => setLoginPrompt(null)} />}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
          <Link to={`/product/${product.id}`} className="block relative">
            <img src={product.image} alt={product.title} loading="lazy" className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
            {discount > 0 && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">-{discount}%</span>
            )}
          </Link>
          <div className="p-2.5 flex flex-col flex-1">
            <p className="text-[10px] text-blue-600 font-bold uppercase mb-0.5">{product.brand}</p>
            <Link to={`/product/${product.id}`} className="text-xs font-medium text-gray-800 hover:text-blue-600 line-clamp-2 leading-snug flex-1 mb-1.5">
              {product.title}
            </Link>
            <p className="text-xs font-bold text-gray-900">{toKsh(product.price)}</p>
            {product.originalPrice && <p className="text-[10px] text-gray-400 line-through">{toKsh(product.originalPrice)}</p>}
            <div className="flex gap-1.5 mt-2">
              <button onClick={() => addToCart(product)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition">
                Add to Cart
              </button>
              <button onClick={handleBuyNow} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-bold py-1.5 rounded-lg transition">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Full card ─────────────────────────────────────────────────────────────
  return (
    <>
      {loginPrompt && <LoginPrompt message={loginPrompt} onClose={() => setLoginPrompt(null)} />}
      <div className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group flex flex-col">

        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50">
          <Link to={`/product/${product.id}`}>
            <img src={product.image} alt={product.title} loading="lazy"
                className="w-full h-24 sm:h-32 lg:h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
          </Link>

          {/* Badges */}
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 flex flex-col gap-1">
            {product.badge && (
              <span className="bg-orange-500 text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-2 py-0.5 rounded">{product.badge}</span>
            )}
            {discount > 0 && (
              <span className="bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-2 py-0.5 rounded">-{discount}%</span>
            )}
          </div>

          {/* Free shipping */}
          {product.freeShipping && (
            <span className="hidden sm:inline absolute bottom-2 left-2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">FREE SHIPPING</span>
          )}

          {/* Wishlist */}
          <button onClick={handleWishlist}
            className="absolute top-1 right-1 sm:top-2 sm:right-2 w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" strokeWidth={2} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${wishlisted ? "fill-red-500 stroke-red-500" : "fill-none stroke-gray-400"}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-1.5 sm:p-2.5 lg:p-3 flex flex-col flex-1">
          <p className="hidden sm:block text-[10px] text-blue-600 font-bold uppercase tracking-wide mb-0.5">{product.brand}</p>

          <Link to={`/product/${product.id}`}
            className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors leading-snug mb-1 sm:mb-2 line-clamp-2 flex-1">
            {product.title}
          </Link>

          {/* Rating */}
          <div className="hidden sm:flex items-center gap-1 mb-1.5 sm:mb-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} viewBox="0 0 24 24" className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="text-[9px] sm:text-[10px] text-gray-400">({product.reviewCount?.toLocaleString()})</span>
          </div>

          {/* Price */}
          <div className="mb-1.5 sm:mb-2.5">
            <p className="text-[10px] sm:text-xs lg:text-sm font-bold text-gray-900">{toKsh(product.price)}</p>
            {product.originalPrice && (
              <p className="hidden sm:block text-[9px] sm:text-xs text-gray-400 line-through">{toKsh(product.originalPrice)}</p>
            )}
          </div>

          {/* Add to Cart only */}
          <button onClick={() => addToCart(product)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[9px] sm:text-xs font-bold py-1.5 sm:py-2 rounded-md sm:rounded-lg transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}