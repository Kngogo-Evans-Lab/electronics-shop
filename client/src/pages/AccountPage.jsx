// FILE: src/pages/AccountPage.jsx
// Epic account page — Vantix indigo palette
// Inspired by: Amazon (sidebar + stats), Shopee (profile hero + avatar),
// Lazada (card-grid shortcuts), Zalando (clean typography + white space)

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  indigo:       "#3730a3",
  indigoDark:   "#1e1b4b",
  indigoNav:    "#2d2a6e",
  indigoMid:    "#4f46e5",
  indigoLight:  "#e0e7ff",
  indigoXLight: "#f5f3ff",
  amber:        "#f59e0b",
  amberLight:   "#fef3c7",
  green:        "#059669",
  greenLight:   "#d1fae5",
  red:          "#dc2626",
  redLight:     "#fee2e2",
  sky:          "#0ea5e9",
  skyLight:     "#e0f2fe",
  white:        "#ffffff",
  gray50:       "#f9fafb",
  gray100:      "#f3f4f6",
  gray200:      "#e5e7eb",
  gray300:      "#d1d5db",
  gray400:      "#9ca3af",
  gray500:      "#6b7280",
  gray600:      "#4b5563",
  gray700:      "#374151",
  gray900:      "#111827",
};

const kes = (amount) => `KES ${Math.round(amount).toLocaleString("en-KE")}`;

// ─── Status config (mirrors OrdersPage) ──────────────────────────────────────
const STATUS_CFG = {
  Processing: { bg: "#fef3c7", color: "#92400e", label: "Unpaid"        },
  Confirmed:  { bg: "#dbeafe", color: "#1e40af", label: "To be Shipped" },
  Shipped:    { bg: "#ede9fe", color: "#5b21b6", label: "Shipped"       },
  Delivered:  { bg: "#d1fae5", color: "#065f46", label: "Completed"     },
  Cancelled:  { bg: "#fee2e2", color: "#991b1b", label: "Cancelled"     },
};

// ─── Avatar gradient by first letter ─────────────────────────────────────────
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#6366f1,#8b5cf6)",
  "linear-gradient(135deg,#0ea5e9,#6366f1)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#10b981,#0ea5e9)",
  "linear-gradient(135deg,#ec4899,#8b5cf6)",
];
const avatarGrad = (name = "U") =>
  AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "profile",  icon: "👤", label: "My Profile"   },
  { id: "orders",   icon: "📦", label: "My Orders"    },
  { id: "wishlist", icon: "❤️", label: "Wishlist"     },
  { id: "address",  icon: "📍", label: "Addresses"    },
  { id: "security", icon: "🔒", label: "Security"     },
  { id: "support",  icon: "🎧", label: "Help & Support"},
];

