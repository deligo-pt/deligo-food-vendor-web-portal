"use client";

import { useTranslation } from "@/src/hooks/use-translation";
import { motion } from "framer-motion";
import { Cookie, Shield, Info, AlertCircle, Settings, Lock, PieChart } from "lucide-react";

export default function CookiesPolicy() {
  const { t } = useTranslation();

  const sections = [
    {
      icon: <Cookie className="w-6 h-6 text-[#DC3173]" />,
      title: t("cookieSecTitle1"),
      content: t("cookieSecDesc1")
    },
    {
      icon: <Shield className="w-6 h-6 text-[#DC3173]" />,
      title: t("cookieSecTitle2"),
      content: t("cookieSecDesc2")
    },
    {
      icon: <Settings className="w-6 h-6 text-[#DC3173]" />,
      title: t("cookieSecTitle3"),
      content: t("cookieSecDesc3")
    },
    {
      icon: <PieChart className="w-6 h-6 text-[#DC3173]" />,
      title: t("cookieSecTitle4"),
      content: t("cookieSecDesc4")
    },
    {
      icon: <Lock className="w-6 h-6 text-[#DC3173]" />,
      title: t("cookieSecTitle5"),
      content: t("cookieSecDesc5")
    },
    {
      icon: <Info className="w-6 h-6 text-[#DC3173]" />,
      title: t("cookieSecTitle6"),
      content: t("cookieSecDesc6")
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-[#DC3173]" />,
      title: t("cookieSecTitle7"),
      content: t("cookieSecDesc7")
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
          {t("cookieHeading")}
        </h1>
        <p className="text-gray-700 mb-16 text-center text-lg">
          {t("cookieDesc")}
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
            {t("cookieCTATitle")}
          </p>
          <a
            href="mailto:support@deligo.pt"
            className="inline-block px-10 py-4 bg-linear-to-r from-[#FF7EB3] to-[#DC3173] text-white font-bold rounded-full text-lg hover:scale-105 hover:shadow-lg transition"
          >
            {t("cookieCTA")}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
