// FILE: src/pages/WishlistPage.jsx
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const API = 'https://electronics-shop-api-id3m.onrender.com';

export default function WishlistPage() {
  const { wishlist, moveToCart, toggleWishlist } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-500 text-sm mt-0.5">{wishlist.length} saved items</p>
        </div>
        {wishlist.length > 0 && (
          <button onClick={() => wishlist.forEach(i => moveToCart(i.id))} className="px-1 py-1 bg-orange-900 hover:bg-blue-200 text-white text-sm font-semi-bold rounded-xl transition">
            Move All to Cart
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
          <div className="text-5xl mb-4">❤️</div>
          <h2 className="font-bold text-gray-800 text-xl mb-2">Your wishlist is empty</h2>
          <p className="text-gray-400 mb-6">Save products you love by clicking the ❤️ icon</p>
          <Link to="/products" className="inline-block px-3 py-3 bg-blue-900 hover:bg-blue-700 text-white font-bold rounded-xl transition">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {wishlist.map((p) => (
            <div key={p.id} className="relative">
              <ProductCard product={p} />
              <button
                onClick={() => moveToCart(p.id)}
                className="absolute bottom-12 left-3 right-3 bg-white/90 border border-blue-200 text-blue-600 text-xs font-bold py-1.5 rounded-lg hover:bg-blue-50 transition opacity-0 group-hover:opacity-100"
              >
                Move to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}