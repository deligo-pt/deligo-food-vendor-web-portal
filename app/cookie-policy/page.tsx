"use client";

import { motion } from "framer-motion";
import { Cookie, Shield, Info, AlertCircle, Settings, Lock, PieChart } from "lucide-react";

export default function CookiesPolicy() {
  const sections = [
    {
      icon: <Cookie className="w-6 h-6 text-[#DC3173]" />,
      title: "Introduction",
      content: `At Deligo, we value your privacy and transparency. This Cookies Policy explains how we collect, store, and use cookies and similar technologies when you visit our platform in Portugal.`
    },
    {
      icon: <Shield className="w-6 h-6 text-[#DC3173]" />,
      title: "What Are Cookies?",
      content: `Cookies are small text files stored on your device to enhance your experience, remember preferences, track performance, and provide personalized content. They help us serve you faster and more efficiently.`
    },
    {
      icon: <Settings className="w-6 h-6 text-[#DC3173]" />,
      title: "Types of Cookies We Use",
      content: `1. **Essential Cookies:** Necessary for basic platform functionality, including login, order processing, and cart management.  
2. **Performance & Analytics Cookies:** Monitor user behavior to improve our platform’s performance.  
3. **Functional Cookies:** Remember your preferences such as language, theme, and location.  
4. **Marketing & Advertising Cookies:** Used for promotions, personalized campaigns, and third-party analytics.`
    },
    {
      icon: <PieChart className="w-6 h-6 text-[#DC3173]" />,
      title: "Cookie Duration & Management",
      content: `Cookies may be session-based (deleted after you leave the site) or persistent (stored until expiration). You can control cookies via your browser settings. Please note that disabling certain cookies may affect your platform experience.`
    },
    {
      icon: <Lock className="w-6 h-6 text-[#DC3173]" />,
      title: "Third-Party Cookies",
      content: `Deligo uses trusted third-party services for analytics and marketing, which may set their own cookies. These cookies are subject to the third-party's privacy policies. Examples include Google Analytics, Facebook Ads, and payment gateways.`
    },
    {
      icon: <Info className="w-6 h-6 text-[#DC3173]" />,
      title: "Your Consent",
      content: `By using Deligo, you consent to our use of cookies as described in this policy. You can withdraw consent anytime through your browser settings, but some features may be impacted.`
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-[#DC3173]" />,
      title: "Updates to This Policy",
      content: `We may update this Cookies Policy occasionally. Updates will be notified on the platform. Always check this page for the latest information regarding cookie usage.`
    },
  ];

  return (
    <section className="py-24 px-6 sm:px-10 lg:px-20 bg-gray-50">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 text-center">
          Cookies Policy
        </h1>
        <p className="text-gray-700 mb-16 text-center text-lg">
          Learn how Deligo collects and uses cookies to provide a fast, secure, and personalized experience for our users in Portugal.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-4 hover:shadow-2xl hover:scale-105 transition cursor-pointer border border-gray-200"
            >
              <div className="flex items-center gap-4">
                {section.icon}
                <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: sections.length * 0.1 }}
          className="mt-20 text-center"
        >
          <p className="text-gray-700 mb-6 text-lg">
            Need further assistance or have questions about cookies?
          </p>
          <a
            href="mailto:support@deligo.pt"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[#FF7EB3] to-[#DC3173] text-white font-bold rounded-full text-lg hover:scale-105 hover:shadow-lg transition"
          >
            Contact Support
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
