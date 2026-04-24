// FILE: src/pages/HelpPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'

const faqs = [
  { q: 'How do I track my order?', a: "Go to My Orders in your account dashboard. You'll find real-time tracking information for all your orders." },
  { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, M-Pesa, PayPal, and Stripe. All transactions are secured with SSL encryption.' },
  { q: 'How long does delivery take?', a: 'Standard delivery within Nairobi takes 1–2 business days. Upcountry deliveries take 2–5 business days.' },
  { q: 'Can I return a product?', a: 'Yes! We offer a 30-day return policy on all products. Items must be in original condition with packaging.' },
  { q: 'Are all products genuine?', a: 'Absolutely. All products on TechStore are sourced from authorized distributors and come with manufacturer warranties.' },
  { q: 'How do I cancel an order?', a: 'Orders can be cancelled within 1 hour of placing them. Go to My Orders and click "Cancel Order".' },
]

export default function HelpPage() {
  const [open, setOpen] = useState(null)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-blue-700 text-white py-14 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Help Center</h1>
        <p className="text-blue-100 text-lg mb-6">How can we help you today?</p>
        <div className="max-w-xl mx-auto">
          <div className="flex bg-white rounded-xl overflow-hidden shadow-lg">
            <input
              type="text"
              placeholder="Search for help topics…"
              className="flex-1 px-5 py-3.5 text-gray-800 text-sm focus:outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 text-sm font-semibold transition">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { icon: '📦', title: 'Track Order',  desc: 'Check delivery status',   to: '/orders'  },
            { icon: '↩️', title: 'Returns',       desc: 'Return or exchange',      to: '/account' },
            { icon: '💳', title: 'Payments',      desc: 'Payment methods & issues', to: '/contact' },
            { icon: '🎧', title: 'Contact Us',    desc: 'Talk to our team',        to: '/contact' },
          ].map(item => (
            <Link key={item.title} to={item.to}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-center group">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="font-bold text-gray-800 text-sm group-hover:text-blue-600">{item.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </Link>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                  {faq.q}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {open === i && (
                  <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-blue-600 rounded-2xl text-white text-center py-10 px-6">
          <h3 className="text-xl font-bold mb-2">Still need help?</h3>
          <p className="text-blue-100 mb-5">Our support team is available 24/7</p>
          <Link to="/contact"
            className="inline-block bg-white text-blue-700 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition shadow-lg">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}