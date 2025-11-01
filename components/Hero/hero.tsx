"use client"
import { motion, Transition, Variants } from 'framer-motion';
import Link from 'next/link';

// Custom spring transition for realistic motion
const springTransition: Transition = {
  type: 'spring',
  stiffness: 120,
  damping: 12,
};

// Staggered motion variants for floating elements
const floatingVariants: Variants = {
  initial: { opacity: 0, y: 50, scale: 0.8, rotate: -10 },
  animate: (customDelay: number = 0) => ({
    opacity: 1,
    y: [50, -30, 20, 0],
    x: [-30, 30, -15, 0],
    scale: [0.8, 1.1, 0.9, 1],
    rotate: [-10, 15, -5, 0],
    transition: {
      delay: customDelay,
      duration: 8,
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1],
    },
  }),
};

export default function HeroSectionNextLevel() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#1B1B2F] via-[#2D1B3F] to-[#DC3173]">
      {/* Dynamic Particles / Growth Icons */}
      <motion.div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-2 h-2 bg-[#F1FAEE] rounded-sm animate-bounce-slow"></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-[#F1FAEE] rounded-sm animate-bounce-slow"></div>
        <div className="absolute bottom-20 left-1/3 w-4 h-4 bg-[#F1FAEE] rounded-sm animate-bounce-slow"></div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 h-full flex flex-col justify-center items-start">
        <motion.h1
          initial={{ opacity: 0, y: 120, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ ...springTransition, duration: 1.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#F1FAEE] drop-shadow-xl"
        >
          Join Portugal’s Fastest Growing Food & Grocery Delivery Platform
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.5, duration: 1 }}
          className="mt-6 text-lg sm:text-xl text-[#F1FAEE] max-w-2xl drop-shadow-md"
        >
          Start selling online in just a few minutes. Manage everything from one dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...springTransition, delay: 1, duration: 0.8 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <Link href="/become-vendor" className="px-6 py-3 bg-[#DC3173] text-white font-semibold rounded-lg shadow-2xl hover:bg-[#a72b5c] transition-all duration-300 transform hover:scale-105 hover:shadow-3xl">
            Become a Vendor
          </Link>
          <a href="#about" className="px-6 py-3 bg-[#F1FAEE] text-[#DC3173] font-semibold rounded-lg shadow-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-3xl">
            Learn More
          </a>
        </motion.div>
      </div>

      {/* Next-Level Floating Elements */}
      <motion.div className="absolute w-24 h-24 bg-[#F1FAEE] rounded-lg top-1/3 left-1/4 shadow-3xl" custom={0} variants={floatingVariants} initial="initial" animate="animate" />
      <motion.div className="absolute w-20 h-20 bg-[#F1FAEE] rounded-lg top-2/3 right-1/3 shadow-3xl" custom={0.5} variants={floatingVariants} initial="initial" animate="animate" />
      <motion.div className="absolute w-16 h-16 bg-[#F1FAEE] rounded-lg top-1/2 left-1/2 shadow-3xl" custom={1} variants={floatingVariants} initial="initial" animate="animate" />

      {/* Scroll Down Indicator */}
      <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-[#F1FAEE] rounded-full flex items-start justify-center p-1">
          <div className="w-2 h-2 bg-[#F1FAEE] rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}