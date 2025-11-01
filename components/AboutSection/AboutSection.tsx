"use client";

import { motion } from "framer-motion";
import { Leaf, Store, Utensils } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-b from-[#0A0F1F] via-[#111B2E] to-[#0A0F1F]">
      {/* Animated background glows */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#DC3173]/30 blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#FF6F61]/30 blur-[150px] animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#DC3173] to-[#FF6F61] mb-10"
        >
          About the Platform
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-lg sm:text-xl text-white/95 leading-relaxed max-w-3xl mx-auto mb-12"
        >
          Our mission is to empower local Portuguese restaurants, grocery shops,
          and small businesses by helping them reach thousands of customers
          every day. We’re building a sustainable ecosystem that values{" "}
          <span className="text-[#FF6F61] font-semibold">local sourcing</span>,
          supports{" "}
          <span className="text-[#DC3173] font-semibold">
            eco-friendly packaging
          </span>
          , and promotes{" "}
          <span className="text-[#FFCC33] font-semibold">growth with impact</span>.
        </motion.p>

        {/* Features icons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-16"
        >
          {[
            {
              icon: <Utensils className="w-12 h-12 text-[#FF6F61]" />,
              title: "Support Local Restaurants",
            },
            {
              icon: <Store className="w-12 h-12 text-[#DC3173]" />,
              title: "Empower Grocery Shops",
            },
            {
              icon: <Leaf className="w-12 h-12 text-[#43CEA2]" />,
              title: "Go Eco-Friendly",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.07, rotate: 1 }}
              className="flex flex-col items-center justify-center text-center bg-[#151F35]/80 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(255,111,97,0.5)] transition-all duration-500"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA or infographic placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <div className="rounded-3xl border border-white/10 bg-gradient-to-tr from-[#FF6F61]/10 to-[#DC3173]/10 p-6 shadow-[0_0_30px_rgba(220,49,115,0.3)] hover:shadow-[0_0_50px_rgba(220,49,115,0.6)] transition-all duration-700">
            <h4 className="text-2xl font-semibold text-white mb-3">
              We’re More Than a Delivery Platform
            </h4>
            <p className="text-white/90 text-base max-w-2xl mx-auto">
              Join a community-driven marketplace built on trust, technology,
              and transparency — designed for growth, powered by Portugal’s
              spirit.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
