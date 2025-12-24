"use client";
import { useTranslation } from "@/src/hooks/use-translation";
import { motion } from "framer-motion";
import { Briefcase, Users, Rocket, HeartHandshake, Star } from "lucide-react";

export default function CareersPage() {
  const { t } = useTranslation();

  const values = [
    {
      icon: <Users className="w-10 h-10 text-[#DC3173]" />,
      title: t("valuesTitle1"),
      description: t("valuesDesc1"),
    },
    {
      icon: <Rocket className="w-10 h-10 text-[#DC3173]" />,
      title: t("valuesTitle2"),
      description: t("valuesDesc2"),
    },
    {
      icon: <HeartHandshake className="w-10 h-10 text-[#DC3173]" />,
      title: t("valuesTitle3"),
      description: t("valuesDesc3"),
    },
    {
      icon: <Star className="w-10 h-10 text-[#DC3173]" />,
      title: t("valuesTitle3"),
      description: t("valuesDesc3"),
    },
  ];

  const features = [
    {
      title: t("careersFeatureTitle1"),
      desc: t("careersFeatureDesc1")
    },
    {
      title: t("careersFeatureTitle2"),
      desc: t("careersFeatureDesc2")
    },
    {
      title: t("careersFeatureTitle3"),
      desc: t("careersFeatureDesc3")
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-[#DC3173] to-[#9b1c54] text-white py-24 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold mb-6"
        >
          {t("careersHeader")} <span className="text-yellow-300">{t("careersHeaderDeligo")}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-100"
        >
          {t("careersDesc")}
        </motion.p>
      </section>

      {/* About Working at Deligo */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t("whyWork")}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {t("whyWorkDesc")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((val, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl hover:-translate-y-2 transition-all"
            >
              <div className="mb-4 flex justify-center">{val.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{val.title}</h3>
              <p className="text-gray-600">{val.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Life at Deligo */}
      <section className="bg-linear-to-r from-gray-900 to-gray-800 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            {t("lifeAtDeligo")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-gray-300 text-lg mb-12"
          >
            {t("lifeAtDeligoDesc")}
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.4 }}
                viewport={{ once: true }}
                className="bg-gray-800 rounded-xl p-6 hover:bg-[#DC3173]/20 transition-all"
              >
                <Briefcase className="w-8 h-8 text-[#DC3173] mb-3 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-20 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
        >
          {t("careersCTAHeading")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-gray-600 max-w-3xl mx-auto mb-8"
        >
          {t("careersCTADesc")}
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-[#DC3173] text-white font-semibold rounded-full shadow-md hover:bg-[#b92561] transition"
        >
          {t("careersCTA")}
        </motion.button>
      </section>
    </div>
  );
}
