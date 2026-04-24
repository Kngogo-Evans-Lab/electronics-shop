// FILE: src/pages/AboutPage.jsx
import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-16 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">About TechStore Kenya</h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
          Kenya's #1 online electronics store — genuine products, fast delivery, best prices.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Mission */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 text-base leading-relaxed">
            To make quality electronics accessible and affordable for every Kenyan. We believe technology
            should empower people, and we're committed to providing a seamless shopping experience with
            genuine products and reliable service.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-14">
          {[
            { value: '50K+',   label: 'Happy Customers' },
            { value: '1,000+', label: 'Products' },
            { value: '47',     label: 'Counties Served' },
            { value: '5 Stars', label: 'Average Rating' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <p className="text-2xl font-extrabold text-blue-600 mb-1">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          {[
            { icon: '✅', title: 'Genuine Products', desc: 'All items sourced directly from authorized distributors with full manufacturer warranties.' },
            { icon: '🚚', title: 'Fast Delivery',    desc: 'Same-day delivery in Nairobi and 2-5 day shipping to all 47 counties across Kenya.' },
            { icon: '🔒', title: 'Secure Shopping',  desc: 'Bank-grade SSL encryption protects every transaction. Your data is always safe with us.' },
          ].map(v => (
            <div key={v.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">{v.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-3.5 rounded-xl shadow-lg transition">
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  )
}