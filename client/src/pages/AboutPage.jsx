// FILE: src/pages/AboutPage.jsx
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero Section */}
      <div
        className="relative h-[320px] md:h-[380px] flex items-center justify-center text-center px-4"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1600&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/55"></div>

        <div className="relative z-10 max-w-3xl text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            About Vantix Shop254
          </h1>

          <p className="text-sm md:text-lg text-gray-200 leading-relaxed">
            Your trusted online shopping destination for quality products,
            affordable pricing, and fast reliable delivery.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-5 md:px-10 py-10">

        {/* About + Mission */}
        <div className="grid md:grid-cols-2 gap-10 mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Who We Are
            </h2>

            <p className="text-gray-700 leading-7 text-sm md:text-base">
              Vantix Shop254 is an online shopping platform built to make
              buying products simple, fast, and convenient. We provide
              electronics, fashion items, home essentials, beauty products,
              accessories, and many more products in one place.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Our Mission
            </h2>

            <p className="text-gray-700 leading-7 text-sm md:text-base">
              Our mission is to simplify online shopping by offering affordable
              products, secure payments, smooth ordering, and reliable delivery
              services customers can trust.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Why Shop With Us
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm md:text-base text-gray-700">
            <div>✔ Affordable Prices</div>
            <div>✔ Quality Products</div>
            <div>✔ Secure Payments</div>
            <div>✔ Fast Delivery</div>
            <div>✔ Easy Returns</div>
            <div>✔ Reliable Support</div>
          </div>
        </div>

        {/* Commitment */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Our Commitment
          </h2>

          <p className="text-gray-700 leading-7 max-w-3xl mx-auto text-sm md:text-base">
            We are committed to improving online shopping by making it faster,
            safer, and more convenient for every customer while delivering
            products people can trust.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center border-t border-gray-200 pt-8">
          <Link
            to="/products"
            className="inline-block px-8 py-3 rounded-lg font-semibold text-white 
            bg-gradient-to-r from-orange-500 to-red-500
            hover:from-orange-600 hover:to-red-600
            shadow-[0_0_20px_rgba(249,115,22,0.6)]
            hover:shadow-[0_0_30px_rgba(239,68,68,0.7)]
            transition duration-300"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}