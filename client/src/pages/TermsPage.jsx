// FILE: src/pages/TermsPage.jsx
import { Link } from "react-router-dom";
import {
  FileText,
  UserCheck,
  Tag,
  CreditCard,
  Truck,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Edit3,
} from "lucide-react";

const sections = [
  {
    icon: UserCheck,
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using the Vantix Shop254 platform, you agree to be bound by these Terms of Service and all applicable laws. If you do not agree, you may not use the platform. These terms apply to all users, visitors, and customers.",
  },
  {
    icon: UserCheck,
    title: "2. Account Registration",
    content:
      "You are required to provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials and all activity under your account. We reserve the right to suspend accounts involved in fraud or misuse.",
  },
  {
    icon: Tag,
    title: "3. Products and Pricing",
    content:
      "We strive for accuracy in product descriptions and pricing. However, prices may change without notice. We reserve the right to correct errors, limit quantities, or cancel orders in case of pricing mistakes. Product images are illustrative and may differ slightly from actual items.",
  },
  {
    icon: CreditCard,
    title: "4. Orders and Payment",
    content:
      "By placing an order, you confirm that you are legally capable of making purchases. Payments are authorized at checkout, but order acceptance occurs only upon dispatch. We reserve the right to refuse or cancel orders suspected of fraud or unauthorized activity.",
  },
  {
    icon: Truck,
    title: "5. Delivery",
    content:
      "Delivery timelines are estimates and may vary based on location and logistics conditions. We are not responsible for delays caused by third-party courier services or external disruptions. Risk transfers to the customer upon successful delivery.",
  },
  {
    icon: RefreshCw,
    title: "6. Returns and Refunds",
    content:
      "Eligible returns include defective products, incorrect items, or unopened goods in original packaging. Items must be returned in original condition. Refunds are processed within 5–10 business days after inspection. Used or damaged items may not qualify for a refund.",
  },
  {
    icon: ShieldCheck,
    title: "7. Intellectual Property",
    content:
      "All content including text, images, logos, and software is owned by Vantix Shop254 and protected by intellectual property laws. Unauthorized reproduction, modification, or distribution is strictly prohibited.",
  },
  {
    icon: AlertTriangle,
    title: "8. Limitation of Liability",
    content:
      "To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from use of our platform, including loss of data, profits, or business interruption.",
  },
  {
    icon: Scale,
    title: "9. Governing Law",
    content:
      "These Terms are governed by the laws of the Republic of Kenya. Any disputes shall be resolved under the jurisdiction of courts in Nairobi, Kenya.",
  },
  {
    icon: Edit3,
    title: "10. Changes to Terms",
    content:
      "We may update these Terms at any time. Updates will be posted on this page. Continued use of the platform after changes means acceptance of the revised Terms.",
  },
];

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen text-gray-900">

      {/* HEADER */}
      <div className="relative py-12 text-center overflow-hidden border-b border-gray-200">

        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-800"></div>

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-widest uppercase">
              TERMS OF SERVICE
            </h1>
          </div>

          <p className="text-[11px] text-indigo-200">
            Last updated: 1 January 2026
          </p>
        </div>
      </div>

      {/* INTRO */}
      <div className="max-w-4xl mx-auto px-5 md:px-10 py-8">
        <p className="text-sm text-gray-600 leading-7 mb-6">
          <span className="font-semibold text-gray-900">
            Vantix Shop254
          </span>{" "}
          provides access to products and services under the following terms
          and conditions. Please read carefully before using the platform.
        </p>

        {/* CONTENT */}
        <div className="divide-y divide-gray-200 border-y border-gray-200">
          {sections.map((s) => {
            const Icon = s.icon;

            return (
              <div key={s.title} className="py-5 flex gap-3">

                <Icon className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />

                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-1">
                    {s.title}
                  </h2>

                  <p className="text-sm text-gray-600 leading-7">
                    {s.content}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-10 space-y-3">

          <p className="text-[11px] text-gray-500">
            Need clarification on terms or policies?
          </p>

          <div className="flex justify-center gap-3">
            <Link
              to="/contact"
              className="
                inline-flex items-center justify-center
                px-5 py-2
                text-xs font-medium text-gray-800
                bg-gray-100 hover:bg-gray-200
                border border-gray-300
                rounded-md
                shadow-[0_3px_10px_rgba(0,0,0,0.10)]
                active:translate-y-[1px]
                transition
              "
            >
              Contact Support
            </Link>

            <Link
              to="/help"
              className="
                inline-flex items-center justify-center
                px-5 py-2
                text-xs font-medium text-gray-700
                bg-white hover:bg-gray-50
                border border-gray-300
                rounded-md
                transition
              "
            >
              Help Center
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}