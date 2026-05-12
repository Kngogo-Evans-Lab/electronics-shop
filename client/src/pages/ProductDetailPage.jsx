// FILE: src/pages/ProductDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { products } from "../data/products";
import { toKsh } from "../components/ProductCard";

const SELLER_WHATSAPP = "254700000000"; // ← replace with your number (no + or spaces)

/* ─── Star display ─── */
function StarRating({ rating, size = "sm" }) {
  const sz = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor"
          className={`${sz} ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-200"}`}>
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Interactive star picker ─── */
function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110">
          <svg viewBox="0 0 24 24" fill="currentColor"
            className={`w-7 h-7 transition-colors ${(hover || value) >= star ? "text-yellow-400" : "text-gray-200"}`}>
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

/* ─── Wishlist heart button (small, inline) ─── */
function WishlistBtn({ product, toggleWishlist, wishlisted }) {
  return (
    <button
      onClick={() => toggleWishlist(product)}
      title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full border transition-all shrink-0
        ${wishlisted
          ? "bg-red-50 border-red-300 text-red-500"
          : "bg-white border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400"
        }`}>
      <svg viewBox="0 0 24 24" strokeWidth={2} fill={wishlisted ? "currentColor" : "none"} stroke="currentColor"
        className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    </button>
  );
}

/* ─── Related product mini card ─── */
function RelatedCard({ p }) {
  const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
  return (
    <Link to={`/product/${p.id}`}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col group">
      <div className="relative">
        <img src={p.image} alt={p.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
        {discount > 0 && (
          <span className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
            -{discount}%
          </span>
        )}
      </div>
      <div className="p-2.5 flex flex-col flex-1">
        <p className="text-[9px] font-bold text-blue-600 uppercase mb-0.5">{p.brand}</p>
        <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug flex-1 mb-1.5">{p.title}</p>
        <p className="text-sm font-extrabold text-gray-900">{toKsh(p.price)}</p>
        {p.originalPrice && (
          <p className="text-[10px] text-gray-400 line-through">{toKsh(p.originalPrice)}</p>
        )}
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted, toast, cart, user, orders } = useApp();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [reviewError, setReviewError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const found = products.find((p) => p.id === Number(id));
      if (found) {
        setProduct(found);
        setSelectedVariant(found.variants?.[0] || "");
        setReviews([]);
      }
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, [id]);

  /* ── Skeleton ── */
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-blue-100 rounded-2xl h-80" />
          <div className="space-y-4">
            <div className="h-3 bg-blue-100 rounded w-1/4" />
            <div className="h-6 bg-blue-100 rounded w-3/4" />
            <div className="h-8 bg-blue-100 rounded w-1/3" />
            <div className="h-10 bg-blue-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
          Browse Products
        </Link>
      </div>
    );
  }

  /* ── Derived values ── */
  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 6);
  const allOtherProducts = products.filter((p) => p.id !== product.id);
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;
  const inCart = cart.find((i) => i.id === product.id);

  const hasPurchased = !!(
    user &&
    orders?.some(
      (o) =>
        o.userId === user.id &&
        o.items?.some((i) => i.id === product.id)
    )
  );
  const alreadyReviewed = user && reviews.some((r) => r.userId === user.id);

  const handleAddToCart = () => addToCart({ ...product, variant: selectedVariant, qty });
  const handleBuyNow = () => { addToCart({ ...product, variant: selectedVariant, qty }); navigate("/checkout"); };

  /* ── WhatsApp URL ── */
  const waMessage = encodeURIComponent(
    `Hi! I'm interested in *${product.title}*${selectedVariant ? ` (${selectedVariant})` : ""} at *${toKsh(product.price)}*. Can you tell me more?`
  );
  const waUrl = `https://wa.me/${SELLER_WHATSAPP}?text=${waMessage}`;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    if (!user) { setReviewError("You must be signed in to leave a review."); return; }
    if (!hasPurchased) { setReviewError("Only verified buyers can leave a review."); return; }
    if (alreadyReviewed) { setReviewError("You have already reviewed this product."); return; }
    if (!reviewForm.rating) { setReviewError("Please select a rating."); return; }
    if (!reviewForm.comment.trim() || reviewForm.comment.trim().length < 10) {
      setReviewError("Please write at least 10 characters."); return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    const newReview = {
      id: Date.now(),
      userId: user.id,
      user: user.name || user.email,
      avatar: (user.name || user.email).slice(0, 2).toUpperCase(),
      rating: reviewForm.rating,
      date: new Date().toISOString().split("T")[0],
      verified: true,
      comment: reviewForm.comment,
      helpful: 0,
    };
    setReviews((prev) => [newReview, ...prev]);
    setReviewForm({ rating: 0, comment: "" });
    setSubmitting(false);
    toast("Review submitted! ⭐");
    setActiveTab("reviews");
  };

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-blue-600 capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[180px]">{product.title}</span>
        </nav>

        {/* ══ Main card ══ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* ─ Left: Images ─ */}
            <div className="p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-gray-100 bg-white">
              <div className="relative rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-3"
                style={{ aspectRatio: "1/1" }}>
                <img src={product.images[activeImage]} alt={product.title}
                  className="w-full h-full object-cover" />
                {discount > 0 && (
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                    -{discount}% OFF
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all bg-gray-50 ${
                        activeImage === i
                          ? "border-blue-500"
                          : "border-gray-200 opacity-60 hover:opacity-100"
                      }`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ─ Right: Details ─ */}
            <div className="p-4 sm:p-6 flex flex-col gap-4">

              {/* Brand + title + wishlist */}
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">{product.brand}</p>
                <div className="flex items-start gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug flex-1">
                    {product.title}
                  </h1>
                  <WishlistBtn product={product} toggleWishlist={toggleWishlist} wishlisted={wishlisted} />
                </div>
              </div>

              {/* Rating */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating rating={Number(avgRating)} />
                  <span className="text-sm font-bold text-gray-700">{avgRating}</span>
                  <span className="text-xs text-gray-400">
                    ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline flex-wrap gap-2 pb-4 border-b border-gray-100">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">{toKsh(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-sm text-gray-400 line-through">{toKsh(product.originalPrice)}</span>
                    <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
                      Save {toKsh(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>

              {/* Variants */}
              {product.variants?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Variant: <span className="text-blue-600 normal-case font-bold">{selectedVariant}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button key={v} onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1.5 rounded-lg border-2 text-xs font-medium transition-all ${
                          selectedVariant === v
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-600 hover:border-blue-300"
                        }`}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock */}
              <div>
                {product.stock > 10 ? (
                  <p className="text-xs text-emerald-600 font-semibold">✅ In Stock ({product.stock} available)</p>
                ) : product.stock > 0 ? (
                  <p className="text-xs text-orange-500 font-semibold">⚠️ Only {product.stock} left!</p>
                ) : (
                  <p className="text-xs text-red-500 font-semibold">❌ Out of Stock</p>
                )}
              </div>

              {/* Quantity picker */}
              <div className="flex items-center gap-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quantity</p>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-700 font-bold transition text-sm">
                    −
                  </button>
                  <span className="w-10 text-center font-bold text-gray-800 text-sm border-x border-gray-200 h-8 flex items-center justify-center">
                    {qty}
                  </span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-700 font-bold transition text-sm">
                    +
                  </button>
                </div>
                <span className="text-[10px] text-gray-400">Max: {product.stock}</span>
              </div>

              {/* ─ Action buttons ─ */}
              <div className="flex items-center gap-2">
                <button onClick={handleAddToCart} disabled={product.stock === 0}
                  className="flex items-center justify-center gap-1.5 bg-white border-2 border-blue-600 text-blue-600
                    hover:bg-blue-50 disabled:opacity-50 font-bold px-4 py-2 rounded-lg transition text-xs">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  {inCart ? "Add More" : "Add to Cart"}
                </button>
                <button onClick={handleBuyNow} disabled={product.stock === 0}
                  className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                    text-white font-bold px-4 py-2 rounded-lg transition text-xs">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  Buy Now
                </button>
              </div>

              {/* ─ WhatsApp button ─ */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d]
                  text-white font-bold py-2.5 px-4 rounded-lg transition text-xs"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat with Seller on WhatsApp
              </a>

            </div>
          </div>
        </div>

        {/* ══ Tabs ══ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {["description", "specifications", "reviews", "recommended"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap capitalize transition-colors ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-400 hover:text-gray-700"
                }`}>
                {tab}
                {tab === "reviews" && reviews.length > 0 && (
                  <span className="ml-1.5 bg-blue-100 text-blue-600 text-xs px-1.5 py-0.5 rounded-full">
                    {reviews.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-5">

            {/* Description */}
            {activeTab === "description" && (
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
                {product.features?.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2 text-sm">Key Features</h3>
                    <ul className="space-y-1.5">
                      {product.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-gray-600 text-sm">
                          <span className="text-blue-500 mt-0.5 shrink-0">✓</span>{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Specifications */}
            {activeTab === "specifications" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-50">
                    {Object.entries(product.specs || {}).map(([key, val]) => (
                      <tr key={key} className="hover:bg-gray-50 transition-colors">
                        <td className="py-2.5 pr-6 font-medium text-gray-400 w-1/3 whitespace-nowrap text-xs uppercase tracking-wide">
                          {key}
                        </td>
                        <td className="py-2.5 text-gray-800 text-sm">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Reviews */}
            {activeTab === "reviews" && (
              <div>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-6 mb-5 pb-5 border-b border-gray-100">
                    <div className="text-center shrink-0">
                      <p className="text-4xl font-extrabold text-gray-900">{avgRating}</p>
                      <StarRating rating={Number(avgRating)} size="lg" />
                      <p className="text-xs text-gray-400 mt-1">{reviews.length} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter((r) => r.rating === star).length;
                        const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-4">{star}★</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                              <div className="bg-yellow-400 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-gray-400 w-4">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {reviews.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-3xl mb-2">💬</p>
                    <p className="text-gray-500 font-semibold text-sm">No reviews yet</p>
                    <p className="text-gray-400 text-xs mt-1">Be the first verified buyer to leave a review.</p>
                  </div>
                ) : (
                  <div className="space-y-3 mb-6">
                    {reviews.map((r) => (
                      <div key={r.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {r.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between flex-wrap gap-1 mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-800 text-sm">{r.user}</span>
                                {r.verified && (
                                  <span className="bg-green-100 text-green-600 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                                    ✓ Verified Buyer
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-400">{r.date}</span>
                            </div>
                            <StarRating rating={r.rating} />
                            <p className="mt-1.5 text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-gray-100 pt-5">
                  <h3 className="font-bold text-gray-900 text-sm mb-3">Leave a Review</h3>

                  {!user ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                      <p className="text-sm text-gray-600 mb-3">Sign in to leave a review.</p>
                      <button onClick={() => navigate("/auth")}
                        className="bg-blue-600 text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-blue-700 transition">
                        Sign In
                      </button>
                    </div>
                  ) : !hasPurchased ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                      <span className="text-amber-500 text-lg shrink-0">🔒</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Verified buyers only</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Only customers who have purchased this product can leave a review.
                        </p>
                      </div>
                    </div>
                  ) : alreadyReviewed ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 font-medium">
                      ✅ You've already reviewed this product. Thank you!
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-3 max-w-lg">
                      {reviewError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-xl">
                          {reviewError}
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Rating *</label>
                        <StarPicker value={reviewForm.rating} onChange={(r) => setReviewForm((f) => ({ ...f, rating: r }))} />
                        {reviewForm.rating > 0 && (
                          <p className="text-xs text-gray-400 mt-1">
                            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][reviewForm.rating]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Review *</label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                          placeholder="Share your experience with this product (min. 10 characters)..."
                          rows={3}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                        <p className="text-[10px] text-gray-400 mt-0.5">{reviewForm.comment.length} characters</p>
                      </div>
                      <button type="submit" disabled={submitting}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700
                          disabled:opacity-60 text-white font-bold py-2.5 px-6 rounded-xl transition text-sm">
                        {submitting ? (
                          <>
                            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Submitting…
                          </>
                        ) : "Submit Review"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Recommended tab */}
            {activeTab === "recommended" && (
              <div>
                {allOtherProducts.length === 0 ? (
                  <p className="text-center text-gray-400 py-6 text-sm">No other products found.</p>
                ) : (
                  <>
                    <p className="text-xs text-gray-400 mb-4">{allOtherProducts.length} products in our store</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {allOtherProducts.map((p) => <RelatedCard key={p.id} p={p} />)}
                    </div>
                    <div className="mt-4 text-center">
                      <Link to="/products"
                        className="inline-block text-sm text-blue-600 font-semibold border border-blue-200 rounded-lg px-5 py-2 hover:bg-blue-50 transition">
                        Browse all products →
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}

          </div>
        </div>

        {/* ══ You May Also Like ══ */}
        {related.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-600 rounded-full" />
                <h2 className="text-base font-bold text-gray-900">You May Also Like</h2>
              </div>
              <Link to={`/products?category=${product.category}`}
                className="text-xs text-blue-600 font-semibold hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {related.map((p) => <RelatedCard key={p.id} p={p} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}