// ─── Global CSS ───────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500&display=swap');

  .acc-page * { box-sizing: border-box; margin: 0; padding: 0; }
  .acc-page {
    font-family: 'Outfit', system-ui, sans-serif;
    background: #eef0f8;
    min-height: 100vh;
  }

  /* ── Stat card ── */
  .acc-stat {
    background: ${C.white};
    border: 1px solid ${C.gray200};
    border-radius: 14px;
    padding: 16px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: box-shadow 0.16s, transform 0.16s;
    cursor: default;
  }
  .acc-stat:hover {
    box-shadow: 0 4px 20px rgba(55,48,163,0.10);
    transform: translateY(-2px);
  }

  /* ── Sidebar nav btn ── */
  .acc-nav-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border: none;
    background: transparent;
    border-radius: 10px;
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 13.5px;
    font-weight: 500;
    color: ${C.gray600};
    cursor: pointer;
    text-align: left;
    transition: background 0.13s, color 0.13s;
  }
  .acc-nav-btn:hover { background: ${C.indigoXLight}; color: ${C.indigo}; }
  .acc-nav-btn.active {
    background: ${C.indigoLight};
    color: ${C.indigo};
    font-weight: 700;
  }

  /* ── Form input ── */
  .acc-input {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid ${C.gray200};
    border-radius: 10px;
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 13.5px;
    color: ${C.gray900};
    background: ${C.white};
    outline: none;
    transition: border-color 0.14s, box-shadow 0.14s;
  }
  .acc-input:focus {
    border-color: ${C.indigoMid};
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }
  .acc-input:disabled {
    background: ${C.gray50};
    color: ${C.gray400};
    cursor: not-allowed;
  }

  /* ── Btn primary ── */
  .acc-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 22px;
    background: ${C.indigo};
    color: ${C.white};
    border: none;
    border-radius: 10px;
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.13s, transform 0.13s;
  }
  .acc-btn-primary:hover { background: ${C.indigoMid}; transform: translateY(-1px); }

  /* ── Btn ghost ── */
  .acc-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    background: transparent;
    color: ${C.gray600};
    border: 1.5px solid ${C.gray200};
    border-radius: 10px;
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.13s;
  }
  .acc-btn-ghost:hover { border-color: ${C.indigo}; color: ${C.indigo}; background: ${C.indigoXLight}; }

  /* ── Btn danger ── */
  .acc-btn-danger {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    background: transparent;
    color: ${C.red};
    border: 1.5px solid ${C.red};
    border-radius: 10px;
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.13s;
  }
  .acc-btn-danger:hover { background: ${C.red}; color: ${C.white}; }

  /* ── Order row ── */
  .acc-order-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    border: 1px solid ${C.gray100};
    border-radius: 12px;
    background: ${C.gray50};
    transition: background 0.13s, box-shadow 0.13s;
    flex-wrap: wrap;
  }
  .acc-order-row:hover {
    background: ${C.indigoXLight};
    box-shadow: 0 2px 12px rgba(55,48,163,0.07);
  }

  /* ── Wishlist card ── */
  .acc-wish-card {
    border: 1px solid ${C.gray200};
    border-radius: 12px;
    overflow: hidden;
    background: ${C.white};
    transition: box-shadow 0.16s, transform 0.16s;
    text-decoration: none;
  }
  .acc-wish-card:hover {
    box-shadow: 0 6px 24px rgba(55,48,163,0.12);
    transform: translateY(-3px);
  }

  /* ── Security card ── */
  .acc-sec-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border: 1.5px solid ${C.gray200};
    border-radius: 12px;
    transition: border-color 0.14s, background 0.14s;
    gap: 12px;
    flex-wrap: wrap;
  }
  .acc-sec-card:hover { border-color: ${C.indigoMid}; background: ${C.indigoXLight}; }

  /* ── Section label ── */
  .acc-section-label {
    font-size: 11px;
    font-weight: 800;
    color: ${C.gray400};
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }

  /* ── Animations ── */
  @keyframes accFadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .acc-fade { animation: accFadeUp 0.28s ease both; }

  /* ── Avatar ring ── */
  @keyframes ringPulse {
    0%,100% { box-shadow: 0 0 0 3px rgba(99,102,241,0.3), 0 0 0 6px rgba(99,102,241,0.1); }
    50%      { box-shadow: 0 0 0 4px rgba(99,102,241,0.5), 0 0 0 8px rgba(99,102,241,0.15); }
  }
  .acc-avatar-ring { animation: ringPulse 2.5s ease-in-out infinite; }

  /* ── Responsive ── */
  .acc-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
  @media (min-width: 900px) { .acc-grid { grid-template-columns: 220px 1fr; } }

  .acc-stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  @media (min-width: 640px) {
    .acc-stats-grid { grid-template-columns: repeat(4, 1fr); }
  }

  .acc-wish-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  @media (min-width: 480px) { .acc-wish-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 640px) { .acc-wish-grid { grid-template-columns: repeat(4, 1fr); } }

  .acc-profile-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }
  @media (min-width: 560px) { .acc-profile-grid { grid-template-columns: 1fr 1fr; } }
