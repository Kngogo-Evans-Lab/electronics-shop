// FILE: src/pages/CheckoutPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://electronics-shop-api-id3m.onrender.com';

const STEPS = ["Shipping", "Payment", "Confirm"];

// ✅ Moved outside CheckoutPage to prevent remount on every render
const InputField = ({ label, value, onChange, error, placeholder, type = "text", required, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${error ? "border-red-400 bg-red-50" : "border-gray-200"}`}
      />
      {children}
    </div>
    {error && <p className="text-xs text-red-500 mt-1">⚠ {error}</p>}
  </div>
);

export default function CheckoutPage() {
  const { cart, cartTotal, user, placeOrder, toast } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [payMethod, setPayMethod] = useState("card");
  const [errors, setErrors] = useState({});

  const shippingFee = cartTotal >= 50 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const orderTotal = cartTotal + shippingFee + tax;

  const [shipping, setShipping] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    country: "Kenya",
    zip: "",
    saveAddress: false,
  });

  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [mpesa, setMpesa] = useState({ phone: user?.phone || "" });

  const updateShipping = (field) => (e) => {
    setShipping(s => ({ ...s, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: "" }));
  };

  const validateShipping = () => {
    const e = {};
    if (!shipping.firstName.trim()) e.firstName = "Required";
    if (!shipping.lastName.trim()) e.lastName = "Required";
    if (!shipping.email || !/\S+@\S+\.\S+/.test(shipping.email)) e.email = "Valid email required";
    if (!shipping.phone) e.phone = "Required";
    if (!shipping.address.trim()) e.address = "Required";
    if (!shipping.city.trim()) e.city = "Required";
    return e;
  };

  const validatePayment = () => {
    const e = {};
    if (payMethod === "card") {
      if (!card.number || card.number.replace(/\s/g, "").length < 16) e.cardNumber = "Valid card number required";
      if (!card.name.trim()) e.cardName = "Required";
      if (!card.expiry || !/^\d{2}\/\d{2}$/.test(card.expiry)) e.cardExpiry = "MM/YY format";
      if (!card.cvv || card.cvv.length < 3) e.cardCvv = "3-4 digits";
    } else {
      if (!mpesa.phone) e.mpesaPhone = "M-Pesa number required";
    }
    return e;
  };

  const handleNext = () => {
    if (step === 0) {
      const errs = validateShipping();
      if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    }
    if (step === 1) {
      const errs = validatePayment();
      if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    }
    setErrors({});
    setStep(s => s + 1);
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2500));
    placeOrder(orderTotal, shipping, { method: payMethod, ...card });
    toast("🎉 Order placed successfully!");
    navigate("/order-success");
    setProcessing(false);
  };

  const formatCard = (val) => val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (val) => { const c = val.replace(/\D/g, "").slice(0, 4); return c.length > 2 ? `${c.slice(0, 2)}/${c.slice(2)}` : c; };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
        <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link to="/cart" className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-600 mb-6 transition">
        ← Back to Cart
      </Link>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 ${i <= step ? "text-blue-600" : "text-gray-300"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                i < step ? "bg-blue-600 border-blue-600 text-white" :
                i === step ? "border-blue-600 text-blue-600" :
                "border-gray-200 text-gray-400"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-sm font-semibold hidden sm:block ${i === step ? "text-blue-600" : i < step ? "text-blue-400" : "text-gray-400"}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`w-12 sm:w-20 h-0.5 ${i < step ? "bg-blue-400" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">

          {/* Step 0: Shipping */}
          {step === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="First Name" value={shipping.firstName} onChange={updateShipping("firstName")} error={errors.firstName} placeholder="John" required />
                <InputField label="Last Name" value={shipping.lastName} onChange={updateShipping("lastName")} error={errors.lastName} placeholder="Doe" required />
                <div className="sm:col-span-2">
                  <InputField label="Email Address" type="email" value={shipping.email} onChange={updateShipping("email")} error={errors.email} placeholder="you@example.com" required />
                </div>
                <div className="sm:col-span-2">
                  <InputField label="Phone Number" type="tel" value={shipping.phone} onChange={updateShipping("phone")} error={errors.phone} placeholder="+254 700 000 000" required />
                </div>
                <div className="sm:col-span-2">
                  <InputField label="Street Address" value={shipping.address} onChange={updateShipping("address")} error={errors.address} placeholder="123 Kenyatta Avenue" required />
                </div>
                <InputField label="City" value={shipping.city} onChange={updateShipping("city")} error={errors.city} placeholder="Nairobi" required />
                <InputField label="State / Province" value={shipping.state} onChange={updateShipping("state")} placeholder="Nairobi County" />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Country <span className="text-red-500">*</span></label>
                  <select value={shipping.country} onChange={updateShipping("country")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {["Kenya", "Uganda", "Tanzania", "Ethiopia", "South Africa", "Nigeria", "United States", "United Kingdom", "Other"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <InputField label="ZIP / Postal Code" value={shipping.zip} onChange={updateShipping("zip")} placeholder="00100" />
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={shipping.saveAddress} onChange={updateShipping("saveAddress")} className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm text-gray-600">Save this address for future orders</span>
                  </label>
                </div>
              </div>
              <button onClick={handleNext} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition">
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Payment Method
              </h2>

              {/* Payment tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { id: "card", label: "Card", icon: "💳" },
                  { id: "mpesa", label: "M-Pesa", icon: "📱" },
                  { id: "paypal", label: "PayPal", icon: "🔵" },
                  { id: "cod", label: "Cash on Delivery", icon: "💵" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setPayMethod(m.id); setErrors({}); }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                      payMethod === m.id ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xl">{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Card form */}
              {payMethod === "card" && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl p-5 text-white mb-5">
                    <p className="text-xs text-white/60 mb-3">Card Number</p>
                    <p className="text-xl font-mono tracking-widest mb-4">{card.number || "•••• •••• •••• ••••"}</p>
                    <div className="flex justify-between">
                      <div><p className="text-xs text-white/60">Card Holder</p><p className="font-medium text-sm">{card.name || "YOUR NAME"}</p></div>
                      <div><p className="text-xs text-white/60">Expires</p><p className="font-medium text-sm">{card.expiry || "MM/YY"}</p></div>
                    </div>
                  </div>

                  <InputField
                    label="Card Number"
                    value={card.number}
                    onChange={(e) => setCard(c => ({ ...c, number: formatCard(e.target.value) }))}
                    error={errors.cardNumber}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                  <InputField label="Name on Card" value={card.name} onChange={(e) => setCard(c => ({ ...c, name: e.target.value }))} error={errors.cardName} placeholder="John Doe" required />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="Expiry Date"
                      value={card.expiry}
                      onChange={(e) => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                      error={errors.cardExpiry}
                      placeholder="MM/YY"
                      required
                    />
                    <InputField
                      label="CVV"
                      type="password"
                      value={card.cvv}
                      onChange={(e) => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                      error={errors.cardCvv}
                      placeholder="•••"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-400">🔒 Your payment info is encrypted with 256-bit SSL. Powered by Stripe.</p>
                </div>
              )}

              {/* M-Pesa form */}
              {payMethod === "mpesa" && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
                    <span className="text-2xl shrink-0">📱</span>
                    <div>
                      <p className="font-semibold text-green-800">M-Pesa STK Push</p>
                      <p className="text-sm text-green-600 mt-0.5">Enter your Safaricom number. You'll receive a payment prompt instantly.</p>
                    </div>
                  </div>
                  <InputField
                    label="M-Pesa Phone Number"
                    type="tel"
                    value={mpesa.phone}
                    onChange={(e) => setMpesa({ phone: e.target.value })}
                    error={errors.mpesaPhone}
                    placeholder="0712 345 678"
                    required
                  />
                  <p className="text-sm text-gray-600">Amount to pay: <strong>KES {(orderTotal * 130).toFixed(0)}</strong></p>
                </div>
              )}

              {/* PayPal */}
              {payMethod === "paypal" && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-3">🔵</div>
                  <p className="font-semibold text-gray-800 mb-1">Pay with PayPal</p>
                  <p className="text-sm text-gray-500">You'll be redirected to PayPal to complete your payment securely.</p>
                </div>
              )}

              {/* Cash on Delivery */}
              {payMethod === "cod" && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-3">💵</div>
                  <p className="font-semibold text-gray-800 mb-1">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">Pay in cash when your order is delivered. Available for select locations.</p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="px-6 py-3.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl transition">
                  ← Back
                </button>
                <button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition">
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Review & Confirm
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-5">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-50">
                    <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-xl bg-gray-50 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.title}</p>
                      {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
                      <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                    </div>
                    <p className="font-bold text-gray-800 shrink-0">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Shipping address */}
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-1"><span>📦</span> Shipping Address</p>
                  <p className="text-sm text-gray-600">{shipping.firstName} {shipping.lastName}</p>
                  <p className="text-sm text-gray-600">{shipping.address}</p>
                  <p className="text-sm text-gray-600">{shipping.city}, {shipping.country}</p>
                  <p className="text-sm text-gray-600">{shipping.phone}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-1"><span>💳</span> Payment</p>
                  <p className="text-sm text-gray-600 capitalize">{payMethod === "card" ? `Card ending in ${card.number.slice(-4) || "••••"}` : payMethod === "mpesa" ? `M-Pesa: ${mpesa.phone}` : payMethod}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl transition">
                  ← Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition"
                >
                  {processing && <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                  {processing ? "Processing Payment..." : `Place Order — $${orderTotal.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4 max-h-48 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-600">
                  <span className="truncate flex-1 pr-2">{item.title} ×{item.qty}</span>
                  <span className="shrink-0 font-medium">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-medium">${cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={shippingFee === 0 ? "text-green-600 font-medium" : "font-medium"}>{shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax (8%)</span><span className="font-medium">${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100"><span>Total</span><span>${orderTotal.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}