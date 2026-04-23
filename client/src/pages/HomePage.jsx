// FILE: src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { products, flashSaleProducts, CATEGORIES } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useApp } from "../context/AppContext";

const API = 'https://electronics-shop-api-id3m.onrender.com';


// Flash sale countdown timer
function Countdown() {
  const [time, setTime] = useState({ h: 5, m: 43, s: 22 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => {
        let { h, m, s } = t;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-1">
      {[pad(time.h), pad(time.m), pad(time.s)].map((val, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-white text-red-600 font-bold text-lg px-2 py-0.5 rounded min-w-[2rem] text-center">{val}</span>
          {i < 2 && <span className="text-white font-bold text-lg">:</span>}
        </span>
      ))}
    </div>
  );
}

// Category icon map
const categoryIcons = {
  phones: "📱", laptops: "💻", tablets: "📟", accessories: "🎮",
  audio: "🎧", cameras: "📷", gaming: "🕹️", all: "🛍️",
};

export default function HomePage() {
  const { dispatch } = useApp();

  return (
    <div className="bg-gray-50">
      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide">
                🔥 Up to 40% Off
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
                Your #1 Online<br />Electronics Store
              </h1>
              <p className="text-blue-100 text-base sm:text-lg mb-6 max-w-md">
                Shop the latest phones, laptops, audio & more. Best prices, genuine products, fast delivery across Kenya.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="bg-white text-blue-700 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition shadow-lg">
                  Shop Now
                </Link>
                <Link to="/products?category=phones" className="border-2 border-white text-white font-bold px-6 py-3 rounded-lg hover:bg-white/10 transition">
                  View Deals
                </Link>
              </div>
              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mt-6 text-sm text-blue-100">
                <span>✅ Genuine Products</span>
                <span>🚚 Fast Delivery</span>
                <span>🔄 Easy Returns</span>
                <span>🔒 Secure Payment</span>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80"
                alt="Electronics"
                className="w-80 h-64 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories Grid ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-3">
          {CATEGORIES.filter(c => c !== "all").map((cat) => (
            <Link
              key={cat}
              to="/products"
              onClick={() => dispatch({ type: "SET_FILTER", filter: { category: cat } })}
              className="flex flex-col items-center gap-2 bg-white rounded-xl p-3 hover:shadow-md hover:border-blue-300 border border-transparent transition-all cursor-pointer group"
            >
              <span className="text-2xl">{categoryIcons[cat]}</span>
              <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600 capitalize text-center">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Flash Sale ────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-red-600 rounded-2xl overflow-hidden">
          {/* Flash sale header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span className="text-white font-extrabold text-xl">Flash Sale</span>
              </div>
              <Countdown />
            </div>
            <Link to="/products" className="text-white text-sm font-semibold hover:underline flex items-center gap-1">
              View All <span>→</span>
            </Link>
          </div>

          {/* Flash sale products */}
          <div className="bg-gray-50 p-3 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {flashSaleProducts.map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-sm text-gray-500 mt-0.5">Handpicked top deals for you</p>
          </div>
          <Link to="/products" className="text-blue-600 font-semibold text-sm hover:underline flex items-center gap-1">
            See All <span>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {products.slice(0, 10).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── Promo Banners ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Top Phones", subtitle: "Latest models", color: "from-blue-600 to-blue-400", emoji: "📱", link: "/products?category=phones" },
            { title: "Gaming Week", subtitle: "Up to 30% off", color: "from-gray-900 to-gray-700", emoji: "🕹️", link: "/products?category=gaming" },
            { title: "Audio Deals", subtitle: "Premium sound", color: "from-indigo-600 to-indigo-400", emoji: "🎧", link: "/products?category=audio" },
          ].map((b) => (
            <Link key={b.title} to={b.link} className={`bg-gradient-to-r ${b.color} rounded-2xl p-6 text-white flex items-center justify-between hover:opacity-90 transition-opacity`}>
              <div>
                <p className="font-bold text-lg">{b.title}</p>
                <p className="text-sm opacity-80">{b.subtitle}</p>
                <span className="inline-block mt-3 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition">
                  Shop Now →
                </span>
              </div>
              <span className="text-5xl">{b.emoji}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trust Section ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: "🚚", title: "Free Shipping", desc: "On orders over $50" },
            { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
            { icon: "🔒", title: "Secure Payment", desc: "100% protected" },
            { icon: "🎧", title: "24/7 Support", desc: "Always here to help" },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}