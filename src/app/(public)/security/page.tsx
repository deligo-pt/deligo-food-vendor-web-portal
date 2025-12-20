// SecurityPage.tsx
"use client";

import { Shield, Lock, Key, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function SecurityPage() {
  const vendorFeatures = [
    {
      icon: <Shield className="w-10 h-10 text-pink-400" />,
      title: "Data Encryption",
      description:
        "All vendor data is secured with advanced encryption methods to prevent unauthorized access.",
    },
    {
      icon: <Lock className="w-10 h-10 text-pink-400" />,
      title: "Two-Factor Authentication",
      description:
        "Protect your account with 2FA and login alerts for complete account security.",
    },
    {
      icon: <Key className="w-10 h-10 text-pink-400" />,
      title: "Fraud Monitoring",
      description:
        "Automatic detection of suspicious activity to protect your business and earnings.",
    },
  ];

  const customerFeatures = [
    {
      icon: <UserCheck className="w-10 h-10 text-blue-400" />,
      title: "Safe Payments",
      description:
        "Secure checkout with PCI-compliant payment processing and instant verification.",
    },
    {
      icon: <Lock className="w-10 h-10 text-blue-400" />,
      title: "Privacy Protection",
      description:
        "Your personal information is encrypted and handled in full compliance with GDPR.",
    },
    {
      icon: <Shield className="w-10 h-10 text-blue-400" />,
      title: "Trusted Platform",
      description:
        "Deligo ensures a safe environment for all transactions and interactions.",
    },
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#FF7EB3]/40 to-[#DC3173]/40 overflow-hidden py-32 px-6 text-center">
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold text-white mb-6"
        >
          Your Data & Business Are Safe with Deligo
        </motion.h1>
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto"
        >
          Advanced security measures for vendors and customers across Portugal.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-[#FF7EB3] to-[#DC3173] font-bold text-lg"
        >
          Contact Security Team
        </motion.button>

        {/* Animated floating icons */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="absolute top-10 left-10 animate-bounce-slow opacity-30"
        >
          <Shield className="w-20 h-20 text-white/20" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="absolute bottom-10 right-10 animate-bounce-slow opacity-30"
        >
          <Lock className="w-24 h-24 text-white/20" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-12">
          Security Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Vendor Features */}
          <div>
            <h3 className="text-2xl font-bold text-pink-400 mb-6 text-center md:text-left">
              Vendor Protection
            </h3>
            <div className="space-y-6">
              {vendorFeatures.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  className="bg-gray-800 p-6 rounded-3xl flex items-start gap-4 hover:shadow-xl transition cursor-pointer"
                >
                  {feature.icon}
                  <div>
                    <h4 className="text-lg font-bold">{feature.title}</h4>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Customer Features */}
          <div>
            <h3 className="text-2xl font-bold text-blue-400 mb-6 text-center md:text-left">
              Customer Security
            </h3>
            <div className="space-y-6">
              {customerFeatures.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  className="bg-gray-800 p-6 rounded-3xl flex items-start gap-4 hover:shadow-xl transition cursor-pointer"
                >
                  {feature.icon}
                  <div>
                    <h4 className="text-lg font-bold">{feature.title}</h4>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#FF7EB3]/20 to-[#DC3173]/20 text-center rounded-3xl mx-6 md:mx-20 my-12">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-extrabold mb-6"
        >
          Stay Secure with Deligo
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-300 mb-8"
        >
          Our team continuously monitors and upgrades security measures to protect you and your business.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FF7EB3] to-[#DC3173] font-bold text-lg"
        >
          Contact Security Team
        </motion.button>
      </section>
    </div>
  );
}
