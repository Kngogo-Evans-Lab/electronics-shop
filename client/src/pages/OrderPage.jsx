// FILE: src/pages/OrdersPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

// ─── Design tokens (matches HomePage palette) ────────────────────────────────
const C = {
  indigo:      "#3730a3",
  indigoDark:  "#1e1b4b",
  indigoNav:   "#2d2a6e",
  indigoMid:   "#4f46e5",
  indigoLight: "#e0e7ff",
  amber:       "#f59e0b",
  red:         "#dc2626",
  green:       "#059669",
  white:       "#ffffff",
  gray50:      "#f9fafb",
  gray100:     "#f3f4f6",
  gray200:     "#e5e7eb",
  gray300:     "#d1d5db",
  gray400:     "#9ca3af",
  gray500:     "#6b7280",
  gray600:     "#4b5563",
  gray700:     "#374151",
  gray900:     "#111827",
};

const RATE = 130;
const kes = (usd) =>
  `KES ${Math.round(usd * RATE).toLocaleString("en-KE")}`;

const formatDateTime = (timestamp) => {
  if (!timestamp) return "—";
  return new Date(timestamp).toLocaleString("en-KE", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { key: "all",        label: "All Orders" },
  { key: "Processing", label: "Unpaid" },
  { key: "Confirmed",  label: "To be Shipped" },
  { key: "Shipped",    label: "Shipped" },
  { key: "Delivered",  label: "Completed" },
  { key: "Cancelled",  label: "Cancelled" },
];

// ─── Status pill config ───────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Processing: { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b", label: "Unpaid"         },
  Confirmed:  { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6", label: "To be Shipped"  },
  Shipped:    { bg: "#ede9fe", color: "#5b21b6", dot: "#7c3aed", label: "Shipped"         },
  Delivered:  { bg: "#d1fae5", color: "#065f46", dot: "#059669", label: "Completed"       },
  Cancelled:  { bg: "#fee2e2", color: "#991b1b", dot: "#dc2626", label: "Cancelled"       },
};

// ─── Global CSS ───────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

  .op-page * { box-sizing: border-box; }
  .op-page { font-family: 'DM Sans', system-ui, sans-serif; background: #f0f0fa; min-height: 100vh; }

  .op-tab-btn {
    position: relative;
    padding: 0 18px;
    height: 44px;
    font-size: 13px;
    font-weight: 600;
    color: ${C.gray500};
    background: none;
    border: none;
    cursor: pointer;
    white-space: nowrap;
    transition: color 0.15s;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  .op-tab-btn:hover { color: ${C.indigo}; }
  .op-tab-btn.active {
    color: ${C.indigo};
    font-weight: 700;
  }
  .op-tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: 0; left: 18px; right: 18px;
    height: 2.5px;
    background: ${C.indigo};
    border-radius: 2px 2px 0 0;
  }

  .op-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: ${C.red};
    color: #fff;
    font-size: 10px;
    font-weight: 800;
    margin-left: 5px;
    vertical-align: middle;
  }

  .op-order-card {
    background: ${C.white};
    border: 1px solid ${C.gray200};
    border-radius: 14px;
    overflow: hidden;
    transition: box-shadow 0.18s, transform 0.18s;
    animation: opFadeIn 0.3s ease both;
  }
  .op-order-card:hover {
    box-shadow: 0 4px 24px rgba(55,48,163,0.10);
    transform: translateY(-1px);
  }

  @keyframes opFadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .op-order-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 10px 18px;
    background: ${C.gray50};
    border-bottom: 1px solid ${C.gray100};
    flex-wrap: wrap;
  }

  .op-copy-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border: 1.5px solid ${C.indigo};
    border-radius: 5px;
    background: none;
    color: ${C.indigo};
    font-size: 10.5px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.12s, color 0.12s;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  .op-copy-btn:hover { background: ${C.indigo}; color: #fff; }
  .op-copy-btn.copied { background: ${C.green}; border-color: ${C.green}; color: #fff; }

  .op-col-head {
    font-size: 11px;
    font-weight: 700;
    color: ${C.gray400};
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .op-item-row {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    gap: 12px;
    align-items: center;
    padding: 14px 18px;
    border-bottom: 1px solid ${C.gray100};
    transition: background 0.12s;
  }
  .op-item-row:last-child { border-bottom: none; }
  .op-item-row:hover { background: #fafafa; }

  /* Column headers row */
  .op-col-row {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    gap: 12px;
    padding: 8px 18px;
    border-bottom: 1px solid ${C.gray100};
    background: ${C.gray50};
  }

  .op-action-btn {
    padding: 5px 14px;
    border-radius: 7px;
    font-size: 11.5px;
    font-weight: 700;
    cursor: pointer;
    border: 1.5px solid;
    transition: all 0.13s;
    font-family: 'DM Sans', system-ui, sans-serif;
    white-space: nowrap;
  }

  .op-btn-track {
    border-color: ${C.indigo};
    color: ${C.indigo};
    background: #fff;
  }
  .op-btn-track:hover { background: ${C.indigo}; color: #fff; }

  .op-btn-review {
    border-color: ${C.amber};
    color: ${C.amber};
    background: #fff;
  }
  .op-btn-review:hover { background: ${C.amber}; color: #fff; }

  .op-btn-delete {
    border-color: ${C.gray300};
    color: ${C.gray500};
    background: #fff;
  }
  .op-btn-delete:hover { border-color: ${C.red}; color: ${C.red}; }

  .op-btn-again {
    border-color: ${C.green};
    color: ${C.green};
    background: #fff;
  }
  .op-btn-again:hover { background: ${C.green}; color: #fff; }

  .op-detail-link {
    font-size: 12px;
    font-weight: 700;
    color: ${C.indigo};
    text-decoration: none;
    margin-left: auto;
    flex-shrink: 0;
  }
  .op-detail-link:hover { text-decoration: underline; }

  .op-order-id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    font-weight: 500;
    color: ${C.gray600};
  }

  .op-pagination-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 20px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    border: 1.5px solid ${C.indigo};
    background: ${C.white};
    color: ${C.indigo};
    font-family: 'DM Sans', system-ui, sans-serif;
    transition: all 0.13s;
  }
  .op-pagination-btn:hover { background: ${C.indigo}; color: #fff; }
  .op-pagination-btn:disabled { border-color: ${C.gray200}; color: ${C.gray300}; cursor: not-allowed; }
  .op-pagination-btn:disabled:hover { background: ${C.white}; color: ${C.gray300}; }

  @media (max-width: 640px) {
    .op-item-row { grid-template-columns: 1fr; gap: 8px; }
    .op-col-row { display: none; }
    .op-order-header { gap: 8px; }
  }
`;

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button className={`op-copy-btn ${copied ? "copied" : ""}`} onClick={copy}>
      {copied ? (
        <>✓ Copied</>
      ) : (
        <>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

// ─── Status pill ──────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const cfg = STATUS_CONFIG[status] || { bg: C.gray100, color: C.gray600, dot: C.gray400, label: status };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: cfg.bg, color: cfg.color,
      fontSize: 11.5, fontWeight: 700,
      padding: "4px 10px", borderRadius: 20,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

// ─── Order card ───────────────────────────────────────────────────────────────
function OrderCard({ order, onDelete, onBuyAgain }) {
  const placedAt = order.createdAt || order.date;
  const [reviewedItems, setReviewedItems] = useState({});

  return (
    <div className="op-order-card">

      {/* ── Order header row ── */}
      <div className="op-order-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", flex: 1 }}>
          <span style={{ fontSize: 10.5, color: C.gray400, fontWeight: 600 }}>Order No.</span>
          <span className="op-order-id">{order.id}</span>
          <CopyBtn text={order.id} />
          <span style={{ fontSize: 10.5, color: C.gray400, marginLeft: 4 }}>
            Order Time: <span style={{ color: C.gray600, fontWeight: 600 }}>{formatDateTime(placedAt)}</span>
          </span>
        </div>
        <Link to={`/orders/${order.id}`} className="op-detail-link">
          Order Detail →
        </Link>
      </div>

      {/* ── Column labels ── */}
      <div className="op-col-row">
        <span className="op-col-head">Product Info</span>
        <span className="op-col-head" style={{ minWidth: 110, textAlign: "right" }}>Order Amount</span>
        <span className="op-col-head" style={{ minWidth: 120, textAlign: "center" }}>Order Status</span>
        <span className="op-col-head" style={{ minWidth: 110, textAlign: "center" }}>Options</span>
      </div>

      {/* ── Item rows ── */}
      {order.items.map((item, idx) => (
        <div key={item.id || idx} className="op-item-row">

          {/* Product info */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: 64, height: 64, objectFit: "cover",
                borderRadius: 10, flexShrink: 0,
                border: `1px solid ${C.gray200}`,
              }}
            />
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontSize: 13, fontWeight: 600, color: C.gray900,
                overflow: "hidden", textOverflow: "ellipsis",
                display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical", lineHeight: 1.4,
                marginBottom: 4,
              }}>{item.title}</p>
              <p style={{ fontSize: 11.5, color: C.gray400 }}>
                {item.variant && <span style={{ marginRight: 8 }}>{item.variant}</span>}
                <span style={{ fontWeight: 700, color: C.gray600, fontFamily: "'JetBrains Mono', monospace" }}>
                  KES {Math.round(item.price * RATE).toLocaleString("en-KE")}
                </span>
                <span style={{ color: C.gray300, margin: "0 6px" }}>×</span>
                <span style={{ color: C.gray600, fontWeight: 600 }}>x{item.qty}</span>
              </p>
            </div>
          </div>

          {/* Order amount */}
          <div style={{ minWidth: 110, textAlign: "right" }}>
            <p style={{ fontSize: 15, fontWeight: 800, color: C.indigoDark, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              KES {Math.round(item.price * item.qty * RATE).toLocaleString("en-KE")}
            </p>
            <p style={{ fontSize: 10.5, color: C.gray400, marginTop: 2 }}>incl. shipping</p>
          </div>

          {/* Status */}
          <div style={{ minWidth: 120, display: "flex", justifyContent: "center" }}>
            <StatusPill status={order.status} />
          </div>

          {/* Action buttons */}
          <div style={{ minWidth: 110, display: "flex", flexDirection: "column", gap: 6, alignItems: "stretch" }}>
            {(order.status === "Shipped" || order.status === "Confirmed") && (
              <button className="op-action-btn op-btn-track">
                Track Order
              </button>
            )}
            {order.status === "Delivered" && (
              <button
                className="op-action-btn op-btn-review"
                onClick={() => setReviewedItems(r => ({ ...r, [item.id]: true }))}
                disabled={reviewedItems[item.id]}
                style={reviewedItems[item.id] ? { opacity: 0.5, cursor: "not-allowed" } : {}}
              >
                {reviewedItems[item.id] ? "Reviewed ✓" : "Review"}
              </button>
            )}
            <button
              className="op-action-btn op-btn-again"
              onClick={() => onBuyAgain(item)}
            >
              Buy Again
            </button>
            {(order.status === "Delivered" || order.status === "Cancelled") && (
              <button
                className="op-action-btn op-btn-delete"
                onClick={() => onDelete(order.id)}
              >
                Delete
              </button>
            )}
          </div>

        </div>
      ))}

      {/* ── Order total footer ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "flex-end",
        gap: 12, padding: "10px 18px",
        borderTop: `1px solid ${C.gray100}`,
        background: C.gray50,
      }}>
        <span style={{ fontSize: 12, color: C.gray500 }}>
          {order.items.reduce((s, i) => s + i.qty, 0)} item{order.items.reduce((s, i) => s + i.qty, 0) !== 1 ? "s" : ""}
        </span>
        <span style={{ fontSize: 12, color: C.gray400 }}>·</span>
        <span style={{ fontSize: 12, color: C.gray600 }}>Order total:</span>
        <span style={{
          fontSize: 16, fontWeight: 800, color: C.indigo,
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}>
          {kes(order.total)}
        </span>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 5;

export default function OrdersPage() {
  const { orders, user, addToCart, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [deleted, setDeleted] = useState(new Set());

  if (!user) {
    return (
      <div className="op-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <style>{CSS}</style>
        <div style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🔒</div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.gray900, marginBottom: 6 }}>Sign in to view your orders</h2>
          <p style={{ fontSize: 13, color: C.gray500, marginBottom: 24 }}>Track your purchases and delivery status</p>
          <Link to="/auth" style={{
            display: "inline-block", padding: "10px 28px",
            background: C.indigo, color: C.white,
            borderRadius: 10, fontWeight: 700, fontSize: 14,
            textDecoration: "none",
          }}>Sign In</Link>
        </div>
      </div>
    );
  }

  const visibleOrders = orders.filter(o => !deleted.has(o.id));

  // Tab counts
  const counts = TABS.reduce((acc, tab) => {
    acc[tab.key] = tab.key === "all"
      ? visibleOrders.length
      : visibleOrders.filter(o => o.status === tab.key).length;
    return acc;
  }, {});

  // Filter by tab
  const filtered = activeTab === "all"
    ? visibleOrders
    : visibleOrders.filter(o => o.status === activeTab);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setPage(1);
  };

  const handleDelete = (orderId) => {
    setDeleted(prev => new Set([...prev, orderId]));
  };

  const handleBuyAgain = (item) => {
    addToCart(item);
  };

  return (
    <div className="op-page">
      <style>{CSS}</style>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 16px 48px" }}>

        {/* ── Page header ── */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: C.indigoDark, marginBottom: 2 }}>My Orders</h1>
          <p style={{ fontSize: 13, color: C.gray400 }}>Track your purchases and delivery status</p>
        </div>

        {/* ── Tabs ── */}
        <div style={{
          background: C.white,
          borderRadius: 14,
          border: `1px solid ${C.gray200}`,
          marginBottom: 16,
          overflow: "hidden",
        }}>
          <div style={{
            display: "flex",
            overflowX: "auto",
            borderBottom: `1px solid ${C.gray100}`,
            padding: "0 4px",
          }}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`op-tab-btn ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => handleTabChange(tab.key)}
              >
                {tab.label}
                {counts[tab.key] > 0 && tab.key !== "all" && (
                  <span className="op-badge">{counts[tab.key]}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── Column header strip ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 130px 140px 120px",
            padding: "8px 18px",
            background: C.gray50,
          }} className="hidden sm:grid">
            <span className="op-col-head">Product Info</span>
            <span className="op-col-head" style={{ textAlign: "right" }}>Order Amount</span>
            <span className="op-col-head" style={{ textAlign: "center" }}>Order Status</span>
            <span className="op-col-head" style={{ textAlign: "center" }}>Options</span>
          </div>
        </div>

        {/* ── Empty state ── */}
        {paginated.length === 0 ? (
          <div style={{
            background: C.white, borderRadius: 14, border: `1px solid ${C.gray200}`,
            padding: "56px 24px", textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: C.gray900, marginBottom: 6 }}>No orders here</h2>
            <p style={{ fontSize: 13, color: C.gray400, marginBottom: 24 }}>
              {activeTab === "all"
                ? "You haven't placed any orders yet."
                : `No ${TABS.find(t => t.key === activeTab)?.label.toLowerCase()} orders found.`}
            </p>
            <Link to="/products" style={{
              display: "inline-block", padding: "10px 28px",
              background: C.indigo, color: C.white,
              borderRadius: 10, fontWeight: 700, fontSize: 13,
              textDecoration: "none",
            }}>Start Shopping →</Link>
          </div>
        ) : (
          <>
            {/* ── Order list ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {paginated.map((order, i) => (
                <div key={order.id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <OrderCard
                    order={order}
                    onDelete={handleDelete}
                    onBuyAgain={handleBuyAgain}
                  />
                </div>
              ))}
            </div>

            {/* ── Pagination ── */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "flex-end",
              gap: 12, marginTop: 20,
            }}>
              <span style={{ fontSize: 13, color: C.gray500 }}>
                Current Page: <strong style={{ color: C.gray700 }}>{page}</strong>
                <span style={{ color: C.gray300, margin: "0 6px" }}>/</span>
                <span style={{ color: C.gray500 }}>{totalPages}</span>
              </span>
              <button
                className="op-pagination-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Previous
              </button>
              <button
                className="op-pagination-btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next →
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}