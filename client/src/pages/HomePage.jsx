// FILE: src/pages/HomePage.jsx

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { products, flashSaleProducts, CATEGORIES } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useApp } from "../context/AppContext";

const C = {
  indigo:      "#3730a3",
  indigoDark:  "#1e1b4b",
  indigoMid:   "#4f46e5",
  amber:       "#f59e0b",
  red:         "#dc2626",
  white:       "#ffffff",
  gray50:      "#f9fafb",
  gray100:     "#f3f4f6",
  gray200:     "#e5e7eb",
  gray400:     "#9ca3af",
  gray900:     "#111827",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  html, body { overflow-x: hidden; width: 100%; }
  .vx-page { width: 100%; overflow-x: hidden; background: #f3f4f6; }

  @keyframes vxTicker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .vx-ticker-wrap { overflow: hidden; white-space: nowrap; }
  .vx-ticker { display: inline-block; animation: vxTicker 22s linear infinite; }

  @keyframes vxHeroIn {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .vx-hero-slide { animation: vxHeroIn 0.42s ease; }

  @keyframes adScroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .vx-ad-strip-inner {
    display: inline-flex;
    gap: 8px;
    animation: adScroll 28s linear infinite;
    will-change: transform;
  }
  .vx-ad-strip-inner:hover { animation-play-state: paused; }

  .vx-pad { padding-left: 12px; padding-right: 12px; }
  @media (min-width: 640px)  { .vx-pad { padding-left: 20px; padding-right: 20px; } }
  @media (min-width: 1024px) { .vx-pad { padding-left: 32px; padding-right: 32px; } }

  /* ── Horizontal scroll rows ── */
  .vx-hscroll {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: #c7d2fe transparent;
    padding-bottom: 6px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }
  .vx-hscroll::-webkit-scrollbar { height: 4px; }
  .vx-hscroll::-webkit-scrollbar-track { background: transparent; }
  .vx-hscroll::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 4px; }
  .vx-hscroll > * { scroll-snap-align: start; flex-shrink: 0; }

  .vx-flash-item { width: 140px; }
  @media (min-width: 480px) { .vx-flash-item { width: 160px; } }

  .vx-feat-item { width: 155px; }
  @media (min-width: 480px) { .vx-feat-item { width: 175px; } }

  /* offer cards */
  .vx-offer-item {
    width: 130px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    text-decoration: none;
    display: block;
    aspect-ratio: 3/4;
    transition: transform 0.18s;
    flex-shrink: 0;
  }
  @media (min-width: 480px) { .vx-offer-item { width: 150px; } }
  .vx-offer-item:hover { transform: translateY(-3px); }
  .vx-offer-item img { width:100%; height:100%; object-fit:cover; display:block; }
  .vx-offer-item .oc-overlay {
    position:absolute; inset:0;
    background: linear-gradient(to top, rgba(0,0,0,0.78) 42%, rgba(0,0,0,0.04) 100%);
  }
  .vx-offer-item .oc-content {
    position:absolute; bottom:0; left:0; right:0; padding:9px 10px;
  }
  .oc-badge {
    display:inline-block; font-size:8px; font-weight:800;
    padding:2px 7px; border-radius:20px; margin-bottom:4px;
    text-transform:uppercase; letter-spacing:0.04em;
  }
  .oc-title { color:#fff; font-weight:800; font-size:12px; line-height:1.2; margin-bottom:2px; }
  .oc-price { font-weight:900; font-size:12px; margin-bottom:5px; }
  .oc-cta {
    display:inline-block; font-size:9px; font-weight:700;
    background:rgba(255,255,255,0.22); color:#fff;
    padding:2px 8px; border-radius:20px;
  }

  .vx-pcard { transition: box-shadow 0.18s, transform 0.18s; }
  .vx-pcard:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(55,48,163,0.13); }

  .vx-sec-hd { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
  .vx-sec-hd h2 { font-size:15px; font-weight:900; color:#1e1b4b; margin:0; }
  .vx-sec-hd a  { color:#3730a3; font-size:12px; font-weight:700; text-decoration:none; }

  .vx-sidebar { display: none; }
  @media (min-width: 900px) { .vx-sidebar { display: block; } }

  .vx-hero-layout { display: grid; grid-template-columns: 1fr; }
  @media (min-width: 900px) { .vx-hero-layout { grid-template-columns: 210px 1fr 200px; gap: 10px; } }

  .vx-subbanner { display: none; }
  @media (min-width: 900px) { .vx-subbanner { display: flex; } }

  /* ── Nav action icons ── */
  .vx-nav-action {
    display:flex; flex-direction:column; align-items:center;
    gap:2px; text-decoration:none; color:rgba(255,255,255,0.85);
    font-size:8.5px; font-weight:700; flex-shrink:0;
    padding:0 9px; position:relative; transition:color 0.12s, transform 0.12s;
  }
  .vx-nav-action:hover { color:#fff; transform: translateY(-1px); }
  .vx-nav-action i { font-size:20px; }
  .vx-nav-badge {
    position:absolute; top:-3px; right:3px;
    background:#ef4444; color:#fff; font-size:7.5px; font-weight:800;
    min-width:14px; height:14px; border-radius:100px;
    display:flex; align-items:center; justify-content:center; padding:0 3px;
    border: 1.5px solid rgba(255,255,255,0.3);
  }

  /* Icons: hidden on mobile, far-right on desktop only */
  .vx-nav-actions { display: none; }
  @media (min-width: 768px) {
    .vx-nav-actions {
      display: flex;
      align-items: center;
      gap: 0;
      margin-left: auto;
      flex-shrink: 0;
    }
  }

  /* Ad strip in nav */
  .vx-ad-strip-wrap {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    height: 44px;
    display: flex;
    align-items: center;
    mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
  }

  .vx-ad-card {
    height: 36px;
    min-width: 130px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
    cursor: pointer;
    text-decoration: none;
    display: flex;
    align-items: center;
    transition: transform 0.18s;
  }
  .vx-ad-card:hover { transform: scale(1.04); }
  .vx-ad-card img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
  .vx-ad-card .adc-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 100%);
  }
  .vx-ad-card .adc-text {
    position: relative; z-index: 2; padding: 0 10px;
    display: flex; flex-direction: column;
  }
  .adc-label { color: #fff; font-size: 9px; font-weight: 800; line-height: 1.1; white-space: nowrap; }
  .adc-sub   { color: rgba(255,255,255,0.7); font-size: 7.5px; font-weight: 600; white-space: nowrap; }

  /* Logo styles */
  .vx-logo-wrap {
    display: flex; align-items: center; gap: 0;
    text-decoration: none; flex-shrink: 0;
    position: relative;
  }
  .vx-logo-icon {
    width: 40px; height: 40px;
    background: linear-gradient(140deg, #f59e0b 0%, #f97316 60%, #ef4444 100%);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 0 2px rgba(255,255,255,0.18), 0 4px 14px rgba(245,158,11,0.5);
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }
  .vx-logo-icon::before {
    content: '';
    position: absolute;
    top: -6px; left: -6px;
    width: 26px; height: 26px;
    border-radius: 50%;
    background: rgba(255,255,255,0.14);
  }
  .vx-logo-text {
    display: flex; flex-direction: column; padding-left: 9px;
  }
  .vx-logo-name {
    font-family: 'Bebas Neue', 'DM Sans', sans-serif;
    font-size: 24px;
    font-weight: 400;
    color: #fff;
    letter-spacing: 2px;
    line-height: 1;
    display: flex;
    align-items: center;
  }
  .vx-logo-dot { color: #fbbf24; font-size: 28px; line-height: 0.85; }
  .vx-logo-sub {
    font-size: 7px;
    font-weight: 800;
    color: rgba(255,255,255,0.45);
    letter-spacing: 2.5px;
    text-transform: uppercase;
    margin-top: 1px;
  }
`;

// ─── Countdown ────────────────────────────────────────────────────────────────
function Countdown() {
  const [t, setT] = useState({ h:5, m:43, s:22 });
  useEffect(() => {
    const id = setInterval(() => setT(({ h, m, s }) => {
      if (--s < 0) { s=59; if (--m < 0) { m=59; if (--h < 0) h=23; } }
      return { h, m, s };
    }), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = n => String(n).padStart(2,"0");
  const Seg = ({ v }) => (
    <span style={{ background:"#2d2a6e", color:"#fff", fontWeight:800, fontSize:13, padding:"2px 6px", borderRadius:4, minWidth:26, textAlign:"center", fontFamily:"monospace" }}>{v}</span>
  );
  return (
    <div style={{ display:"flex", alignItems:"center", gap:3 }}>
      <Seg v={pad(t.h)}/><span style={{ color:"#fff", fontWeight:800 }}>:</span>
      <Seg v={pad(t.m)}/><span style={{ color:"#fff", fontWeight:800 }}>:</span>
      <Seg v={pad(t.s)}/>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
const SLIDES = [
  { tag:"🔥 Trending Now", title:"Smartphones & Accessories", sub:"Starting from", price:"KES 5,000", cta:"Shop Now", ctaLink:"/products?category=phones", bg:`linear-gradient(135deg,#1e1b4b 0%,#3730a3 55%,#6366f1 100%)`, img:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=480&q=85", accent:"#f59e0b" },
  { tag:"💻 New Arrivals",  title:"MacBooks & Laptops",        sub:"Up to",         price:"20% Off",   cta:"View Deals", ctaLink:"/products?category=laptops", bg:`linear-gradient(135deg,#111827 0%,#1e3a5f 55%,#1a3a8f 100%)`, img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=480&q=85", accent:"#38bdf8" },
  { tag:"🎧 Audio Week",   title:"Premium Headphones",         sub:"Deals from",    price:"KES 2,500", cta:"Shop Audio", ctaLink:"/products?category=audio",   bg:`linear-gradient(135deg,#1e1b4b 0%,#4c1d95 55%,#7c3aed 100%)`, img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=480&q=85", accent:"#a78bfa" },
];
function HeroBanner() {
  const [cur, setCur] = useState(0);
  const [key, setKey] = useState(0);
  useEffect(() => {
    const id = setInterval(()=>{ setCur(c=>(c+1)%SLIDES.length); setKey(k=>k+1); }, 4500);
    return ()=>clearInterval(id);
  }, []);
  const s = SLIDES[cur];
  return (
    <div style={{ position:"relative", borderRadius:10, overflow:"hidden", height:260 }}>
      <div key={key} className="vx-hero-slide" style={{ background:s.bg, height:"100%", display:"flex", alignItems:"center", padding:"18px 22px", position:"relative" }}>
        <div style={{ flex:1, zIndex:2, position:"relative" }}>
          <span style={{ background:"rgba(255,255,255,0.14)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20, display:"inline-block", marginBottom:8 }}>{s.tag}</span>
          <h2 style={{ color:"#fff", fontWeight:900, fontSize:"clamp(16px,3.5vw,25px)", lineHeight:1.15, marginBottom:8, maxWidth:260 }}>{s.title}</h2>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:12, marginBottom:3 }}>{s.sub}</p>
          <p style={{ color:s.accent, fontWeight:900, fontSize:23, marginBottom:16 }}>{s.price}</p>
          <Link to={s.ctaLink} style={{ background:"#fff", color:"#3730a3", fontWeight:800, fontSize:12, padding:"8px 18px", borderRadius:8, textDecoration:"none", display:"inline-block" }}>{s.cta} →</Link>
        </div>
        <img src={s.img} alt="" style={{ position:"absolute", right:0, top:0, height:"100%", width:"45%", objectFit:"cover", opacity:0.4, borderRadius:"0 10px 10px 0" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(0,0,0,0.2) 45%,transparent 100%)", borderRadius:10 }} />
        <div style={{ position:"absolute", bottom:10, left:18, display:"flex", gap:5, zIndex:3 }}>
          {SLIDES.map((_,i)=>(
            <button key={i} onClick={()=>{setCur(i);setKey(k=>k+1);}} style={{ width:cur===i?18:5, height:5, borderRadius:3, background:cur===i?"#fff":"rgba(255,255,255,0.35)", border:"none", cursor:"pointer", padding:0, transition:"width 0.3s" }} />
          ))}
        </div>
        {[-1,1].map(dir=>(
          <button key={dir} onClick={()=>{setCur(c=>(c+dir+SLIDES.length)%SLIDES.length);setKey(k=>k+1);}} style={{ position:"absolute", [dir<0?"left":"right"]:8, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.18)", border:"none", borderRadius:"50%", width:28, height:28, color:"#fff", fontSize:14, cursor:"pointer", zIndex:4, display:"flex", alignItems:"center", justifyContent:"center" }}>{dir<0?"‹":"›"}</button>
        ))}
      </div>
    </div>
  );
}

const LEFT_ADS = [
  { label:"Latest Phones", sub:"From KES 8,999", img:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=320&q=85", link:"/products?category=phones" },
  { label:"Tablet Deals",  sub:"Up to 20% off",  img:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=320&q=85", link:"/products?category=tablets" },
  { label:"Camera Gear",   sub:"Pro savings",     img:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=320&q=85", link:"/products?category=cameras" },
];
function LeftAdColumn() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8, height:260 }}>
      {LEFT_ADS.map(b=>(
        <Link key={b.label} to={b.link} style={{ flex:1, borderRadius:10, textDecoration:"none", overflow:"hidden", position:"relative", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8px 10px" }}>
          <img src={b.img} alt={b.label} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.72) 40%,rgba(0,0,0,0.08) 100%)" }} />
          <div style={{ position:"relative", zIndex:2 }}>
            <p style={{ color:"#fff", fontWeight:800, fontSize:11, marginBottom:1 }}>{b.label}</p>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:9, marginBottom:4 }}>{b.sub}</p>
            <span style={{ background:"rgba(255,255,255,0.2)", color:"#fff", fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:20 }}>Shop →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

const SUB_BANNERS = [
  { label:"Gaming Week", sub:"Up to 30% off", img:"https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=260&q=85", link:"/products?category=gaming", bg:`linear-gradient(135deg,#111827,#1a2744)` },
  { label:"Audio Deals", sub:"Premium sound",  img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=260&q=85", link:"/products?category=audio",  bg:`linear-gradient(135deg,#3730a3,#6366f1)` },
];
function SubBanners() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8, height:260 }}>
      {SUB_BANNERS.map(b=>(
        <Link key={b.label} to={b.link} style={{ flex:1, background:b.bg, borderRadius:10, padding:"12px 14px", textDecoration:"none", display:"flex", flexDirection:"column", justifyContent:"space-between", overflow:"hidden", position:"relative" }}>
          <div style={{ position:"relative", zIndex:2 }}>
            <p style={{ color:"#fff", fontWeight:800, fontSize:13, marginBottom:2 }}>{b.label}</p>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:10 }}>{b.sub}</p>
          </div>
          <span style={{ background:"rgba(255,255,255,0.18)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, alignSelf:"flex-start", position:"relative", zIndex:2 }}>Shop Now →</span>
          <img src={b.img} alt={b.label} style={{ position:"absolute", right:0, top:0, height:"100%", width:"55%", objectFit:"cover", borderRadius:"0 10px 10px 0" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(0,0,0,0.55) 40%,transparent 100%)" }} />
        </Link>
      ))}
    </div>
  );
}

const OFFER_CATS = [
  { label:"Phones",      badge:"Hot 🔥",      badgeColor:"#dc2626", price:"From KES 8,999",  priceColor:"#fbbf24", img:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85",  link:"/products?category=phones" },
  { label:"Laptops",     badge:"New 💻",      badgeColor:"#2563eb", price:"Up to 20% Off",   priceColor:"#6ee7b7", img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=85",  link:"/products?category=laptops" },
  { label:"Audio",       badge:"Deal 🎧",     badgeColor:"#7c3aed", price:"From KES 2,500",  priceColor:"#c4b5fd", img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=85",  link:"/products?category=audio" },
  { label:"Tablets",     badge:"Sale 📱",     badgeColor:"#d97706", price:"Up to 15% Off",   priceColor:"#fcd34d", img:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=85",     link:"/products?category=tablets" },
  { label:"Gaming",      badge:"Epic 🎮",     badgeColor:"#059669", price:"Up to 30% Off",   priceColor:"#6ee7b7", img:"https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&q=85",  link:"/products?category=gaming" },
  { label:"Cameras",     badge:"Pro 📷",      badgeColor:"#0369a1", price:"From KES 25,000", priceColor:"#7dd3fc", img:"https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=400&q=85",  link:"/products?category=cameras" },
  { label:"Accessories", badge:"⚡ Essentials",badgeColor:"#9d174d", price:"From KES 500",    priceColor:"#f9a8d4", img:"https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=85",  link:"/products?category=accessories" },
  { label:"Clearance",   badge:"−50% 🏷️",    badgeColor:"#dc2626", price:"While stocks last",priceColor:"#fca5a5",img:"https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=85",  link:"/products" },
];

// ─── Ad Strip Items (for the nav) ─────────────────────────────────────────────
const NAV_ADS = [
  { label:"iPhone 15 Pro", sub:"KES 159,999", img:"https://images.unsplash.com/photo-1695048133142-1a20484bce71?w=260&q=85", link:"/products?category=phones", accent:"#f59e0b" },
  { label:"MacBook Air M3", sub:"20% Off Today", img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=260&q=85", link:"/products?category=laptops", accent:"#38bdf8" },
  { label:"AirPods Pro 2", sub:"From KES 32,999", img:"https://images.unsplash.com/photo-1588423771073-b8903fead714?w=260&q=85", link:"/products?category=audio", accent:"#a78bfa" },
  { label:"Samsung S24 Ultra", sub:"Flash Deal 🔥", img:"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=260&q=85", link:"/products?category=phones", accent:"#6ee7b7" },
  { label:"Sony WH-1000XM5", sub:"KES 39,999", img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=260&q=85", link:"/products?category=audio", accent:"#fcd34d" },
  { label:"iPad Pro M4", sub:"Up to 15% Off", img:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=260&q=85", link:"/products?category=tablets", accent:"#f9a8d4" },
  { label:"PS5 Bundle", sub:"Epic Deal 🎮", img:"https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=260&q=85", link:"/products?category=gaming", accent:"#6ee7b7" },
  { label:"Canon EOS R8", sub:"Pro Savings", img:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=260&q=85", link:"/products?category=cameras", accent:"#fbbf24" },
];

function PromoBar() {
  const text = ["🚚 Fast delivery countrywide","🔒 100% secure payments","🔄 30-day returns","⚡ Flash deals every day!"].join("   ·   ");
  const doubled = text + "   ·   " + text;
  return (
    <div style={{ background:"#2d2a6e", color:"#fff", fontSize:11, fontWeight:500, padding:"5px 0", position:"fixed", top:0, left:0, right:0, zIndex:210, height:28, display:"flex", alignItems:"center" }}>
      <div className="vx-ticker-wrap" style={{ width:"100%" }}><span className="vx-ticker">{doubled}</span></div>
    </div>
  );
}

// ─── Account Dropdown ─────────────────────────────────────────────────────────
const ACCOUNT_DROPDOWN_CSS = `
  .vx-acct-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 220px;
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 8px 32px rgba(30,27,75,0.18), 0 2px 8px rgba(0,0,0,0.08);
    border: 1px solid rgba(99,102,241,0.1);
    z-index: 999;
    overflow: hidden;
    animation: dropIn 0.18s ease;
  }
  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .vx-acct-header {
    background: linear-gradient(135deg, #1e1b4b, #3730a3);
    padding: 14px 16px;
  }
  .vx-acct-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f59e0b, #f97316);
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; font-size: 15px; color: #fff;
    flex-shrink: 0;
    border: 2px solid rgba(255,255,255,0.3);
  }
  .vx-acct-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 16px;
    color: #1e1b4b;
    font-size: 13px; font-weight: 600;
    text-decoration: none;
    transition: background 0.12s;
    cursor: pointer;
    border: none; background: none; width: 100%; text-align: left;
  }
  .vx-acct-item:hover { background: #f3f4f6; }
  .vx-acct-item i { font-size: 17px; color: #6366f1; flex-shrink: 0; }
  .vx-acct-item.danger { color: #dc2626; }
  .vx-acct-item.danger i { color: #dc2626; }
  .vx-acct-divider { height: 1px; background: #e5e7eb; margin: 4px 0; }
`;

function AccountDropdown({ user, logout, wishlistCount, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div ref={ref} className="vx-acct-dropdown">
      <div className="vx-acct-header">
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div className="vx-acct-avatar">{initial}</div>
          <div style={{ minWidth:0 }}>
            <p style={{ color:'#fff', fontWeight:800, fontSize:13, margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name}</p>
            <p style={{ color:'rgba(255,255,255,0.55)', fontSize:10, margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.email}</p>
          </div>
        </div>
      </div>

      <div style={{ padding:'4px 0' }}>
        <Link to="/account" className="vx-acct-item" onClick={onClose}>
          <i className="ti ti-user-circle" /> My Account
        </Link>
        <Link to="/orders" className="vx-acct-item" onClick={onClose}>
          <i className="ti ti-package" /> My Orders
        </Link>
        <Link to="/wishlist" className="vx-acct-item" onClick={onClose}>
          <i className="ti ti-heart" />
          <span>Wishlist</span>
          {wishlistCount > 0 && (
            <span style={{ marginLeft:'auto', background:'#6366f1', color:'#fff', fontSize:10, fontWeight:800, padding:'1px 7px', borderRadius:20 }}>{wishlistCount}</span>
          )}
        </Link>

        <div className="vx-acct-divider" />

        <button className="vx-acct-item danger" onClick={() => { logout(); onClose(); }}>
          <i className="ti ti-logout" /> Sign Out
        </button>
      </div>
    </div>
  );
}

// ─── Redesigned Logo ──────────────────────────────────────────────────────────
function VantixLogo() {
  return (
    <Link to="/" className="vx-logo-wrap">
      {/* Icon mark: stylised V bolt */}
      <div className="vx-logo-icon">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          {/* Bold V shape with lightning bolt feel */}
          <path d="M4 4L9 14L11 10L13 14L18 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11 10L11 18" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="11" cy="18" r="1.5" fill="white" opacity="0.7"/>
        </svg>
      </div>
      <div className="vx-logo-text">
        <span className="vx-logo-name">
          VANTIX<span className="vx-logo-dot">.</span>
        </span>
        <span className="vx-logo-sub">SHOP254 · KENYA</span>
      </div>
    </Link>
  );
}

// ─── Nav Ad Strip (replaces search bar) ───────────────────────────────────────
function NavAdStrip() {
  // Duplicate for seamless loop
  const items = [...NAV_ADS, ...NAV_ADS];
  return (
    <div className="vx-ad-strip-wrap">
      <div className="vx-ad-strip-inner">
        {items.map((ad, i) => (
          <Link key={i} to={ad.link} className="vx-ad-card">
            <img src={ad.img} alt={ad.label} />
            <div className="adc-overlay" />
            <div className="adc-text">
              <span className="adc-label">{ad.label}</span>
              <span className="adc-sub" style={{ color: ad.accent }}>{ad.sub}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MainNav({ cartCount, wishlistCount, user, logout }) {
  const [showAcct, setShowAcct] = useState(false);

  return (
    <nav style={{ background:"linear-gradient(100deg,#1e1b4b 0%,#3730a3 35%,#4f46e5 65%,#6366f1 100%)", boxShadow:"0 3px 18px rgba(55,48,163,0.32)", position:"fixed", top:28, left:0, right:0, zIndex:200, height:58, display:"flex", alignItems:"center" }}>
      <div className="vx-pad" style={{ display:"flex", alignItems:"center", gap:12, maxWidth:1400, margin:"0 auto", width:"100%" }}>

        {/* Redesigned Logo */}
        <VantixLogo />

        {/* Ad Strip — fills middle space */}
        <NavAdStrip />

        {/* Icons — desktop only, far right */}
        <div className="vx-nav-actions">
          <Link to="/wishlist" className="vx-nav-action">
            <i className="ti ti-heart" />
            {wishlistCount > 0 && <span className="vx-nav-badge">{wishlistCount > 9 ? "9+" : wishlistCount}</span>}
            <span>Wishlist</span>
          </Link>
          <Link to="/cart" className="vx-nav-action">
            <i className="ti ti-shopping-cart" />
            {cartCount > 0 && <span className="vx-nav-badge">{cartCount > 9 ? "9+" : cartCount}</span>}
            <span>Cart</span>
          </Link>

          {/* Account — dropdown if logged in, navigate if not */}
          <div style={{ position:"relative" }}>
            {user ? (
              <button
                className="vx-nav-action"
                style={{ background:"none", border:"none", cursor:"pointer" }}
                onClick={() => setShowAcct(v => !v)}
              >
                {/* Avatar circle with initial */}
                <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#f59e0b,#f97316)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:12, color:"#fff", border:"2px solid rgba(255,255,255,0.35)" }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span>{user.name?.split(" ")[0]}</span>
              </button>
            ) : (
              <Link to="/auth" className="vx-nav-action">
                <i className="ti ti-user" />
                <span>Account</span>
              </Link>
            )}

            {showAcct && user && (
              <AccountDropdown
                user={user}
                logout={logout}
                wishlistCount={wishlistCount}
                onClose={() => setShowAcct(false)}
              />
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}

function Section({ title, link, children, bg="#fff" }) {
  return (
    <div style={{ background:bg, borderRadius:12, padding:"13px 13px 15px", marginBottom:10 }}>
      <div className="vx-sec-hd">
        <h2>{title}</h2>
        {link && <Link to={link}>See All →</Link>}
      </div>
      {children}
    </div>
  );
}

export default function HomePage() {
  const { dispatch, cartCount, wishlist, user, logout } = useApp();

  return (
    <div className="vx-page">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
      <style>{GLOBAL_CSS}{ACCOUNT_DROPDOWN_CSS}</style>

      <PromoBar />
      {/* 28px promo + 58px nav = 86px */}
      <MainNav cartCount={cartCount} wishlistCount={wishlist?.length ?? 0} user={user} logout={logout} />

      <div style={{ height:86 }} />

      <div className="vx-pad" style={{ maxWidth:1400, margin:"0 auto", paddingTop:12, paddingBottom:80 }}>

        {/* Hero */}
        <div className="vx-hero-layout" style={{ gap:10, marginBottom:10 }}>
          <div className="vx-sidebar"><LeftAdColumn /></div>
          <HeroBanner />
          <div className="vx-subbanner" style={{ flexDirection:"column", gap:8 }}><SubBanners /></div>
        </div>

        {/* Shop by Category — horizontal scroll */}
        <Section title="Shop by Category" link="/products">
          <div className="vx-hscroll">
            {OFFER_CATS.map(cat => (
              <Link key={cat.label} to={cat.link}
                onClick={() => dispatch({ type:"SET_FILTER", filter:{ category:cat.label.toLowerCase() } })}
                className="vx-offer-item"
              >
                <img src={cat.img} alt={cat.label} />
                <div className="oc-overlay" />
                <div className="oc-content">
                  <span className="oc-badge" style={{ background:cat.badgeColor, color:"#fff" }}>{cat.badge}</span>
                  <p className="oc-title">{cat.label}</p>
                  <p className="oc-price" style={{ color:cat.priceColor }}>{cat.price}</p>
                  <span className="oc-cta">Shop →</span>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        {/* Flash sale */}
        <div style={{ background:C.red, borderRadius:12, overflow:"hidden", marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 13px", flexWrap:"wrap", gap:6 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:15 }}>⚡</span>
              <span style={{ color:"#fff", fontWeight:900, fontSize:14 }}>Flash Sales</span>
              <span style={{ color:"rgba(255,255,255,0.55)", fontSize:10 }}>| Live Now</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ color:"rgba(255,255,255,0.7)", fontSize:10 }}>Time Left:</span>
              <Countdown />
            </div>
            <Link to="/products" style={{ color:"#fff", fontSize:10, fontWeight:700, textDecoration:"none", background:"rgba(255,255,255,0.15)", padding:"3px 11px", borderRadius:20 }}>See All →</Link>
          </div>
          <div style={{ background:C.gray50, padding:"10px 13px" }}>
            <div className="vx-hscroll">
              {flashSaleProducts.map(p => (
                <div key={p.id} className="vx-pcard vx-flash-item"><ProductCard product={p} compact /></div>
              ))}
            </div>
          </div>
        </div>

        {/* Promo banners */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:10, marginBottom:10 }}>
          {[
            { title:"Top Phones",   sub:"Latest models",  bg:`linear-gradient(135deg,#3730a3,#6366f1)`, img:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=320&q=85", link:"/products?category=phones" },
            { title:"Laptop Deals", sub:"Up to 15% off",  bg:`linear-gradient(135deg,#111827,#374151)`,  img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=320&q=85", link:"/products?category=laptops" },
            { title:"Audio Week",   sub:"Premium sound",  bg:`linear-gradient(135deg,#7c3aed,#a855f7)`,  img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=320&q=85", link:"/products?category=audio" },
          ].map(b=>(
            <Link key={b.title} to={b.link} style={{ background:b.bg, borderRadius:12, padding:"15px 16px", textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"space-between", minHeight:78, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"relative", zIndex:2 }}>
                <p style={{ color:"#fff", fontWeight:800, fontSize:13, marginBottom:2 }}>{b.title}</p>
                <p style={{ color:"rgba(255,255,255,0.62)", fontSize:10, marginBottom:8 }}>{b.sub}</p>
                <span style={{ background:"rgba(255,255,255,0.2)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20 }}>Shop Now →</span>
              </div>
              <img src={b.img} alt={b.title} style={{ position:"absolute", right:0, top:0, height:"100%", width:"46%", objectFit:"cover", borderRadius:"0 12px 12px 0" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(0,0,0,0.44) 44%,transparent 100%)", borderRadius:12 }} />
            </Link>
          ))}
        </div>

        {/* Featured products — horizontal scroll */}
        <Section title="Featured Products" link="/products">
          <div className="vx-hscroll">
            {products.slice(0,14).map(p => (
              <div key={p.id} className="vx-pcard vx-feat-item"><ProductCard product={p} /></div>
            ))}
          </div>
        </Section>

        {/* Trust bar */}
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"5px 16px", padding:"8px 0 2px" }}>
          {[
            { icon:"↩️", label:"30-day Returns" },
            { icon:"🔒", label:"Secure Payments" },
            { icon:"🎧", label:"24/7 Support" },
            { icon:"🚚", label:"Fast Delivery" },
          ].map(t => (
            <span key={t.label} style={{ fontSize:10.5, color:C.gray400, display:"flex", alignItems:"center", gap:3, fontWeight:600 }}>
              <span style={{ fontSize:12 }}>{t.icon}</span>{t.label}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}