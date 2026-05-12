// FILE: src/components/Footer.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

const FacebookIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>);
const InstagramIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>);
const TikTokIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z" /></svg>);
const XIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>);

const SOCIAL_LINKS = [
  { label: "Facebook",  href: "https://facebook.com",  icon: <FacebookIcon /> },
  { label: "Instagram", href: "https://instagram.com", icon: <InstagramIcon /> },
  { label: "TikTok",    href: "https://tiktok.com",    icon: <TikTokIcon /> },
  { label: "X",         href: "https://x.com",         icon: <XIcon /> },
];

const NAV_SECTIONS = [
  {
    title: "Shop", emoji: "🛍️",
    links: [
      { label: "All Products", to: "/products" },
      { label: "Phones",       to: "/products?category=phones" },
      { label: "Laptops",      to: "/products?category=laptops" },
      { label: "Audio",        to: "/products?category=audio" },
      { label: "Gaming",       to: "/products?category=gaming" },
    ],
  },
  {
    title: "Support", emoji: "🎧",
    links: [
      { label: "My Account",   to: "/account" },
      { label: "My Orders",    to: "/orders" },
      { label: "Track Order",  to: "/orders" },
      { label: "Returns",      to: "/help" },
      { label: "Help Center",  to: "/help" },
    ],
  },
  {
    title: "Company", emoji: "🏢",
    links: [
      { label: "About Us",   to: "/about" },
      { label: "Contact Us", to: "/contact" },
      { label: "Privacy",    to: "/privacy" },
      { label: "Terms",      to: "/terms" },
      { label: "Sitemap",    to: "/sitemap" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer style={{ background: "#0a0f1e", color: "#94a3b8" }}>

      {/* Newsletter */}
      <div style={{ background: "#1d2a4a", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "10px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <p style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>
              📬 <span style={{ color: "#fff", fontWeight: 600 }}>Stay in the loop</span>
            </p>
            {subscribed ? (
              <span style={{ color: "#22c55e", fontSize: 12, fontWeight: 700 }}>✓ Subscribed!</span>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: "flex", gap: 8, flex: 1, maxWidth: 360 }}>
                <input
                  type="email" required placeholder="your@email.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ flex: 1, minWidth: 0, padding: "6px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", fontSize: 12, outline: "none", background: "rgba(255,255,255,0.07)", color: "#fff" }}
                />
                <button type="submit" style={{ background: "#f59e0b", color: "#0f172a", fontWeight: 800, padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, whiteSpace: "nowrap", flexShrink: 0 }}>
                  Subscribe →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main body */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px 24px" }}>

        {/* Nav links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 28 }}>
          {NAV_SECTIONS.map(section => (
            <div key={section.title}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                <span style={{ fontSize: 12 }}>{section.emoji}</span>
                <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "1px" }}>{section.title}</h3>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} style={{ fontSize: 11, color: "#64748b", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ color: "#1e3a8a", fontSize: 8 }}>▶</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ marginBottom: 18, height: 1, background: "linear-gradient(90deg, transparent, #1e3a8a 30%, #f5a623 50%, #1e3a8a 70%, transparent)" }} />

        {/* Bottom — socials + copyright stacked center */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", gap: 10 }}>
            {SOCIAL_LINKS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label}
                style={{
                  width: 38, height: 38, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "#94a3b8", textDecoration: "none",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f5a623"; e.currentTarget.style.color = "#0a0f1e"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#94a3b8"; }}
              >
                {s.icon}
              </a>
            ))}
          </div>
          <span style={{ fontSize: 11, color: "#475569", textAlign: "center" }}>
            © {new Date().getFullYear()} <strong style={{ color: "#94a3b8" }}>Vantix Kenya</strong>. All rights reserved. 🇰🇪
          </span>
        </div>

      </div>
    </footer>
  );
}