"use client";

import { useTranslation } from "@/src/hooks/use-translation";
import { motion } from "framer-motion";
import {
  Boxes,
  Edit3,
  Upload,
  CheckCircle,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";

export default function ManageProductsInfoPage() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: <Upload className="w-8 h-8 text-pink-500" />,
      title: t("productStepTitle1"),
      description: t("productStepDesc1"),
    },
    {
      icon: <Edit3 className="w-8 h-8 text-purple-500" />,
      title: t("productStepTitle2"),
      description: t("productStepDesc2"),
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-indigo-500" />,
      title: t("productStepTitle3"),
      description: t("productStepDesc3"),
    },
    {
      icon: <Settings className="w-8 h-8 text-blue-500" />,
      title: t("productStepTitle4"),
      description: t("productStepDesc4"),
    },
  ];

  return (
    <section className="bg-linear-to-br from-gray-900 via-[#1a1a1a] to-black min-h-screen text-white py-20 px-6 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-linear-to-r from-pink-500 via-purple-500 to-indigo-400">
            {t("manageProductsHeading")}
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            {t("manageProductsDesc")}.
          </p>
        </motion.div>

        {/* FEATURES / STEPS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-24">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="p-8 bg-gray-800/60 rounded-3xl shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-2 text-center"
            >
              <div className="flex justify-center mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* DEMO PREVIEW / MOCKUP */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-linear-to-r from-purple-700/20 via-pink-600/20 to-indigo-700/20 rounded-3xl p-10 shadow-inner text-center border border-white/10"
        >
          <Boxes className="w-14 h-14 text-pink-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-3">
            {t("productMockupHeading")}
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            {t("productMockupDesc")}
          </p>

        </motion.div>

        {/* FUTURE BENEFITS */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-extrabold text-pink-400">
              {t("")}
            </h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
                <span>{t("productBenefitTitle1")}</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
                <span>{t("productBenefitTitle2")}</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
                <span>{t("productBenefitTitle3")}</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center"
          >
            <Sparkles className="w-56 h-56 text-pink-500/40 animate-pulse" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
