// FILE: src/pages/HelpPage.jsx

import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

const CATEGORIES = [
  { id: 'all',      label: 'All Topics',   icon: 'ti-layout-grid' },
  { id: 'orders',   label: 'Orders',       icon: 'ti-package' },
  { id: 'payments', label: 'Payments',     icon: 'ti-credit-card' },
  { id: 'delivery', label: 'Delivery',     icon: 'ti-truck' },
  { id: 'returns',  label: 'Returns',      icon: 'ti-arrow-back-up' },
  { id: 'account',  label: 'Account',      icon: 'ti-user-circle' },
  { id: 'products', label: 'Products',     icon: 'ti-device-mobile' },
]

const ALL_FAQS = [
  {
    cat: 'orders',
    q: 'How do I track my order?',
    a: 'Go to My Orders in your account dashboard. You\'ll find real-time tracking information for all your orders, including estimated delivery times and courier details.',
  },
  {
    cat: 'orders',
    q: 'Can I cancel or modify my order?',
    a: 'Orders can be cancelled or modified within 1 hour of placing them. Go to My Orders and click "Cancel Order" or "Edit Order". After 1 hour the order moves to fulfilment and changes are no longer possible.',
  },
  {
    cat: 'payments',
    q: 'What payment methods do you accept?',
    a: 'We accept Visa, Mastercard, M-Pesa, PayPal, and Stripe. All transactions are secured with SSL encryption and PCI-DSS compliance.',
  },
  {
    cat: 'payments',
    q: 'Is it safe to save my card details?',
    a: 'Yes. We never store raw card numbers on our servers. Your payment details are tokenised by our PCI-compliant payment gateway (Stripe), and you can remove saved cards from your Account settings at any time.',
  },
  {
    cat: 'delivery',
    q: 'How long does delivery take?',
    a: 'Standard delivery within Nairobi takes 1–2 business days. Upcountry deliveries take 2–5 business days depending on the courier and destination.',
  },
  {
    cat: 'delivery',
    q: 'Do you deliver outside Kenya?',
    a: 'Currently we deliver within Kenya only. International shipping is on our roadmap — sign up for our newsletter to be notified when it launches.',
  },
  {
    cat: 'returns',
    q: 'Can I return a product?',
    a: 'Yes. We offer a 30-day return policy on all products. Items must be in original condition with all original packaging and accessories included.',
  },
  {
    cat: 'returns',
    q: 'How long does a refund take?',
    a: 'Once your return is received and inspected (1–2 business days), your refund is processed within 3–5 business days. M-Pesa refunds are typically faster than card refunds.',
  },
  {
    cat: 'account',
    q: 'How do I reset my password?',
    a: 'On the Sign In page, click "Forgot password?" and enter your email. You\'ll receive a reset link within a few minutes. Check your spam folder if it doesn\'t arrive.',
  },
  {
    cat: 'account',
    q: 'How do I update my delivery address?',
    a: 'Go to Account → Addresses. You can add, edit, or delete addresses there. Changes take effect immediately for future orders.',
  },
  {
    cat: 'products',
    q: 'Are all products genuine?',
    a: 'Absolutely. All products are sourced directly from authorised distributors and come with full manufacturer warranties. We do not list grey-market or refurbished items unless explicitly labelled.',
  },
  {
    cat: 'products',
    q: 'Do products come with a warranty?',
    a: 'Yes. Every product comes with at least a 1-year manufacturer warranty. The warranty period and terms are listed on each product page. You can also register your warranty through your account.',
  },
]

const QUICK_LINKS = [
  { icon: 'ti-package',         title: 'Track an order',    desc: 'See your delivery status',    to: '/orders',  cat: 'orders' },
  { icon: 'ti-arrow-back-up',   title: 'Start a return',    desc: 'Return or exchange items',    to: '/returns', cat: 'returns' },
  { icon: 'ti-credit-card',     title: 'Payment help',      desc: 'Methods, failures, refunds',  to: '/contact', cat: 'payments' },
  { icon: 'ti-truck',           title: 'Delivery info',     desc: 'Times, coverage & fees',      to: '/contact', cat: 'delivery' },
  { icon: 'ti-user-circle',     title: 'Account & security',desc: 'Password, address, profile',  to: '/account', cat: 'account' },
  { icon: 'ti-headset',         title: 'Contact support',   desc: 'Talk to our team',            to: '/contact', cat: 'all' },
]

