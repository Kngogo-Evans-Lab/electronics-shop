// FILE: src/components/Footer.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z" />
  </svg>
);

const SOCIAL_LINKS = [
  { label: "Facebook",  href: "https://facebook.com/TechStoreKenya",  hoverBg: "hover:bg-blue-600", icon: <FacebookIcon /> },
  { label: "Instagram", href: "https://instagram.com/TechStoreKenya", hoverBg: "hover:bg-pink-600", icon: <InstagramIcon /> },
  { label: "TikTok",    href: "https://tiktok.com/@TechStoreKenya",   hoverBg: "hover:bg-gray-600", icon: <TikTokIcon /> },
];

const NAV_SECTIONS = [
  {
    title: "Shop",
    links: [
      { label: "All Products", to: "/products" },
      { label: "Phones",       to: "/products?category=phones" },
      { label: "Laptops",      to: "/products?category=laptops" },
      { label: "Audio",        to: "/products?category=audio" },
      { label: "Gaming",       to: "/products?category=gaming" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "My Account",        to: "/account" },
      { label: "My Orders",         to: "/orders" },
      { label: "Track Order",       to: "/orders" },
      { label: "Returns & Refunds", to: "/help" },
      { label: "Help Center",       to: "/help" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us",   to: "/about" },
      { label: "Careers",    to: "/about" },
      { label: "Press",      to: "/about" },
      { label: "Contact Us", to: "/contact" },
      { label: "Blog",       to: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy",   to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Cookie Policy",    to: "/privacy" },
      { label: "Sitemap",          to: "/products" },
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
    <footer className="bg-gray-900 text-gray-400 mt-8">
      {/* Newsletter */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-bold text-lg">Subscribe to our newsletter</h3>
              <p className="text-blue-100 text-sm">Get the latest deals and tech news delivered to your inbox</p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Subscribed! Thank you.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full sm:w-auto gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 sm:w-64 px-4 py-2.5 rounded-xl text-sm text-gray-800 focus:outline-none"
                />
                <button type="submit" className="bg-white text-blue-700 font-bold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition text-sm whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                  <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z"/>
                  <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z"/>
                  <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"/>
                </svg>
              </div>
              <span className="font-bold text-white text-lg">Tech<span className="text-blue-400">Store</span></span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">Kenya's #1 online electronics store. Genuine products, fast delivery, best prices.</p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label}
                  className={`w-8 h-8 bg-gray-800 ${s.hoverBg} hover:text-white text-gray-400 rounded-lg flex items-center justify-center transition-colors`}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav sections */}
          {NAV_SECTIONS.map(section => (
            <div key={section.title}>
              <h3 className="text-white font-semibold text-sm mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm hover:text-blue-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} TechStore Kenya. All rights reserved.</p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-gray-500">Secure payments:</span>
            {["Visa", "M-Pesa", "PayPal", "Stripe", "Mastercard"].map(p => (
              <span key={p} className="bg-gray-800 text-gray-300 text-[10px] font-bold px-2 py-1 rounded">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}