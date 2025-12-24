"use client";

import { useTranslation } from "@/src/hooks/use-translation";
import { motion } from "framer-motion";
import {
  Bike,
  ShoppingBag,
  Truck,
  Clock,
  HeartHandshake,
  Globe,
  Store,
} from "lucide-react";

export default function AboutUsPage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Truck className="w-10 h-10 text-green-400" />,
      title: t("aboutFeatureTitle1"),
      desc: t("aboutFeatureDesc1"),
    },
    {
      icon: <HeartHandshake className="w-10 h-10 text-blue-400" />,
      title: t("aboutFeatureTitle2"),
      desc: t("aboutFeatureDesc2"),
    },
    {
      icon: <Clock className="w-10 h-10 text-yellow-400" />,
      title: t("aboutFeatureTitle3"),
      desc: t("aboutFeatureDesc3"),
    },
    {
      icon: <ShoppingBag className="w-10 h-10 text-pink-400" />,
      title: t("aboutFeatureTitle4"),
      desc: t("aboutFeatureDesc4"),
    },
    {
      icon: <Bike className="w-10 h-10 text-purple-400" />,
      title: t("aboutFeatureTitle5"),
      desc: t("aboutFeatureDesc5"),
    },
    {
      icon: <Store className="w-10 h-10 text-orange-400" />,
      title: t("aboutFeatureTitle6"),
      desc: t("aboutFeatureDesc6"),
    },
  ]

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-950 via-black to-gray-950 text-white">
      {/* HERO SECTION */}
      <section className="relative text-center px-6 py-24 overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl sm:text-6xl font-extrabold bg-linear-to-r from-green-400 via-teal-400 to-blue-500 bg-clip-text text-transparent"
        >
          {t("about")} <span className="text-white">{t("deligoGroup")}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto mt-6 text-gray-300 text-lg leading-relaxed"
        >
          {t("aboutDesc")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-green-600/10 rounded-full blur-3xl"
        />
      </section>

      {/* OUR STORY */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-green-400">
              {t("aboutDeligoGroup")}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {t("weAre")} <span className="text-white font-semibold">{t("deligo")}</span> {t("aboutDesc2")} <span className="text-white font-semibold">{t("deligoRide")}</span>{t("ourRideSharing")}{" "}
              <span className="text-white font-semibold">{t("deligoDelivery")}</span>{t("ourFoodGrocery")}
            </p>
            <p className="text-gray-400 mt-4">
              {t("ourMission")}
            </p>
          </motion.div>

          <motion.img
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            src="/deligoDelivery.jpeg"
            alt="Delivery Illustration"
            className="rounded-3xl shadow-2xl"
          />
        </div>
      </section>

      {/* OUR CORE VALUES */}
      <section className="py-20 bg-linear-to-b from-black to-gray-950 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-10 text-teal-400"
          >
            {t("deligoRideSmarter")}
          </motion.h2>

          <p className="max-w-3xl mx-auto text-gray-300 text-lg leading-relaxed mb-10">
            {t("deligoSmarterDesc")}
            <br />
            <br />
            {t("deligoSmarterDesc2")}
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-8 bg-gray-900/70 rounded-3xl shadow-lg hover:shadow-green-500/20 transition-all"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR VISION */}
      <section className="py-24 px-6 bg-linear-to-b from-gray-950 via-gray-900 to-black">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.img
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            src="/deligoabout.jpeg"
            alt="Future of Delivery"
            className="rounded-3xl shadow-2xl order-2 md:order-1"
          />
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-1 md:order-2"
          >
            <h2 className="text-4xl font-bold mb-4 text-green-400">
              {t("ourVisionHeading")}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {t("ourVisionDesc")}
            </p>
            <p className="text-gray-400 mt-4">
              {t("ourVisionDesc2")}
            </p>
            <ul className="text-gray-300 mt-4 space-y-2">
              <li>{t("visionList1")}</li>
              <li>{t("visionList2")}</li>
              <li>{t("visionList3")}</li>
              <li>{t("visionList4")}</li>
              <li>{t("visionList5")}</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* GLOBAL IMPACT */}
      <section className="py-20 text-center px-6 bg-black/80">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-green-400 mb-6"
        >
          {t("deligoElectronics")}
        </motion.h2>
        <p className="max-w-3xl mx-auto text-gray-300 text-lg mb-8">
          {t("deligoElectronicsDesc")}
        </p>
        <p className="max-w-3xl mx-auto text-gray-400 text-lg mb-8">
          {t("deligoElectronicsDesc2")}
        </p>
        <ul className="max-w-3xl mx-auto text-gray-300 text-lg space-y-2 mb-8 text-left sm:text-center">
          <li>{t("electronicsList1")}</li>
          <li>{t("electronicsList2")}</li>
          <li>{t("electronicsList3")}</li>
          <li>{t("electronicsList4")}</li>
          <li>{t("electronicsList5")}</li>
        </ul>
        <p className="max-w-3xl mx-auto text-gray-300 text-lg mb-8">
          {t("deligoElectronicsDesc3")}
        </p>
      </section>

      {/* OUR PROMISE */}
      <section className="py-20 text-center px-6 bg-black/90">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-green-400 mb-6"
        >
          {t("ourPromise")}
        </motion.h2>
        <p className="max-w-3xl mx-auto text-gray-300 text-lg mb-4">
          {t("ourPromiseDesc")}
        </p>
        <p className="max-w-3xl mx-auto text-gray-300 text-lg mb-8">
          {t("ourPromiseDes2")}
        </p>
        <Globe className="w-20 h-20 mx-auto text-green-400 animate-spin-slow" />
      </section>
    </div>
  );
}
