export default function Cart({ cart, onRemove, onUpdateQuantity, onClose, whatsappNumber, contactPhone }) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);
  const waNum = (whatsappNumber || "+254745909218").replace(/\D/g, "");

  const waMsg = encodeURIComponent(
    "Hello! I'd like to order:\n" +
    cart.map(i => `• ${i.name} x${i.quantity} — KES ${(i.price * i.quantity).toLocaleString()}`).join("\n") +
    `\n\n*Total: KES ${subtotal.toLocaleString()}*`
  );

  return (
    <div className="fe-cart-page">
      {/* Header */}
      <div className="fe-cart-header">
        <button className="fe-cart-back" onClick={onClose}>← Back to Products</button>
        <h2 className="fe-cart-title">Shopping Cart</h2>
        {cart.length > 0 && <span className="fe-cart-count">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>}
      </div>

      {cart.length === 0 ? (
        <div className="fe-cart-empty">
          <p>🛒 Your cart is empty</p>
          <button className="fe-reset-btn" onClick={onClose}>Browse Products</button>
        </div>
      ) : (
        <div className="fe-cart-layout">
          {/* Items */}
          <div className="fe-cart-items">
            {cart.map(item => (
              <div key={item._id} className="fe-cart-item">
                {/* Thumb */}
                <div className="fe-ci-img">
                  <img src={item.imageUrl || "/placeholder.png"} alt={item.name}
                    onError={e => { e.target.onerror = null; e.target.src = "/placeholder.png"; }} />
                </div>

                {/* Info */}
                <div>
                  <p className="fe-ci-name">{item.name}</p>
                  {item.brand && <p className="fe-ci-unit" style={{ marginBottom: 4 }}>{item.brand}</p>}
                  <p className="fe-ci-unit">KES {item.price.toLocaleString()} each</p>
                </div>

                {/* Qty */}
                <div className="fe-ci-qty">
                  <button className="fe-qty-btn" onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}>−</button>
                  <input className="fe-qty-input" type="number" min="1" value={item.quantity}
                    onChange={e => onUpdateQuantity(item._id, parseInt(e.target.value, 10) || 1)} />
                  <button className="fe-qty-btn" onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}>+</button>
                </div>

                {/* Total */}
                <div className="fe-ci-total">
                  <p className="fe-ci-subtotal">KES {(item.price * item.quantity).toLocaleString()}</p>
                  <button className="fe-ci-remove" onClick={() => onRemove(item._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <aside className="fe-cart-summary">
            <h3 className="fe-cs-title">Order Summary</h3>
            <div className="fe-cs-row"><span>Items ({itemCount})</span><span>KES {subtotal.toLocaleString()}</span></div>
            <div className="fe-cs-row"><span>Delivery</span><span style={{ color: "#2e7d32", fontWeight: 700 }}>Free (Nairobi CBD)</span></div>
            <div className="fe-cs-total"><span>Total</span><span>KES {subtotal.toLocaleString()}</span></div>

            <button className="fe-btn-checkout"
              onClick={() => alert("Checkout coming soon! Please use WhatsApp to place your order.")}>
              Proceed to Checkout
            </button>

            <a className="fe-btn-wa-order" href={`https://wa.me/${waNum}?text=${waMsg}`}
              target="_blank" rel="noreferrer">
              💬 Order via WhatsApp
            </a>

            <p className="fe-cs-note">✅ Genuine products · 📦 Fast delivery · 🔒 Safe shopping</p>
          </aside>
        </div>
      )}
    </div>
  );
}