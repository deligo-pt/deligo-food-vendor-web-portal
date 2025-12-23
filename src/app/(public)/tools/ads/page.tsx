"use client";

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Megaphone, Users, Globe, BarChart2 } from "lucide-react";
import { useTranslation } from "@/src/hooks/use-translation";

interface AdFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}

export default function AdsPage() {
  const { t } = useTranslation();

  const addFeatures: AdFeature[] = [
    {
      icon: <Megaphone className="w-10 h-10 text-white" />,
      title: t("adsFeatureTitle1"),
      description: t("adsFeatureDesc1"),
      bgColor: "bg-linear-to-tr from-[#4B6CB7] to-[#182848]",
    },
    {
      icon: <Users className="w-10 h-10 text-white" />,
      title: t("adsFeatureTitle2"),
      description: t("adsFeatureDesc2"),
      bgColor: "bg-linear-to-tr from-[#6A11CB] to-[#2575FC]",
    },
    {
      icon: <Globe className="w-10 h-10 text-white" />,
      title: t("adsFeatureTitle3"),
      description: t("adsFeatureDesc3"),
      bgColor: "bg-linear-to-tr from-[#00c6ff] to-[#0072ff]",
    },
    {
      icon: <BarChart2 className="w-10 h-10 text-white" />,
      title: t("adsFeatureTitle4"),
      description: t("adsFeatureDesc4"),
      bgColor: "bg-linear-to-tr from-[#ff512f] to-[#dd2476]",
    },
  ];

  return (
    <section className="py-24 px-6 sm:px-10 lg:px-20 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.h1
          className="text-5xl sm:text-6xl font-extrabold text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {t("adsHeading")}
        </motion.h1>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-20">
          {addFeatures.map((ad, idx) => (
            <Tilt
              key={idx}
              glareEnable={true}
              glareMaxOpacity={0.15}
              scale={1.05}
              transitionSpeed={400}
            >
              <motion.div
                className={`p-6 rounded-3xl flex flex-col items-center text-center shadow-2xl ${ad.bgColor} cursor-pointer`}
                whileHover={{ y: -10, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 120 }}
              >
                <div className="mb-5">{ad.icon}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 drop-shadow-lg">
                  {ad.title}
                </h3>
                <p className="text-white/90 text-sm sm:text-base drop-shadow">
                  {ad.description}
                </p>
              </motion.div>
            </Tilt>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="p-6 bg-linear-to-r from-[#182848] to-[#4B6CB7] rounded-3xl shadow-xl">
            <h2 className="text-3xl font-extrabold text-white">500K+</h2>
            <p className="text-white/90 mt-2">{t("adsImpressions")}</p>
          </div>
          <div className="p-6 bg-linear-to-r from-[#2575FC] to-[#6A11CB] rounded-3xl shadow-xl">
            <h2 className="text-3xl font-extrabold text-white">120K+</h2>
            <p className="text-white/90 mt-2">{t("adsClicks")}</p>
          </div>
          <div className="p-6 bg-linear-to-r from-[#00c6ff] to-[#0072ff] rounded-3xl shadow-xl">
            <h2 className="text-3xl font-extrabold text-white">35K+</h2>
            <p className="text-white/90 mt-2">{t("adsLeads")}</p>
          </div>
          <div className="p-6 bg-linear-to-r from-[#ff512f] to-[#dd2476] rounded-3xl shadow-xl">
            <h2 className="text-3xl font-extrabold text-white">100+</h2>
            <p className="text-white/90 mt-2">{t("adsActiveCampaigns")}</p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="bg-linear-to-r from-[#182848] to-[#6A11CB] rounded-3xl p-16 text-center shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-lg">
            {t('adsCTAHeading')}
          </h2>
          <p className="text-white/90 mb-6">
            {t("adsCTADesc")}
          </p>
          <button className="py-4 px-10 rounded-full bg-white text-[#6A11CB] font-bold text-lg hover:scale-105 hover:shadow-xl transition">
            {t("adsCTA")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
