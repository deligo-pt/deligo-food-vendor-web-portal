// JoinVendorCTA.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function JoinVendorCTA() {
  return (
    <section className="relative py-20 px-6 sm:px-10 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-[#FF7EB3] to-[#DC3173] rounded-3xl p-10 md:p-16 text-center shadow-2xl overflow-hidden relative"
      >
        {/* Optional animated floating shapes */}
        <motion.div
          className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-pink-500/20 blur-3xl pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-purple-400/20 blur-3xl pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
        />

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl sm:text-5xl font-extrabold text-white mb-4"
        >
          Ready to grow your business?
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-white/90 text-lg sm:text-xl mb-8"
        >
          Takes less than 10 minutes to get started.
        </motion.p>

        {/* CTA Button */}
        <motion.a
          href="/onboarding"
          whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(255,126,179,0.45)" }}
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#DC3173] font-bold rounded-full text-lg shadow-md transition-all"
        >
          Become a Vendor <ArrowRight className="w-5 h-5" />
        </motion.a>
      </motion.div>
    </section>
  );
}
