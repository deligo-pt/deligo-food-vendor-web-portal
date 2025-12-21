// PricingCommissionInteractive.tsx
"use client";

import CountUp from "react-countup";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/src/hooks/use-translation";


export default function PricingCommissionInteractive() {
  const { t } = useTranslation();

  const stats = [
    { label: t('pricingStatLabel1'), value: 15000, prefix: "€", suffix: "+" },
    { label: t('pricingStatLabel2'), value: 3000, suffix: "+" },
    { label: t('pricingStatLabel3'), value: 10000, suffix: "+" },
    { label: t('pricingStatLabel4'), value: 50, suffix: "+" },
  ];

  return (
    <section
      className="relative py-20 px-6 sm:px-10 lg:px-20 bg-linear-to-tr from-purple-50 via-purple-100 to-white overflow-hidden"
      aria-labelledby="pricing-section"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT: Info & Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2
            id="pricing-section"
            className="text-4xl sm:text-5xl font-extrabold text-gray-900"
          >
            {t('pricingTitle')}
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl">
            {t('pricingDesc')}
          </p>

          {/* Interactive Glass Table */}
          <div className="rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg p-6 sm:p-8">
            <table className="w-full text-left text-gray-900">
              <tbody>
                {[
                  { label: t('glassTableLabel1'), value: t('glassTableValue1') },
                  { label: t('glassTableLabel2'), value: t('glassTableValue2') },
                  { label: t('glassTableLabel3'), value: t('glassTableValue3') },
                ].map((item, idx) => (
                  <motion.tr
                    key={idx}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,126,179,0.1)" }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-white/20 cursor-pointer"
                  >
                    <td className="py-4 font-semibold">{item.label}</td>
                    <td className="py-4 font-bold bg-clip-text text-transparent bg-linear-to-r from-[#FF7EB3] to-[#DC3173]">
                      {item.value}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Note */}
          <p className="text-gray-600 text-sm">
            <strong>{t('noteHeading')}:</strong> {t('noteDesc')}
          </p>

          {/* CTA */}
          <motion.a
            href="#"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(220,49,115,0.35)" }}
            className="inline-flex items-center gap-2 mt-4 px-5 py-3 bg-linear-to-tr from-[#FF7EB3] to-[#DC3173] text-white font-semibold rounded-full shadow-md transition"
          >
            {t('term_policyCTA')} <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
        <div className="relative w-full max-w-md mx-auto lg:mx-0">
          <div className="relative bg-linear-to-tr from-[#1F1F2E] via-[#2A2A3D] to-[#1F1F2E] rounded-3xl p-6 h-[440px] flex flex-col justify-between shadow-2xl overflow-hidden">
            {/* Floating abstract shapes */}
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

            {/* Counters */}
            <div className="space-y-6 z-10">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, duration: 0.8 }}
                  className="text-center cursor-default"
                >
                  <h3 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-[#FF7EB3] to-[#DC3173] transition-transform hover:scale-105">
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={2}
                      separator=","
                      prefix={stat.prefix ? stat.prefix : ""}
                      suffix={stat.suffix ? stat.suffix : ""}
                    />
                  </h3>
                  <p className="text-gray-300 font-medium tracking-wide">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Animated Bar Chart */}
            <div className="mt-6 flex justify-between gap-3 items-end h-36 z-10">
              {[1, 2, 3, 4, 5].map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${20 + i * 15}%` }}
                  transition={{ delay: i * 0.2, duration: 0.8, ease: "easeOut" }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 6px 20px rgba(220,49,115,0.4)",
                    backgroundImage:
                      "linear-linear(to top, #FF7EB3, #DC3173, #FFB3D2)",
                  }}
                  className="flex-1 bg-linear-to-t from-[#FF7EB3] to-[#DC3173] rounded-xl cursor-pointer"
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
