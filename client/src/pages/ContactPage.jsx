// ContactPage.jsx
// EmailJS is fully configured — messages sent to: ekangogo14@gmail.com

import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID  = "service_5c3195z";
const EMAILJS_TEMPLATE_ID = "template_rs87af1";
const EMAILJS_PUBLIC_KEY  = "FdaCVPl7-diKFto-v";

const WHATSAPP_NUMBER = "254722116713";
const INBOX_EMAIL     = "ekangogo14@gmail.com";

export default function ContactPage() {
  const formRef = useRef();
  const [status, setStatus] = useState("idle");
  const [subject, setSubject] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );

      setStatus("success");
      formRef.current.reset();
      setSubject("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* HERO (Product/Shopping Focus + Dim Overlay) */}
      <div
        className="relative h-[280px] flex items-center justify-center text-center px-4"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1600&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-3xl text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Contact Support
          </h1>
          <p className="text-gray-200 text-sm md:text-base">
            Get help with orders, products, payments, or delivery anytime.
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-10 grid md:grid-cols-2 gap-10">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          <div>
            <h2 className="text-xl font-bold mb-2">Customer Support</h2>
            <p className="text-gray-600 text-sm leading-7">
              We respond quickly to all inquiries related to orders, product
              availability, delivery tracking, and refunds. You can also reach
              us directly via WhatsApp for faster assistance.
            </p>
          </div>

          <div className="text-sm text-gray-700 space-y-3">
            <p><span className="font-semibold">Email:</span> {INBOX_EMAIL}</p>
            <p><span className="font-semibold">Phone:</span> +254 722 116 713</p>
            <p><span className="font-semibold">Working Hours:</span> 8am – 8pm (Daily)</p>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Vantix%20Support,%20I%20need%20help`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center w-full py-3 rounded-lg font-semibold text-white
            bg-green-500 hover:bg-green-600
            shadow-[0_0_18px_rgba(34,197,94,0.6)]
            transition"
          >
            Chat on WhatsApp
          </a>

        </div>

        {/* RIGHT SIDE (FORM) */}
        <div>

          <h2 className="text-xl font-bold mb-4">Send a Message</h2>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">

            <input type="hidden" name="to_email" value={INBOX_EMAIL} />

            <input
              name="from_name"
              required
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black"
            />

            <input
              name="reply_to"
              type="email"
              required
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black"
            />

            <select
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black"
            >
              <option value="">Select Subject</option>
              <option>Order Inquiry</option>
              <option>Product Question</option>
              <option>Delivery Issue</option>
              <option>Refund Request</option>
              <option>Other</option>
            </select>

            <textarea
              name="message"
              rows={6}
              required
              placeholder="Write your message..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black"
            />

            {/* CTA BUTTON (GLOW ORANGE - PREMIUM ECOMMERCE STYLE) */}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-3 rounded-lg font-bold text-white
              bg-gradient-to-r from-orange-500 to-red-500
              hover:from-orange-600 hover:to-red-600
              shadow-[0_0_22px_rgba(249,115,22,0.7)]
              hover:shadow-[0_0_30px_rgba(239,68,68,0.8)]
              transition"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>

            {status === "success" && (
              <p className="text-green-600 text-sm">
                Message sent successfully. We will respond shortly.
              </p>
            )}

            {status === "error" && (
              <p className="text-red-600 text-sm">
                Failed to send message. Please try WhatsApp instead.
              </p>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}