`;

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, bg, color }) {
  return (
    <div className="acc-stat">
      <div style={{
        width: 44, height: 44, borderRadius: 12, background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <p style={{ fontSize: 12, color: C.gray400, fontWeight: 500, lineHeight: 1.3 }}>{label}</p>
        <p style={{ fontSize: 18, fontWeight: 800, color: color || C.gray900, lineHeight: 1.2 }}>{value}</p>
      </div>
    </div>
  );
}

// ─── Profile hero banner ──────────────────────────────────────────────────────
function ProfileHero({ user, orders, wishlist, onLogout }) {
  const totalSpent = orders.reduce((s, o) => s + (o.total || o.items.reduce((t,i) => t + (i.price * i.qty), 0)), 0);
  const completedOrders = orders.filter(o => o.status === "Delivered").length;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.indigoDark} 0%, ${C.indigoNav} 50%, #3730a3 100%)`,
      borderRadius: 16,
      padding: "24px 24px 20px",
      marginBottom: 16,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* decorative circles */}
      <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-30, left:"30%", width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.03)", pointerEvents:"none" }} />

      <div style={{ position:"relative", zIndex:2 }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>

          {/* Left: avatar + name */}
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div className="acc-avatar-ring" style={{
              width:64, height:64, borderRadius:"50%",
              background: avatarGrad(user.name),
              display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:900, fontSize:26, color:C.white, flexShrink:0,
            }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p style={{ color:"rgba(255,255,255,0.6)", fontSize:11, fontWeight:600, letterSpacing:"0.5px", marginBottom:3 }}>WELCOME BACK</p>
              <p style={{ color:C.white, fontWeight:800, fontSize:20, lineHeight:1.2 }}>{user.name}</p>
              <p style={{ color:"rgba(255,255,255,0.55)", fontSize:12, marginTop:3 }}>{user.email}</p>
              {/* Loyalty tier */}
              <span style={{
                display:"inline-flex", alignItems:"center", gap:5,
                background:"rgba(245,158,11,0.2)", border:"1px solid rgba(245,158,11,0.4)",
                color:C.amber, fontSize:10.5, fontWeight:700,
                padding:"3px 10px", borderRadius:20, marginTop:6,
              }}>
                ⭐ {completedOrders >= 10 ? "Gold Member" : completedOrders >= 5 ? "Silver Member" : "Bronze Member"}
              </span>
            </div>
          </div>

          {/* Right: quick action */}
          <button
            onClick={onLogout}
            className="acc-btn-danger"
            style={{ borderColor:"rgba(220,38,38,0.5)", color:"rgba(255,100,100,0.9)", background:"rgba(220,38,38,0.12)", fontSize:12 }}
          >
            Sign Out
          </button>
        </div>

        {/* Mini stats strip */}
        <div style={{
          display:"grid", gridTemplateColumns:"repeat(3,1fr)",
          gap:6, marginTop:16,
          background:"rgba(255,255,255,0.08)",
          borderRadius:10, padding:"10px 12px",
        }}>
          {[
            { label:"Total Orders",  value: orders.length },
            { label:"Completed",     value: completedOrders },
            { label:"Total Spent", value: `KES ${Math.round(orders.reduce((s,o)=>s+(o.total||o.items.reduce((t,i)=>t+(i.price*i.qty),0)),0)).toLocaleString("en-KE")}` },
          ].map(s => (
            <div key={s.label} style={{ textAlign:"center" }}>
              <p style={{ color:C.white, fontWeight:800, fontSize: s.label === "Total Spent" ? 11 : 17, lineHeight:1.2, wordBreak:"break-all" }}>{s.value}</p>
              <p style={{ color:"rgba(255,255,255,0.45)", fontSize:9.5, fontWeight:500, marginTop:2 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Profile ─────────────────────────────────────────────────────────────
function ProfileTab({ user, updateProfile }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name:  user?.name  || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dob:   user?.dob   || "",
    city:  user?.city  || "",
    gender:user?.gender|| "",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const fields = [
    { key:"name",   label:"Full Name",    placeholder:"Your full name",    type:"text"  },
    { key:"email",  label:"Email Address",placeholder:"your@email.com",    type:"email" },
    { key:"phone",  label:"Phone Number", placeholder:"+254 7XX XXX XXX",  type:"tel"   },
    { key:"dob",    label:"Date of Birth",placeholder:"",                  type:"date"  },
    { key:"city",   label:"City",         placeholder:"Nairobi",           type:"text"  },
    { key:"gender", label:"Gender",       placeholder:"",                  type:"select", options:["", "Male","Female","Non-binary","Prefer not to say"] },
  ];

  return (
    <div className="acc-fade">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:17, fontWeight:800, color:C.gray900 }}>Profile Information</h2>
          <p style={{ fontSize:12, color:C.gray400, marginTop:2 }}>Keep your details accurate and up-to-date</p>
        </div>
        {!editing ? (
          <button className="acc-btn-ghost" onClick={() => setEditing(true)}>
            ✏️ Edit Profile
          </button>
        ) : (
          <div style={{ display:"flex", gap:8 }}>
            <button className="acc-btn-primary" onClick={handleSave}>💾 Save Changes</button>
            <button className="acc-btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        )}
      </div>

      {saved && (
        <div style={{ background:C.greenLight, border:`1px solid #a7f3d0`, borderRadius:10, padding:"10px 14px", marginBottom:16, display:"flex", alignItems:"center", gap:8, fontSize:13, color:C.green, fontWeight:600 }}>
          ✅ Profile updated successfully!
        </div>
      )}

      {/* Glowing name line */}
      <p style={{
        fontSize: 13,
        fontWeight: 700,
        color: C.indigoMid,
        marginBottom: 18,
        textShadow: "0 0 8px rgba(99,102,241,0.45), 0 0 20px rgba(99,102,241,0.2)",
        letterSpacing: "0.3px",
      }}>
        ✦ {user.name} &nbsp;·&nbsp; Member since {new Date(user.createdAt || user.joinedAt || Date.now()).toLocaleDateString("en-KE", { month: "long", year: "numeric" })}
      </p>

      {/* Form fields */}
      <div className="acc-profile-grid">
        {fields.map(f => (
          <div key={f.key}>
            <label style={{ display:"block", fontSize:12, fontWeight:700, color:C.gray600, marginBottom:5 }}>{f.label}</label>
            {f.type === "select" ? (
              <select
                value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                disabled={!editing}
                className="acc-input"
              >
                {f.options.map(o => <option key={o} value={o}>{o || "Select..."}</option>)}
              </select>
            ) : (
              <input
                type={f.type}
                value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                disabled={!editing}
                className="acc-input"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Orders ──────────────────────────────────────────────────────────────
function OrdersTab({ orders }) {
  return (
    <div className="acc-fade">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:17, fontWeight:800, color:C.gray900 }}>Recent Orders</h2>
          <p style={{ fontSize:12, color:C.gray400, marginTop:2 }}>Showing your last {Math.min(orders.length, 6)} orders</p>
        </div>
        <Link to="/orders" className="acc-btn-primary" style={{ textDecoration:"none", fontSize:12 }}>
          View All →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign:"center", padding:"48px 24px", background:C.gray50, borderRadius:14, border:`1.5px dashed ${C.gray200}` }}>
          <div style={{ fontSize:44, marginBottom:10 }}>📦</div>
          <p style={{ fontWeight:700, color:C.gray700, marginBottom:6 }}>No orders yet</p>
          <p style={{ fontSize:12, color:C.gray400, marginBottom:16 }}>Your purchases will appear here</p>
          <Link to="/products" className="acc-btn-primary" style={{ textDecoration:"none" }}>Start Shopping →</Link>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {orders.slice(0, 6).map(o => {
            const cfg = STATUS_CFG[o.status] || { bg:C.gray100, color:C.gray600, label:o.status };
            const placedAt = o.createdAt || o.date;
            return (
              <div key={o.id} className="acc-order-row">
                {/* Thumbnail stack */}
                <div style={{ display:"flex", alignItems:"center", gap:-6, flexShrink:0 }}>
                  {o.items.slice(0,3).map((item,i) => (
                    <img key={i} src={item.image} alt="" style={{
                      width:44, height:44, borderRadius:8, objectFit:"cover",
                      border:`2px solid ${C.white}`,
                      marginLeft: i > 0 ? -10 : 0,
                      boxShadow:"0 1px 4px rgba(0,0,0,0.12)",
                    }} />
                  ))}
                </div>

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:12, fontFamily:"'JetBrains Mono', monospace", color:C.gray500, marginBottom:2 }}>
                    {o.id}
                  </p>
                  <p style={{ fontSize:12.5, color:C.gray600, marginBottom:2 }}>
                    {o.items.length} item{o.items.length !== 1 ? "s" : ""}
                    {o.items[0] && ` · ${o.items[0].title.slice(0,28)}${o.items[0].title.length > 28 ? "…" : ""}`}
                  </p>
                  <p style={{ fontSize:11, color:C.gray400 }}>
                    {placedAt ? new Date(placedAt).toLocaleDateString("en-KE", { day:"2-digit", month:"short", year:"numeric" }) : "—"}
                  </p>
                </div>

                {/* Amount */}
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <p style={{ fontSize:14, fontWeight:800, color:C.indigoDark }}>{kes(o.total)}</p>
                  <span style={{ display:"inline-block", marginTop:4, background:cfg.bg, color:cfg.color, fontSize:10.5, fontWeight:700, padding:"2px 9px", borderRadius:20 }}>
                    {cfg.label}
                  </span>
                </div>

                <Link to="/orders" style={{ textDecoration:"none", color:C.gray300, fontSize:16, flexShrink:0 }}>›</Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Wishlist ────────────────────────────────────────────────────────────
function WishlistTab({ wishlist }) {
  return (
    <div className="acc-fade">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:17, fontWeight:800, color:C.gray900 }}>My Wishlist</h2>
          <p style={{ fontSize:12, color:C.gray400, marginTop:2 }}>{wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}</p>
        </div>
        {wishlist.length > 0 && (
          <Link to="/wishlist" className="acc-btn-ghost" style={{ textDecoration:"none", fontSize:12 }}>
            View All →
          </Link>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div style={{ textAlign:"center", padding:"48px 24px", background:C.gray50, borderRadius:14, border:`1.5px dashed ${C.gray200}` }}>
          <div style={{ fontSize:44, marginBottom:10 }}>❤️</div>
          <p style={{ fontWeight:700, color:C.gray700, marginBottom:6 }}>Your wishlist is empty</p>
          <p style={{ fontSize:12, color:C.gray400, marginBottom:16 }}>Save items you love for later</p>
          <Link to="/products" className="acc-btn-primary" style={{ textDecoration:"none" }}>Explore Products →</Link>
        </div>
      ) : (
        <div className="acc-wish-grid">
          {wishlist.slice(0, 8).map(p => (
            <Link key={p.id} to={`/product/${p.id}`} className="acc-wish-card">
              <div style={{ position:"relative", paddingTop:"100%", background:C.gray50, overflow:"hidden" }}>
                <img src={p.image} alt={p.title} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
                <div style={{ position:"absolute", top:6, right:6, background:C.white, borderRadius:"50%", width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, boxShadow:"0 1px 6px rgba(0,0,0,0.12)" }}>❤️</div>
              </div>
              <div style={{ padding:"10px 12px" }}>
                <p style={{ fontSize:12, fontWeight:600, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:4 }}>{p.title}</p>
                <p style={{ fontSize:13, fontWeight:800, color:C.indigo }}>{kes(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Addresses ───────────────────────────────────────────────────────────
function AddressTab() {
  const [showForm, setShowForm] = useState(false);
  const mockAddresses = [
    { id:1, label:"Home", addr:"14 Westlands Rd, Nairobi", phone:"+254 712 345 678", default:true },
    { id:2, label:"Office", addr:"Upper Hill, Nairobi CBD", phone:"+254 722 987 654", default:false },
  ];

  return (
    <div className="acc-fade">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:17, fontWeight:800, color:C.gray900 }}>Saved Addresses</h2>
          <p style={{ fontSize:12, color:C.gray400, marginTop:2 }}>Manage your delivery locations</p>
        </div>
        <button className="acc-btn-primary" onClick={() => setShowForm(s => !s)} style={{ fontSize:12 }}>
          + Add Address
        </button>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {mockAddresses.map(a => (
          <div key={a.id} className="acc-sec-card" style={{ alignItems:"flex-start" }}>
            <div style={{ display:"flex", gap:12, flex:1 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:C.indigoXLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>📍</div>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <p style={{ fontSize:13.5, fontWeight:700, color:C.gray900 }}>{a.label}</p>
                  {a.default && (
                    <span style={{ fontSize:10, fontWeight:700, background:C.indigoLight, color:C.indigo, padding:"2px 8px", borderRadius:20 }}>Default</span>
                  )}
                </div>
                <p style={{ fontSize:12.5, color:C.gray600, marginBottom:2 }}>{a.addr}</p>
                <p style={{ fontSize:11.5, color:C.gray400 }}>{a.phone}</p>
              </div>
            </div>
            <div style={{ display:"flex", gap:6, flexShrink:0 }}>
              <button className="acc-btn-ghost" style={{ fontSize:11, padding:"5px 12px" }}>Edit</button>
              {!a.default && <button className="acc-btn-danger" style={{ fontSize:11, padding:"5px 12px" }}>Remove</button>}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ marginTop:14, padding:"18px 20px", border:`1.5px dashed ${C.indigoMid}`, borderRadius:14, background:C.indigoXLight }}>
          <p style={{ fontWeight:700, color:C.gray900, marginBottom:14 }}>New Address</p>
          <div className="acc-profile-grid">
            {["Label (e.g. Home)","Full Address","City","Phone Number"].map(ph => (
              <input key={ph} className="acc-input" placeholder={ph} />
            ))}
          </div>
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            <button className="acc-btn-primary">Save Address</button>
            <button className="acc-btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Security ────────────────────────────────────────────────────────────
function SecurityTab() {
  const [pwForm, setPwForm] = useState({ current:"", next:"", confirm:"" });

  const items = [
    { icon:"🔑", title:"Password",          desc:"Last changed: Never",        action:"Change Password", color:C.indigo },
    { icon:"📱", title:"Two-Factor Auth",    desc:"Protect your account with 2FA", action:"Enable 2FA",  color:C.green  },
    { icon:"📧", title:"Email Verification", desc:"Email verified ✓",           action:"Manage",         color:C.sky    },
    { icon:"🔔", title:"Login Alerts",       desc:"Get notified of new logins",  action:"Configure",     color:C.amber  },
  ];

  return (
    <div className="acc-fade">
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:17, fontWeight:800, color:C.gray900 }}>Security Settings</h2>
        <p style={{ fontSize:12, color:C.gray400, marginTop:2 }}>Keep your account safe and secure</p>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
        {items.map(it => (
          <div key={it.title} className="acc-sec-card">
            <div style={{ display:"flex", gap:12, alignItems:"center", flex:1 }}>
              <div style={{ width:40, height:40, borderRadius:11, background:`${it.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, flexShrink:0 }}>{it.icon}</div>
              <div>
                <p style={{ fontSize:13.5, fontWeight:700, color:C.gray900 }}>{it.title}</p>
                <p style={{ fontSize:12, color:C.gray400, marginTop:2 }}>{it.desc}</p>
              </div>
            </div>
            <button className="acc-btn-ghost" style={{ fontSize:12, color:it.color, borderColor:`${it.color}55`, padding:"6px 14px" }}>
              {it.action}
            </button>
          </div>
        ))}
      </div>

      {/* Change password form */}
      <div style={{ padding:"18px 20px", border:`1.5px solid ${C.gray200}`, borderRadius:14, background:C.gray50 }}>
        <p style={{ fontWeight:700, color:C.gray900, marginBottom:14, fontSize:14 }}>Change Password</p>
        <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:400 }}>
          {[
            ["current",  "Current Password"],
            ["next",     "New Password"],
            ["confirm",  "Confirm New Password"],
          ].map(([key, label]) => (
            <div key={key}>
              <label style={{ display:"block", fontSize:12, fontWeight:700, color:C.gray600, marginBottom:5 }}>{label}</label>
              <input
                type="password"
                value={pwForm[key]}
                onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })}
                className="acc-input"
                placeholder="••••••••"
              />
            </div>
          ))}
          <button className="acc-btn-primary" style={{ marginTop:4, alignSelf:"flex-start" }}>Update Password</button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Support ─────────────────────────────────────────────────────────────
function SupportTab() {
  const items = [
    {
      title: "WhatsApp",
      desc: "+254 722 116 713",
      action: "Chat Now",
      href: "https://wa.me/254722116713",
      color: "#25d366",
      bg: "#e8faf0",
      icon: (
        <svg viewBox="0 0 24 24" fill="#25d366" width="24" height="24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.843L0 24l6.335-1.508A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.814 9.814 0 01-5.012-1.371l-.36-.214-3.732.888.936-3.63-.234-.373A9.817 9.817 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182c5.421 0 9.818 4.398 9.818 9.818 0 5.421-4.397 9.818-9.818 9.818z"/>
        </svg>
      ),
    },
    {
      title: "Phone Call",
      desc: "+254 722 116 713",
      action: "Call Now",
      href: "tel:+254722116713",
      color: C.indigo,
      bg: C.indigoXLight,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke={C.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.2 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-.55a2 2 0 012.11.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
        </svg>
      ),
    },
    {
      title: "Email Support",
      desc: "vantixshop254@gmail.com",
      action: "Send Email",
      href: "mailto:vantixshop254@gmail.com",
      color: "#ea4335",
      bg: "#fef2f2",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-.886.742-1.636 1.636-1.636h.749L12 10.73l9.615-6.909h.749A1.636 1.636 0 0124 5.457z" fill="#ea4335"/>
        </svg>
      ),
    },
    {
      title: "Help Centre",
      desc: "Browse FAQs & guides",
      action: "Visit",
      href: "/help",
      color: C.amber,
      bg: C.amberLight,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="acc-fade">
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:17, fontWeight:800, color:C.gray900 }}>Help & Support</h2>
        <p style={{ fontSize:12, color:C.gray400, marginTop:2 }}>We're here to help — reach out any time</p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {items.map(it => (
          <div key={it.title} className="acc-sec-card">
            <div style={{ display:"flex", gap:14, alignItems:"center", flex:1 }}>
              <div style={{
                width:48, height:48, borderRadius:13,
                background: it.bg,
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0,
              }}>
                {it.icon}
              </div>
              <div>
                <p style={{ fontSize:13.5, fontWeight:700, color:C.gray900 }}>{it.title}</p>
                <p style={{ fontSize:12, color:C.gray500, marginTop:2, fontFamily:"'JetBrains Mono', monospace" }}>{it.desc}</p>
              </div>
            </div>
            <a
              href={it.href}
              target={it.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              style={{
                display:"inline-flex", alignItems:"center", gap:6,
                padding:"7px 16px", borderRadius:9,
                border:`1.5px solid ${it.color}55`,
                color: it.color,
                background: it.bg,
                fontSize:12, fontWeight:700,
                textDecoration:"none",
                transition:"all 0.13s",
                flexShrink:0,
              }}
            >
              {it.action} →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AccountPage() {
  const { user, updateProfile, logout, orders, wishlist } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  if (!user) {
    return (
      <div style={{ fontFamily:"'Outfit', system-ui, sans-serif", background:"#eef0f8", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <style>{CSS}</style>
        <div style={{ textAlign:"center", padding:32 }}>
          <div style={{ fontSize:56, marginBottom:14 }}>👤</div>
          <h2 style={{ fontSize:20, fontWeight:800, color:C.gray900, marginBottom:6 }}>Sign in to your account</h2>
          <p style={{ fontSize:13, color:C.gray500, marginBottom:24 }}>Access your orders, wishlist, and profile</p>
          <Link to="/auth" className="acc-btn-primary" style={{ textDecoration:"none", padding:"12px 32px", fontSize:14 }}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => { logout(); navigate("/"); };

  const renderTab = () => {
    switch (activeTab) {
      case "profile":  return <ProfileTab  user={user} updateProfile={updateProfile} />;
      case "orders":   return <OrdersTab   orders={orders} />;
      case "wishlist": return <WishlistTab wishlist={wishlist} />;
      case "address":  return <AddressTab />;
      case "security": return <SecurityTab />;
      case "support":  return <SupportTab />;
      default:         return null;
    }
  };

  return (
    <div className="acc-page">
      <style>{CSS}</style>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"24px 16px 56px" }}>

        {/* Profile hero */}
        <ProfileHero user={user} orders={orders} wishlist={wishlist} onLogout={handleLogout} />

        {/* Main grid: sidebar + content */}
        <div className="acc-grid">

          {/* ── Sidebar ── */}
          <div>
            <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:16, padding:"12px 10px", position:"sticky", top:20 }}>
              <p className="acc-section-label" style={{ padding:"0 6px" }}>Account Menu</p>
              <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                {NAV_ITEMS.map(item => {
                  const badge =
                    item.id === "orders"   ? orders.length   :
                    item.id === "wishlist" ? wishlist.length : 0;
                  return (
                    <button
                      key={item.id}
                      className={`acc-nav-btn ${activeTab === item.id ? "active" : ""}`}
                      onClick={() => setActiveTab(item.id)}
                    >
                      <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
                      <span style={{ flex:1 }}>{item.label}</span>
                      {badge > 0 && (
                        <span style={{
                          minWidth:20, height:20, borderRadius:10,
                          background: activeTab === item.id ? C.indigo : C.gray200,
                          color: activeTab === item.id ? C.white : C.gray600,
                          fontSize:10, fontWeight:800,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          padding:"0 5px",
                        }}>{badge}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Logout at bottom of sidebar */}
              <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${C.gray100}` }}>
                <button
                  className="acc-nav-btn"
                  onClick={handleLogout}
                  style={{ color:C.red }}
                >
                  <span style={{ fontSize:16 }}>🚪</span>
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* ── Content panel ── */}
          <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:16, padding:"22px 24px", minHeight:400 }}>
            {renderTab()}
          </div>

        </div>
      </div>
    </div>
  );
}