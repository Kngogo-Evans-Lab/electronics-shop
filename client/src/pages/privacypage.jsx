// FILE: src/pages/PrivacyPage.jsx
import { Link } from 'react-router-dom'

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us, such as when you create an account, place an order, or contact our support team. This includes:
    
• Personal details: name, email address, phone number, and delivery address
• Payment information: processed securely through our payment partners (Stripe, M-Pesa, PayPal). We never store raw card details on our servers.
• Account activity: order history, wishlist, and browsing preferences
• Communications: messages you send us via contact forms or email`
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:

• Process and fulfill your orders, and send related updates
• Manage your account and provide customer support
• Send you promotional communications (only with your consent)
• Improve our website, products, and services
• Comply with legal obligations and prevent fraud`
  },
  {
    title: '3. Information Sharing',
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your data only with:

• Delivery partners (e.g. G4S, DHL Kenya) to fulfill your orders
• Payment processors to complete transactions securely
• Legal authorities when required by Kenyan law
• Service providers who assist our operations under strict confidentiality agreements`
  },
  {
    title: '4. Data Security',
    content: `We take the security of your data seriously. All data transmitted between your browser and our servers is encrypted using 256-bit SSL/TLS. Payment information is handled by PCI-DSS compliant processors. We conduct regular security audits and maintain strict internal access controls.`
  },
  {
    title: '5. Cookies',
    content: `Our website uses cookies to enhance your experience. Cookies help us remember your preferences, keep you logged in, and understand how you use our site. You can control cookie settings through your browser. Disabling cookies may affect some functionality of the website.`
  },
  {
    title: '6. Your Rights',
    content: `Under Kenyan data protection law (Data Protection Act, 2019), you have the right to:

• Access the personal data we hold about you
• Request correction of inaccurate data
• Request deletion of your data (subject to legal requirements)
• Opt out of marketing communications at any time
• Lodge a complaint with the Office of the Data Protection Commissioner

To exercise any of these rights, contact us at privacy@techstorekenya.co.ke`
  },
  {
    title: '7. Data Retention',
    content: `We retain your personal data for as long as your account is active or as needed to provide our services. Order data is retained for 7 years for tax and legal compliance. You may request account deletion at any time by contacting our support team.`
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a prominent notice on our website. Your continued use of TechStore after changes are posted constitutes your acceptance of the updated policy.`
  },
]

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-16 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Privacy Policy</h1>
        <p className="text-blue-100 text-base">Last updated: January 1, 2026</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8">
          <p className="text-sm text-blue-800 leading-relaxed">
            <strong>TechStore Kenya Ltd</strong> ("we", "us", or "our") is committed to protecting your privacy.
            This policy explains how we collect, use, and safeguard your personal information when you use our website
            and services. Please read it carefully.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map(s => (
            <div key={s.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-900 mb-3">{s.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center space-y-3">
          <p className="text-sm text-gray-500">Questions about our privacy practices?</p>
          <Link to="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}