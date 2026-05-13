import { Link } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Headset,
  Building2,
  Scale,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";

const sections = [
  {
    icon: ShoppingCart,
    title: "SHOP",
    links: [
      { label: "All Products", to: "/products" },
      { label: "Phones", to: "/products?category=phones" },
      { label: "Laptops", to: "/products?category=laptops" },
      { label: "Accessories", to: "/products?category=accessories" },
      { label: "Gaming", to: "/products?category=gaming" },
    ],
  },
  {
    icon: User,
    title: "ACCOUNT",
    links: [
      { label: "Sign In / Register", to: "/auth" },
      { label: "My Orders", to: "/orders" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Cart", to: "/cart" },
    ],
  },
  {
    icon: Headset,
    title: "SUPPORT",
    links: [
      { label: "Help Center", to: "/help" },
      { label: "Track Order", to: "/orders" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
  {
    icon: Building2,
    title: "COMPANY",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Blog", to: "/about" },
    ],
  },
  {
    icon: Scale,
    title: "LEGAL",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="relative min-h-screen text-gray-900 bg-black overflow-hidden">

      {/* 🌐 TECH BACKGROUND LAYER */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-black to-gray-950" />

        {/* grid tech layer */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* shopping visuals overlay */}
        <div className="absolute inset-0 opacity-10 mix-blend-screen">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* HEADER */}
      <div className="relative z-10 py-14 text-center">

        <div className="flex items-center justify-center gap-2 text-white">
          <LayoutGrid className="w-5 h-5" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-[0.3em] uppercase">
            SITEMAP
          </h1>
        </div>

        <p className="text-[11px] text-indigo-200 mt-2">
          Navigate everything in Vantix Shop254
        </p>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-16">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <div
                key={section.title}
                className="
                  relative
                  backdrop-blur-md
                  bg-white/5
                  border border-white/10
                  rounded-xl
                  p-5
                  shadow-[0_10px_30px_rgba(0,0,0,0.4)]
                  hover:translate-y-[-4px]
                  transition
                "
              >

                {/* 3D glow edge */}
                <div className="absolute inset-0 rounded-xl border border-indigo-500/10" />

                {/* section header */}
                <div className="flex items-center gap-2 mb-4 text-white">
                  <Icon className="w-4 h-4 text-indigo-300" />
                  <h2 className="text-xs font-bold tracking-widest">
                    {section.title}
                  </h2>
                </div>

                {/* links */}
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="
                          flex items-center gap-2
                          text-sm text-gray-300
                          hover:text-white
                          transition
                        "
                      >
                        <ChevronRight className="w-3 h-3 text-indigo-400" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}