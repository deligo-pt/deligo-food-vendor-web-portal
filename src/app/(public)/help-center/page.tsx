"use client";

import { useState } from "react";
import { ChevronDown, Mail, Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Getting Started",
    description:
      "Learn how to quickly set up your vendor account, verify documents, and start selling on Deligo.",
  },
  {
    title: "Orders & Payments",
    description:
      "Manage incoming orders, track delivery, and receive payouts securely via SEPA.",
  },
  {
    title: "Promotions & Marketing",
    description:
      "Discover how to create promotions, boost your sales, and reach more customers.",
  },
  {
    title: "Account Management",
    description:
      "Update your profile, manage multiple locations, and adjust your menu or products.",
  },
];

const faqs = [
  {
    question: "What documents are required to become a vendor?",
    answer:
      "To join Deligo as a vendor, you need a valid business license, proof of address, and a bank account. If you are a restaurant, a food license is also required.",
  },
  {
    question: "How long does approval take?",
    answer:
      "Approval usually takes 1-3 business days after submission of required documents. You will receive email confirmation once your account is approved.",
  },
  {
    question: "When will I receive payments?",
    answer:
      "Payments are processed daily for completed orders and reflected in your bank account within 24 hours.",
  },
  {
    question: "Can I manage multiple locations?",
    answer:
      "Yes! Deligo allows you to manage multiple business locations from a single dashboard. Add or remove locations anytime.",
  },
  {
    question: "How can I promote my products?",
    answer:
      "Use our Promotions feature to create discounts, bundles, or special deals. You can track performance with real-time analytics.",
  },
  {
    question: "What support is available?",
    answer:
      "Our support team is available 24/7 via WhatsApp, Email, and Live Chat to help you with any issue.",
  },
];

export default function HelpCenterPage() {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const toggleFAQ = (idx: number) => setActiveFAQ(activeFAQ === idx ? null : idx);

  return (
    <div className="bg-gray-50 px-6 sm:px-10 lg:px-20 py-20 space-y-28">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto space-y-4"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold text-[#DC3173]">
          Help Center
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl">
          Everything you need to know to sell on Deligo successfully. Guides, tips, and detailed support at your fingertips.
        </p>
      </motion.div>

      {/* Category Guides */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {categories.map((cat, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition flex flex-col items-center text-center space-y-4 cursor-pointer"
          >
            <div className="text-[#DC3173] text-4xl">📌</div>
            <h3 className="font-bold text-gray-900 text-lg">{cat.title}</h3>
            <p className="text-gray-600 text-sm">{cat.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* FAQ Section */}
      <div className="space-y-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition hover:shadow-2xl">
              <div
                className="flex justify-between items-center"
                onClick={() => toggleFAQ(idx)}
              >
                <h3 className="text-gray-900 font-medium text-lg">{faq.question}</h3>
                <ChevronDown
                  className={`w-6 h-6 text-pink-400 transition-transform ${activeFAQ === idx ? "rotate-180" : ""}`}
                />
              </div>
              {activeFAQ === idx && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-gray-600"
                >
                  {faq.answer}
                </motion.p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Vendor Tips Section */}
      <motion.div
        className="max-w-5xl mx-auto space-y-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Vendor Tips & Best Practices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition cursor-pointer">
            <h3 className="font-bold text-gray-900 mb-2">Optimize Your Menu</h3>
            <p className="text-gray-600 text-sm">
              High-quality photos, accurate pricing, and clear descriptions increase orders.
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition cursor-pointer">
            <h3 className="font-bold text-gray-900 mb-2">Fast Order Processing</h3>
            <p className="text-gray-600 text-sm">
              Accept or auto-confirm orders quickly to maintain high customer satisfaction.
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition cursor-pointer">
            <h3 className="font-bold text-gray-900 mb-2">Leverage Promotions</h3>
            <p className="text-gray-600 text-sm">
              Use discounts, bundles, and promotions to boost sales during peak hours.
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition cursor-pointer">
            <h3 className="font-bold text-gray-900 mb-2">Monitor Analytics</h3>
            <p className="text-gray-600 text-sm">
              Track your daily orders, top-selling items, and customer feedback to improve.
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition cursor-pointer">
            <h3 className="font-bold text-gray-900 mb-2">Maintain Customer Support</h3>
            <p className="text-gray-600 text-sm">
              Respond promptly to customer inquiries via live chat, email, or phone.
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition cursor-pointer">
            <h3 className="font-bold text-gray-900 mb-2">Eco-Friendly Practices</h3>
            <p className="text-gray-600 text-sm">
              Use sustainable packaging and source products locally to attract conscious customers.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Contact Support */}
     <motion.div
  className="bg-gradient-to-r from-[#FF7EB3]/20 to-[#DC3173]/20 rounded-3xl p-10 text-center space-y-6 max-w-5xl mx-auto shadow-xl"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
>
  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
    Still have questions?
  </h2>
  <p className="text-gray-700 text-lg sm:text-xl">
    Reach out to our vendor support team via your preferred channel.
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
    {/* Email */}
    <div className="flex items-center gap-4 bg-gray-900/80 rounded-2xl p-6 hover:bg-gradient-to-r hover:from-[#FF7EB3]/40 hover:to-[#DC3173]/40 transition-transform transform hover:-translate-y-2 shadow-lg cursor-pointer">
      <Mail className="w-7 h-7 text-pink-400 animate-pulse" />
      <div className="text-left">
        <p className="text-gray-300 font-medium text-sm">Email</p>
        <a
          href="mailto:support@deligo.com"
          className="text-white font-semibold text-base hover:text-white/90 transition"
        >
          support@deligo.pt
        </a>
      </div>
    </div>

    {/* WhatsApp */}
    <div className="flex items-center gap-4 bg-gray-900/80 rounded-2xl p-6 hover:bg-gradient-to-r hover:from-[#FF7EB3]/40 hover:to-[#DC3173]/40 transition-transform transform hover:-translate-y-2 shadow-lg cursor-pointer">
      <Phone className="w-7 h-7 text-pink-400 animate-bounce" />
      <div className="text-left">
        <p className="text-gray-300 font-medium text-sm">WhatsApp</p>
        <a
          href="https://wa.me/YOUR_NUMBER"
          target="_blank"
          className="text-white font-semibold text-base hover:text-white/90 transition"
        >
          Chat Now
        </a>
      </div>
    </div>

    {/* Live Chat */}
    <div className="flex items-center gap-4 bg-gray-900/80 rounded-2xl p-6 hover:bg-gradient-to-r hover:from-[#FF7EB3]/40 hover:to-[#DC3173]/40 transition-transform transform hover:-translate-y-2 shadow-lg cursor-pointer">
      <MessageCircle className="w-7 h-7 text-pink-400 animate-pulse" />
      <div className="text-left">
        <p className="text-gray-300 font-medium text-sm">Live Chat</p>
        <a
          href="/live-chat"
          className="text-white font-semibold text-base hover:text-white/90 transition"
        >
          Start Chat
        </a>
      </div>
    </div>
  </div>
</motion.div>

    </div>
  );
}
