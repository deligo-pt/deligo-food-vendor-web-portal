"use client";

import { motion } from "framer-motion";
import { Rocket, Users, Trophy, Calendar } from "lucide-react";
import { useState } from "react";
import Tilt from "react-parallax-tilt";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}

const features: Feature[] = [
  {
    icon: <Rocket className="w-6 h-6 text-white" />,
    title: "Fast Promotion Setup",
    description: "Launch your deals in under 5 minutes without any hassle.",
    bgColor: "bg-gradient-to-r from-[#FF7EB3] to-[#DC3173]",
  },
  {
    icon: <Users className="w-6 h-6 text-white" />,
    title: "Reach More Customers",
    description: "Connect instantly with thousands of customers across Portugal.",
    bgColor: "bg-gradient-to-r from-[#7E9BFF] to-[#31DCFF]",
  },
  {
    icon: <Trophy className="w-6 h-6 text-white" />,
    title: "Track Campaign Performance",
    description: "Monitor orders and engagement in real-time for better insights.",
    bgColor: "bg-gradient-to-r from-[#FFD47E] to-[#FFB231]",
  },
  {
    icon: <Calendar className="w-6 h-6 text-white" />,
    title: "Weekly Payouts",
    description: "Receive revenue securely and on time, every week.",
    bgColor: "bg-gradient-to-r from-[#83CD20] to-[#3DAF12]",
  },
];

// Placeholder promotions for live preview & animated progress bars
const promotions = [
  { title: "Lisbon Weekend Sale", discount: "20%", performance: 65 },
  { title: "Porto Grocery Deal", discount: "15%", performance: 45 },
  { title: "Bakery Specials", discount: "30%", performance: 80 },
];

export default function PromotionsPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="min-h-screen bg-gray-900 py-20 px-6 sm:px-10 lg:px-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4">
          Launch Promotions in Minutes & Grow Your Sales
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl">
          Create, publish, and track your promotions instantly without any hassle.
        </p>
        <motion.a
          whileHover={{ scale: 1.05 }}
          href="/vendor/signup"
          className="inline-block mt-8 px-10 py-4 bg-gradient-to-r from-[#FF7EB3] to-[#DC3173] text-white font-bold rounded-full shadow-lg transition-all"
        >
          Start a Promotion
        </motion.a>
      </motion.div>

      {/* Features / Benefits with 3D Tilt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
  {features.map((feature, idx) => (
    <Tilt
      key={idx}
      glareEnable={true}
      glareMaxOpacity={0.2}
      scale={1.02}
      transitionSpeed={400}
    >
      <motion.div
        className={`p-6 rounded-3xl flex flex-col items-center text-center cursor-pointer shadow-2xl ${feature.bgColor} bg-opacity-90`}
        whileHover={{ y: -8, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <div className="mb-4">{feature.icon}</div>
        <h3 className="text-xl sm:text-lg font-bold text-white mb-2 drop-shadow-lg">
          {feature.title}
        </h3>
        <p className="text-white/95 text-sm sm:text-base drop-shadow">
          {feature.description}
        </p>
      </motion.div>
    </Tilt>
  ))}
</div>

      {/* Live Preview Promotions with Animated Progress Bars */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto mb-20"
      >
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center">
          Live Preview of Promotions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo, idx) => (
            <motion.div
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="bg-gray-800 rounded-3xl p-6 shadow-2xl cursor-pointer transition-all hover:shadow-3xl"
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="text-white font-bold text-lg mb-2">{promo.title}</h3>
              <p className="text-gray-300 mb-4">Discount: {promo.discount}</p>

              {/* Animated Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: hoveredIndex === idx ? `${promo.performance}%` : "0%" }}
                  transition={{ duration: 1.2 }}
                  className="h-3 bg-gradient-to-r from-[#FF7EB3] to-[#DC3173]"
                ></motion.div>
              </div>
              <p className="text-gray-400 text-sm mt-2">{promo.performance}% of target reached</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="text-4xl font-extrabold text-white mb-4">
          Ready to Launch Your First Promotion?
        </h2>
        <p className="text-gray-300 mb-6">
          Fast, easy, and effective – get started in minutes and grow your sales.
        </p>
        <motion.a
          whileHover={{ scale: 1.05 }}
          href="/vendor/signup"
          className="inline-block px-10 py-4 bg-gradient-to-r from-[#FF7EB3] to-[#DC3173] text-white font-bold rounded-full shadow-xl transition-all"
        >
          Start Now
        </motion.a>
      </motion.div>
    </section>
  );
}
