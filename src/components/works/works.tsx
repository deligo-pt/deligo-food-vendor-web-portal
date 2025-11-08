"use client"
import { motion } from 'framer-motion';
import { UserPlus, Package, ShoppingCart, CreditCard } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Register Your Business',
    desc: 'Create your account & verify your details.',
    color: 'from-[#DC3173] to-[#FF6F61]',
  },
  {
    icon: Package,
    title: 'Add Menu / Products',
    desc: 'Upload images, set prices, manage stock.',
    color: 'from-[#FF6F61] to-[#FF9980]',
  },
  {
    icon: ShoppingCart,
    title: 'Start Receiving Orders',
    desc: 'Accept or auto-confirm incoming orders.',
    color: 'from-[#FFCC33] to-[#FFD966]',
  },
  {
    icon: CreditCard,
    title: 'Get Paid Weekly',
    desc: 'Secure SEPA payouts to your bank.',
    color: 'from-[#43CEA2] to-[#185A9D]',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-b from-[#0A0F1F] via-[#111B2E] to-[#0A0F1F]">
      {/* Floating Glows */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-20 w-72 h-72 bg-[#DC3173]/20 blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-20 w-72 h-72 bg-[#FF6F61]/20 blur-[150px] animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl font-extrabold text-center text-white mb-16 tracking-tight"
        >
          How It Works
        </motion.h2>

        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-6 relative">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="relative group flex flex-col items-center text-center p-8 rounded-2xl bg-[#151F35]/70 backdrop-blur-md border border-white/10 shadow-xl hover:shadow-[#DC3173]/40 hover:scale-[1.05] transition-all duration-500"
              >
                <div className={`flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr ${step.color} shadow-lg mb-5 group-hover:rotate-6 transition-transform`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{step.desc}</p>

                {/* Animated Dot Connector */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-[-3rem] w-24 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-20 flex justify-center">
          <motion.a
            href="/signup"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            className="relative px-10 py-4 text-lg font-semibold rounded-full text-white bg-gradient-to-tr from-[#DC3173] to-[#FF6F61] shadow-[0_0_25px_rgba(220,49,115,0.4)] hover:shadow-[0_0_40px_rgba(220,49,115,0.7)] transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Start Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6F61] to-[#DC3173] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
