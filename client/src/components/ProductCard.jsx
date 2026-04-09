// FILE: src/components/ProductCard.jsx
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

const badgeColors = {
  "Best Seller": "bg-orange-500",
  "Top Rated": "bg-green-600",
  "New": "bg-blue-600",
  "Sale": "bg-red-500",
  "Hot Deal": "bg-red-600",
  "Popular": "bg-purple-600",
  "In Stock": "bg-green-500",
  "Pro Pick": "bg-gray-800",
  "Editor's Choice": "bg-yellow-500",
};

export default function ProductCard({ product, compact = false }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  if (compact) {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
        <Link to={`/product/${product.id}`} className="block relative">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              -{discount}%
            </span>
          )}
        </Link>
        <div className="p-3">
          <Link to={`/product/${product.id}`} className="text-xs font-medium text-gray-800 hover:text-blue-600 line-clamp-2 leading-tight">
            {product.title}
          </Link>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-sm font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 rounded-lg transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge && (
            <span className={`${badgeColors[product.badge] || "bg-gray-600"} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <svg viewBox="0 0 24 24" strokeWidth={2} className={`w-4 h-4 ${wishlisted ? "fill-red-500 stroke-red-500" : "fill-none stroke-gray-400"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Free shipping badge */}
        {product.freeShipping && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">FREE SHIPPING</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wide mb-1">{product.brand}</p>

        <Link to={`/product/${product.id}`} className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors leading-tight mb-2 line-clamp-2 flex-1">
          {product.title}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} viewBox="0 0 24 24" className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <span className="text-[10px] text-gray-400">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-bold text-gray-900">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}