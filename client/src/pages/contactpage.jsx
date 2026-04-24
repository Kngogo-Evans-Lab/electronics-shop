// FILE: src/pages/ContactPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSent(false), 5000)
  }

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-16 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Contact Us</h1>
        <p className="text-blue-100 text-lg max-w-xl mx-auto">
          We're here to help. Reach out and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact info */}
          <div className="space-y-5">
            {[
              { icon: '📍', title: 'Our Office', lines: ['TechStore Kenya Ltd', 'Westlands Business Park', 'Westlands, Nairobi, Kenya'] },
              { icon: '📞', title: 'Phone', lines: ['+254 700 123 456', '+254 711 987 654', 'Mon–Sat, 8am–8pm'] },
              { icon: '✉️', title: 'Email', lines: ['support@techstorekenya.co.ke', 'sales@techstorekenya.co.ke'] },
              { icon: '⏰', title: 'Working Hours', lines: ['Monday – Friday: 8am – 8pm', 'Saturday: 9am – 6pm', 'Sunday: 10am – 4pm'] },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm mb-1">{item.title}</p>
                    {item.lines.map(l => <p key={l} className="text-sm text-gray-500">{l}</p>)}
                  </div>
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <p className="font-bold text-gray-800 text-sm mb-3">Follow Us</p>
              <div className="flex gap-3">
                {[
                  { label: 'Facebook', href: 'https://facebook.com/TechStoreKenya', color: 'hover:bg-blue-600', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg> },
                  { label: 'Instagram', href: 'https://instagram.com/TechStoreKenya', color: 'hover:bg-pink-600', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
                  { label: 'TikTok', href: 'https://tiktok.com/@TechStoreKenya', color: 'hover:bg-black', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z"/></svg> },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                    className={`w-9 h-9 bg-gray-100 ${s.color} hover:text-white text-gray-600 rounded-lg flex items-center justify-center transition-colors`}
                    title={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h2>

            {sent ? (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-4 mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <p className="font-semibold text-sm">Message sent! We'll get back to you within 24 hours.</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input required type="text" value={form.name} onChange={update('name')} placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                  <input required type="email" value={form.email} onChange={update('email')} placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
                <select required value={form.subject} onChange={update('subject')}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                  <option value="">Select a subject</option>
                  <option>Order Issue</option>
                  <option>Returns & Refunds</option>
                  <option>Product Inquiry</option>
                  <option>Payment Problem</option>
                  <option>Technical Support</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                <textarea required rows={5} value={form.message} onChange={update('message')} placeholder="Tell us how we can help…"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none" />
              </div>
              <button type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition">
                Send Message →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}