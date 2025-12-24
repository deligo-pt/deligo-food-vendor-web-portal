// TermsConditions.tsx
"use client";

import { useTranslation } from "@/src/hooks/use-translation";
import { motion } from "framer-motion";
import { ClipboardX, Shield, CreditCard, UserCheck, AlertCircle } from "lucide-react";

export default function TermsConditions() {
  const { t } = useTranslation();

  const sections = [
    {
      icon: <ClipboardX className="w-6 h-6 text-[#DC3173]" />,
      title: t("termsSectionTitle1"),
      content: t("termsSectionDesc1")
    },
    {
      icon: <Shield className="w-6 h-6 text-[#DC3173]" />,
      title: t("termsSectionTitle2"),
      content: t("termsSectionDesc2")
    },
    {
      icon: <CreditCard className="w-6 h-6 text-[#DC3173]" />,
      title: t("termsSectionTitle3"),
      content: t("termsSectionDesc3")
    },
    {
      icon: <UserCheck className="w-6 h-6 text-[#DC3173]" />,
      title: t("termsSectionTitle4"),
      content: t("termsSectionDesc4")
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-[#DC3173]" />,
      title: t("termsSectionTitle5"),
      content: t("termsSectionDesc5")
    },
    {
      icon: <ClipboardX className="w-6 h-6 text-[#DC3173]" />,
      title: t("termsSectionTitle6"),
      content: t("termsSectionDesc6")
    },
    {
      icon: <Shield className="w-6 h-6 text-[#DC3173]" />,
      title: t("termsSectionTitle7"),
      content: t("termsSectionDesc7")
    },
    {
      icon: <CreditCard className="w-6 h-6 text-[#DC3173]" />,
      title: t("termsSectionTitle8"),
      content: t("termsSectionDesc8")
    }
  ];

  return (
    <section className="py-20 px-6 sm:px-10 lg:px-20 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-5xl font-extrabold text-gray-900 mb-8 text-center">
          {t("termsHeading")}
        </h1>
        <p className="text-gray-700 mb-12 text-center text-lg">
          {t("termsDesc")}
        </p>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-4 hover:shadow-2xl transition cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {section.icon}
                <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: sections.length * 0.1 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-700 mb-4 text-lg">
            {t("termsCTAHeading")}
          </p>
          <a
            href="/vendor-signup"
            className="inline-block px-8 py-4 bg-linear-to-r from-[#FF7EB3] to-[#DC3173] text-white font-bold rounded-full text-lg hover:scale-105 hover:shadow-lg transition"
          >
            {t("termsCTA")}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}