const CONTACT_CHANNELS = [
  {
    icon: 'ti-brand-whatsapp',
    label: 'WhatsApp',
    value: '+254 722 116 713',
    note: 'Mon – Sat, 8 am – 8 pm',
    color: '#25D366',
    href: 'https://wa.me/254722116713?text=Hi%20Vantix%2C%20I%20need%20help.',
  },
  {
    icon: 'ti-phone',
    label: 'Phone',
    value: '+254 722 116 713',
    note: 'Mon – Sat, 8 am – 6 pm',
    color: '#2563eb',
    href: 'tel:+254722116713',
  },
  {
    icon: 'ti-mail',
    label: 'Email',
    value: 'vantixshop254@gmail.com',
    note: 'Reply within 24 hours',
    color: '#7c3aed',
    href: 'mailto:vantixshop254@gmail.com',
  },
]

export default function HelpPage() {
  const [query, setQuery]       = useState('')
  const [activeCat, setActiveCat] = useState('all')
  const [openFaq, setOpenFaq]   = useState(null)
  const inputRef = useRef(null)

  const q = query.trim().toLowerCase()

  const filteredFaqs = useMemo(() => {
    let list = ALL_FAQS
    if (activeCat !== 'all') list = list.filter(f => f.cat === activeCat)
    if (q) list = list.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
    return list
  }, [q, activeCat])

  const filteredLinks = useMemo(() => {
    if (!q && activeCat === 'all') return QUICK_LINKS
    let list = QUICK_LINKS
    if (activeCat !== 'all') list = list.filter(l => l.cat === activeCat || l.cat === 'all')
    if (q) list = list.filter(l => l.title.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q))
    return list
  }, [q, activeCat])

  const handleCatChange = (id) => {
    setActiveCat(id)
    setOpenFaq(null)
  }

  const handleQueryChange = (e) => {
    setQuery(e.target.value)
    setOpenFaq(null)
    if (e.target.value) setActiveCat('all')
  }

  const clearSearch = () => {
    setQuery('')
    setOpenFaq(null)
    inputRef.current?.focus()
  }

  const toggleFaq = (i) => setOpenFaq(prev => prev === i ? null : i)

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />

      <style>{`
        .hlp-hero {
          background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%);
          padding: 52px 16px 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hlp-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 50% at 50% 120%, rgba(96,165,250,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .hlp-search-wrap {
          max-width: 560px;
          margin: 24px auto 0;
          position: relative;
        }
        .hlp-search-input {
          width: 100%;
          height: 50px;
          border-radius: 14px;
          border: none;
          padding: 0 50px 0 48px;
          font-size: 15px;
          color: #111827;
          background: #fff;
          outline: none;
          box-sizing: border-box;
          box-shadow: 0 4px 24px rgba(0,0,0,0.15);
        }
        .hlp-search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 19px;
          color: #9ca3af;
          pointer-events: none;
        }
        .hlp-search-clear {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          color: #9ca3af;
          line-height: 1;
          padding: 4px;
        }
        .hlp-search-clear:hover { color: #6b7280; }

        .hlp-cats {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 24px 16px 0;
          max-width: 900px;
          margin: 0 auto;
          justify-content: center;
          flex-wrap: wrap;
        }
        .hlp-cats::-webkit-scrollbar { display: none; }
        .hlp-cat-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 100px;
          border: 1.5px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.85);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all .15s;
        }
        .hlp-cat-btn:hover { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.45); }
        .hlp-cat-btn.active { background: #fff; color: #1d4ed8; border-color: #fff; }
        .hlp-cat-btn i { font-size: 15px; }

        .hlp-body { max-width: 960px; margin: 0 auto; padding: 36px 16px 64px; }

        /* Quick links */
        .hlp-links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 36px;
        }
        .hlp-link-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 18px 14px 16px;
          text-decoration: none;
          color: #111827;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          transition: all .15s;
        }
        .hlp-link-card:hover {
          border-color: #93c5fd;
          box-shadow: 0 2px 12px rgba(37,99,235,0.10);
          transform: translateY(-1px);
        }
        .hlp-link-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }
        .hlp-link-icon i { font-size: 19px; color: #2563eb; }
        .hlp-link-title { font-size: 13px; font-weight: 700; color: #111827; line-height: 1.3; }
        .hlp-link-desc  { font-size: 11px; color: #6b7280; line-height: 1.4; }

        /* Section header */
        .hlp-sec-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .hlp-sec-title { font-size: 17px; font-weight: 700; color: #111827; }
        .hlp-sec-count { font-size: 12px; color: #9ca3af; font-weight: 500; }

        /* FAQ accordion */
        .hlp-faq-list { border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; background: #fff; }
        .hlp-faq-item { border-bottom: 1px solid #f3f4f6; }
        .hlp-faq-item:last-child { border-bottom: none; }
        .hlp-faq-btn {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          transition: background .12s;
        }
        .hlp-faq-btn:hover { background: #f9fafb; }
        .hlp-faq-q {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          line-height: 1.45;
          flex: 1;
          text-align: left;
        }
        .hlp-faq-chevron {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all .2s;
        }
        .hlp-faq-chevron i { font-size: 14px; color: #6b7280; transition: transform .2s; }
        .hlp-faq-btn.open .hlp-faq-chevron { background: #eff6ff; }
        .hlp-faq-btn.open .hlp-faq-chevron i { color: #2563eb; transform: rotate(180deg); }
        .hlp-faq-body {
          padding: 0 20px 18px 20px;
          font-size: 14px;
          color: #4b5563;
          line-height: 1.65;
          border-top: 1px solid #f3f4f6;
        }
        .hlp-cat-tag {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: #eff6ff;
          color: #1d4ed8;
          border-radius: 100px;
          padding: 2px 8px;
          margin-right: 6px;
          vertical-align: middle;
        }

        /* Empty state */
        .hlp-empty {
          text-align: center;
          padding: 48px 24px;
        }
        .hlp-empty i { font-size: 40px; color: #d1d5db; }
        .hlp-empty-title { font-size: 16px; font-weight: 700; color: #374151; margin: 12px 0 6px; }
        .hlp-empty-sub { font-size: 14px; color: #9ca3af; }

        /* Contact section */
        .hlp-contact { margin-top: 48px; }
        .hlp-contact-head {
          text-align: center;
          margin-bottom: 20px;
        }
        .hlp-contact-title { font-size: 18px; font-weight: 700; color: #111827; }
        .hlp-contact-sub { font-size: 14px; color: #6b7280; margin-top: 4px; }
        .hlp-channels {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }
        .hlp-channel-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 20px 18px;
          text-decoration: none;
          color: #111827;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          transition: all .15s;
        }
        .hlp-channel-card:hover {
          border-color: #93c5fd;
          box-shadow: 0 2px 12px rgba(37,99,235,0.08);
        }
        .hlp-ch-icon {
          width: 42px; height: 42px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .hlp-ch-icon i { font-size: 22px; color: #fff; }
        .hlp-ch-label { font-size: 12px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
        .hlp-ch-value { font-size: 14px; font-weight: 700; color: #111827; margin: 2px 0; }
        .hlp-ch-note  { font-size: 12px; color: #6b7280; }

        /* Highlight match */
        .hlp-hl { background: #fef9c3; border-radius: 3px; padding: 0 2px; }

        @media (max-width: 480px) {
          .hlp-hero { padding: 36px 16px 48px; }
          .hlp-links-grid { grid-template-columns: repeat(2, 1fr); }
          .hlp-channels { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Hero ── */}
      <div className="hlp-hero">
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 8 }}>
          Support Center
        </p>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.2 }}>
          How can we help you?
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginTop: 10 }}>
          Search our knowledge base or browse by topic below.
        </p>

        {/* Search */}
        <form onSubmit={e => e.preventDefault()} className="hlp-search-wrap">
          <i className="ti ti-search hlp-search-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search for help…"
            className="hlp-search-input"
            autoComplete="off"
          />
          {query && (
            <button type="button" className="hlp-search-clear" onClick={clearSearch} aria-label="Clear search">
              <i className="ti ti-x" />
            </button>
          )}
        </form>

        {/* Category pills */}
        <div className="hlp-cats">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              className={`hlp-cat-btn${activeCat === cat.id ? ' active' : ''}`}
              onClick={() => handleCatChange(cat.id)}
            >
              <i className={`ti ${cat.icon}`} aria-hidden="true" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="hlp-body">

        {/* Quick links */}
        {filteredLinks.length > 0 && (
          <>
            <div className="hlp-sec-head" style={{ marginBottom: 12 }}>
              <span className="hlp-sec-title">Quick links</span>
            </div>
            <div className="hlp-links-grid">
              {filteredLinks.map(link => (
                <Link key={link.title} to={link.to} className="hlp-link-card">
                  <div className="hlp-link-icon">
                    <i className={`ti ${link.icon}`} aria-hidden="true" />
                  </div>
                  <span className="hlp-link-title">{link.title}</span>
                  <span className="hlp-link-desc">{link.desc}</span>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* FAQs */}
        {filteredFaqs.length > 0 ? (
          <>
            <div className="hlp-sec-head">
              <span className="hlp-sec-title">Frequently asked questions</span>
              <span className="hlp-sec-count">{filteredFaqs.length} {filteredFaqs.length === 1 ? 'result' : 'results'}</span>
            </div>

            <div className="hlp-faq-list">
              {filteredFaqs.map((faq, i) => (
                <div key={i} className="hlp-faq-item">
                  <button
                    type="button"
                    className={`hlp-faq-btn${openFaq === i ? ' open' : ''}`}
                    onClick={() => toggleFaq(i)}
                    aria-expanded={openFaq === i}
                  >
                    <span className="hlp-faq-q">
                      {activeCat === 'all' && !q && (
                        <span className="hlp-cat-tag">
                          {CATEGORIES.find(c => c.id === faq.cat)?.label}
                        </span>
                      )}
                      {faq.q}
                    </span>
                    <span className="hlp-faq-chevron" aria-hidden="true">
                      <i className="ti ti-chevron-down" />
                    </span>
                  </button>

                  {openFaq === i && (
                    <div className="hlp-faq-body">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : q ? (
          <div className="hlp-empty">
            <i className="ti ti-zoom-question" aria-hidden="true" />
            <p className="hlp-empty-title">No results for "{query}"</p>
            <p className="hlp-empty-sub">Try different keywords or browse a category above.</p>
            <button
              type="button"
              onClick={clearSearch}
              style={{ marginTop: 16, fontSize: 14, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Clear search
            </button>
          </div>
        ) : null}

        {/* Divider */}
        <div style={{ height: 1, background: '#f3f4f6', margin: '44px 0 0' }} />

        {/* Contact channels */}
        <div className="hlp-contact">
          <div className="hlp-contact-head">
            <p className="hlp-contact-title">Still need help?</p>
            <p className="hlp-contact-sub">Our support team is ready to assist you.</p>
          </div>
          <div className="hlp-channels">
            {CONTACT_CHANNELS.map(ch => (
              <a key={ch.label} href={ch.href} className="hlp-channel-card" target={ch.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                <div className="hlp-ch-icon" style={{ background: ch.color }}>
                  <i className={`ti ${ch.icon}`} aria-hidden="true" />
                </div>
                <div>
                  <p className="hlp-ch-label">{ch.label}</p>
                  <p className="hlp-ch-value">{ch.value}</p>
                  <p className="hlp-ch-note">{ch.note}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Satisfaction note */}
          <div style={{ marginTop: 28, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="ti ti-shield-check" style={{ fontSize: 22, color: '#16a34a', flexShrink: 0 }} aria-hidden="true" />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#15803d', margin: 0 }}>100% satisfaction guaranteed</p>
              <p style={{ fontSize: 12, color: '#4b5563', margin: '2px 0 0' }}>If you're not happy with your purchase, we'll make it right. No hassle, no fine print.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}