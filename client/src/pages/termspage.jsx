// FILE: src/pages/TermsPage.jsx
import { Link } from 'react-router-dom'

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using the TechStore Kenya website (techstorekenya.co.ke), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site. These terms apply to all visitors, users, and customers.`
  },
  {
    title: '2. Account Registration',
    content: `To place orders, you must create an account with accurate and complete information. You are responsible for:

• Maintaining the confidentiality of your account password
• All activities that occur under your account
• Notifying us immediately of any unauthorized use of your account

We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.`
  },
  {
    title: '3. Products and Pricing',
    content: `We strive to display accurate product information and pricing. However:

• Prices are subject to change without notice
• We reserve the right to limit quantities and cancel orders in case of pricing errors
• Product images are for illustration purposes and may vary slightly from actual items
• All prices are displayed in USD unless otherwise stated. M-Pesa payments are converted at the prevailing exchange rate.`
  },
  {
    title: '4. Orders and Payment',
    content: `When you place an order:

• You confirm that you are at least 18 years old or have parental consent
• You authorize us to charge the selected payment method
• An order confirmation email does not constitute acceptance — acceptance occurs when the item is dispatched
• We reserve the right to refuse or cancel any order for any reason including suspected fraud`
  },
  {
    title: '5. Delivery',
    content: `Delivery timelines are estimates and not guaranteed. TechStore Kenya is not liable for delays caused by third-party courier services, natural disasters, or other events beyond our control. Risk of loss and title for purchased items passes to you upon delivery.`
  },
  {
    title: '6. Returns and Refunds',
    content: `Our 30-day return policy allows returns for:

• Defective or damaged products
• Items significantly different from their description
• Unopened products in original packaging

Products must be returned in their original condition. Refunds are processed within 5–10 business days after the return is received and inspected. Items showing signs of use, physical damage caused by the customer, or missing accessories may not qualify for a full refund.`
  },
  {
    title: '7. Intellectual Property',
    content: `All content on this website — including text, images, logos, graphics, and software — is the property of TechStore Kenya Ltd and protected by Kenyan and international copyright laws. You may not reproduce, distribute, or create derivative works without our written permission.`
  },
  {
    title: '8. Limitation of Liability',
    content: `To the maximum extent permitted by law, TechStore Kenya shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or services, including but not limited to loss of data, loss of profits, or business interruption.`
  },
  {
    title: '9. Governing Law',
    content: `These Terms are governed by the laws of the Republic of Kenya. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Nairobi, Kenya.`
  },
  {
    title: '10. Changes to Terms',
    content: `We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated date. Your continued use of the website after changes are posted constitutes your acceptance of the new terms.`
  },
]

export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-16 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Terms of Service</h1>
        <p className="text-blue-100 text-base">Last updated: January 1, 2026</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-8">
          <p className="text-sm text-yellow-800 leading-relaxed">
            <strong>Please read these terms carefully.</strong> By using TechStore Kenya's website and services,
            you agree to be legally bound by the following terms and conditions.
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

        <div className="mt-10 bg-gray-100 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-600 mb-4">Have questions about our terms?</p>
          <div className="flex gap-3 justify-center">
            <Link to="/contact" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition">
              Contact Us
            </Link>
            <Link to="/help" className="bg-white hover:bg-gray-50 text-gray-700 font-bold px-6 py-3 rounded-xl text-sm border border-gray-200 transition">
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}