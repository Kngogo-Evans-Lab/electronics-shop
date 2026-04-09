// FILE: src/components/Cart.jsx
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Cart() {
  const { cart, cartTotal, removeFromCart, updateQty, clearCart } = useApp();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-slate-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
        <p className="text-slate-400 mb-8">Add some products to get started</p>
        <Link to="/" className="inline-block px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition shadow-md">
          Browse Products
        </Link>
      </div>
    );
  }

  const shipping = cartTotal >= 50 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const orderTotal = cartTotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-slate-400 hover:text-red-500 transition-colors">
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Cart Items ────────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
              {/* Image */}
              <Link to={`/product/${item.id}`} className="shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-xl bg-slate-50"
                />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.id}`} className="font-semibold text-slate-800 hover:text-violet-600 transition-colors line-clamp-2 text-sm leading-tight">
                  {item.title}
                </Link>
                <p className="text-xs text-slate-400 capitalize mt-0.5">{item.category}</p>
                <p className="text-violet-600 font-bold mt-1">${item.price.toFixed(2)}</p>
              </div>

              {/* Qty controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition font-medium"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold text-slate-800 text-sm">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition font-medium"
                >
                  +
                </button>
              </div>

              {/* Line total + remove */}
              <div className="text-right shrink-0 ml-2">
                <p className="font-bold text-slate-800">${(item.price * item.qty).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs text-slate-400 hover:text-red-500 transition-colors mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Free shipping progress */}
          {cartTotal < 50 && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <p className="text-sm text-amber-700 font-medium">
                Add <strong>${(50 - cartTotal).toFixed(2)}</strong> more for free shipping! 🚚
              </p>
              <div className="mt-2 h-2 bg-amber-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (cartTotal / 50) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Order Summary ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-20">
            <h2 className="font-bold text-slate-900 text-lg mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span className="font-medium text-slate-800">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-emerald-600 font-medium" : "font-medium text-slate-800"}>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (8%)</span>
                <span className="font-medium text-slate-800">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-slate-900 text-base">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo code */}
            <div className="flex gap-2 mb-5">
              <input
                type="text"
                placeholder="Promo code"
                className="flex-1 px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl transition">
                Apply
              </button>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-xl text-center transition shadow-md hover:shadow-violet-200 hover:shadow-lg"
            >
              Proceed to Checkout →
            </Link>

            <Link to="/" className="block text-center text-sm text-slate-400 hover:text-violet-600 transition mt-4">
              ← continue shoping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}