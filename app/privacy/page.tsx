// PrivacyPolicySection.tsx
"use client";

import { Mail, Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPolicySection() {
  return (
    <section className="bg-gradient-to-b from-[#FFE7F0] to-[#FFF5F8] py-24 px-6 sm:px-10 lg:px-20">
      {/* Header */}
      <motion.div
        className="max-w-4xl mx-auto text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-700 text-lg">
          At deliGo, we prioritize your privacy. This policy explains how we collect, use, and protect your information while offering fast commerce and delivery services across Portugal.
        </p>
      </motion.div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto grid gap-12">
        {/* Section 1 */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-[#DC3173] mb-4">Information We Collect</h2>
          <p className="text-gray-700 leading-relaxed">
            We collect personal information you provide when signing up, such as name, email, phone number, address, payment details, and business information if you are a vendor. We may also collect data automatically through cookies and usage analytics.
          </p>
        </motion.div>

        {/* Section 2 */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-[#DC3173] mb-4">How We Use Your Information</h2>
          <ul className="text-gray-700 list-disc list-inside space-y-2">
            <li>Provide and improve deliGo services across Portugal.</li>
            <li>Process orders and payments securely for customers and vendors.</li>
            <li>Send promotional offers and service updates if consent is given.</li>
            <li>Ensure compliance with Portuguese legal and financial regulations.</li>
            <li>Analyze usage trends to optimize delivery routes and vendor performance.</li>
          </ul>
        </motion.div>

        {/* Section 3 */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-[#DC3173] mb-4">Cookies & Tracking</h2>
          <p className="text-gray-700 leading-relaxed">
            We use cookies and similar technologies to enhance your browsing experience, remember your preferences, track orders, and deliver personalized promotions. You can manage cookies via your browser settings.
          </p>
        </motion.div>

        {/* Section 4 */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-[#DC3173] mb-4">Your Rights under GDPR</h2>
          <p className="text-gray-700 leading-relaxed">
            Being based in the EU, deliGo ensures all user and vendor rights under GDPR:
          </p>
          <ul className="text-gray-700 list-disc list-inside space-y-2 mt-2">
            <li>Right to access, correct, or delete your personal data.</li>
            <li>Right to withdraw consent to marketing communications.</li>
            <li>Right to object to data processing for profiling or analytics.</li>
            <li>Right to data portability between service providers.</li>
          </ul>
        </motion.div>

        {/* Section 5 */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-[#DC3173] mb-4">Payments & Financial Data</h2>
          <p className="text-gray-700 leading-relaxed">
            All payment information is processed through secure gateways like Stripe and PayPal. We never store full card details. Transactions are encrypted and comply with PCI DSS standards.
          </p>
        </motion.div>

        {/* Section 6 */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-[#DC3173] mb-4">Delivery & Location Data</h2>
          <p className="text-gray-700 leading-relaxed">
            We collect delivery addresses and location data to ensure accurate, timely deliveries. Location data is used solely for operational purposes and never shared with third parties without consent.
          </p>
        </motion.div>

        {/* Section 7 */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-[#DC3173] mb-4">Data Security Measures</h2>
          <p className="text-gray-700 leading-relaxed">
            We use state-of-the-art security measures including encryption, secure servers, firewalls, and regular audits. Access to personal data is limited to authorized employees and vendors.
          </p>
        </motion.div>
      </div>

      {/* Contact Support */}
      <motion.div
        className="bg-[#DC3173]/10 rounded-3xl p-12 mt-16 text-center max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Questions about your data?
        </h2>
        <p className="text-gray-700 mb-8">
          Our Portugal-based support team is ready to assist vendors and customers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Email */}
          <div className="flex items-center gap-4 bg-white rounded-2xl p-6 hover:shadow-lg transition cursor-pointer w-full min-w-0">
  <Mail className="w-6 h-6 text-[#DC3173] flex-shrink-0" />
  <div className="text-left break-words min-w-0">
    <p className="text-gray-500 text-sm">Email</p>
    <a
      href="mailto:support@deligo.pt"
      className="text-gray-900 font-semibold hover:text-[#FF7EB3] transition break-words min-w-0"
    >
      support@deligo.pt
    </a>
  </div>
</div>



          {/* WhatsApp */}
          <div className="flex items-center gap-4 bg-white rounded-2xl p-6 hover:shadow-lg transition cursor-pointer">
            <Phone className="w-6 h-6 text-[#DC3173]" />
            <div className="text-left">
              <p className="text-gray-500 text-sm">WhatsApp</p>
              <a href="https://wa.me/YOUR_NUMBER" target="_blank" className="text-gray-900 font-semibold hover:text-[#FF7EB3] transition">
                Chat Now
              </a>
            </div>
          </div>

          {/* Live Chat */}
          <div className="flex items-center gap-4 bg-white rounded-2xl p-6 hover:shadow-lg transition cursor-pointer">
            <MessageCircle className="w-6 h-6 text-[#DC3173]" />
            <div className="text-left">
              <p className="text-gray-500 text-sm">Live Chat</p>
              <a href="/live-chat" className="text-gray-900 font-semibold hover:text-[#FF7EB3] transition">
                Start Chat
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
