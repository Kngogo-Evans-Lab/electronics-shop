// FILE: src/pages/PrivacyPage.jsx
import { Link } from "react-router-dom";
import {
  Database,
  Eye,
  UserCheck,
  Lock,
  Cookie,
  ShieldCheck,
  RefreshCw,
  FileText,
} from "lucide-react";

const sections = [
  {
    icon: Database,
    title: "1. Information We Collect",
    content:
      "We collect personal information you provide when using our platform, including your name, email, phone number, and delivery address. We also collect order history, account activity, and communication records. Payment data is processed securely by third-party providers and is never stored in raw form on our systems.",
  },
  {
    icon: Eye,
    title: "2. How We Use Your Information",
    content:
      "We use your data to process orders, manage accounts, provide customer support, improve platform performance, and prevent fraud. We may also send order updates and promotional messages where permitted.",
  },
  {
    icon: UserCheck,
    title: "3. Information Sharing",
    content:
      "We do not sell or rent your personal data. Data is shared only with logistics providers for delivery, payment processors for transactions, and legal authorities when required by law. All partners are bound by confidentiality agreements.",
  },
  {
    icon: Lock,
    title: "4. Data Security",
    content:
      "We use SSL encryption, secure servers, and restricted access systems to protect your data. Payment processing is handled by PCI-DSS compliant providers. We continuously monitor for security risks.",
  },
  {
    icon: Cookie,
    title: "5. Cookies",
    content:
      "Cookies are used to maintain sessions, remember preferences, and analyze usage patterns. You may disable cookies in your browser settings, but some features may not function properly.",
  },
  {
    icon: ShieldCheck,
    title: "6. Your Rights",
    content:
      "You have the right to access, correct, or delete your data. You may also opt out of marketing communications at any time, subject to legal requirements.",
  },
  {
    icon: Database,
    title: "7. Data Retention",
    content:
      "We retain data only as long as necessary for service delivery and legal compliance. Order records may be stored for tax and audit purposes. You may request deletion of your account.",
  },
  {
    icon: RefreshCw,
    title: "8. Policy Updates",
    content:
      "We may update this policy from time to time. Changes will be posted on this page. Continued use of the platform means acceptance of the updated policy.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen text-gray-900">

      {/* HEADER */}
      <div className="relative py-12 text-center overflow-hidden border-b border-gray-200">

        {/* Indigo Tech Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-800"></div>

        {/* Grid Overlay */}
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
              PRIVACY POLICY
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
          <span className="font-semibold text-gray-900">Vantix Shop254</span>{" "}
          is committed to protecting your privacy and ensuring transparency in
          how your data is collected and used.
        </p>

        {/* SECTIONS */}
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
        <div className="text-center mt-10">
          <p className="text-[11px] text-gray-500 mb-3">
            Need help with privacy or data concerns?
          </p>

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
        </div>
      </div>
    </div>
  );
}