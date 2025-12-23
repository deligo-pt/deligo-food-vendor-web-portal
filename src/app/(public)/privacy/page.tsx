// PrivacyPolicySection.tsx
"use client";

import { Mail, Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/src/hooks/use-translation";

export default function PrivacyPolicySection() {
  const { t } = useTranslation();

  return (
    <section className="bg-linear-to-b from-[#FFE7F0] to-[#FFF5F8] py-24 px-6 sm:px-10 lg:px-20">
      {/* Header */}
      <motion.div
        className="max-w-4xl mx-auto text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          {t("privacyHeading")}
        </h1>
        <p className="text-gray-700 text-lg">
          {t("privacyDesc")}
        </p>
      </motion.div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto grid gap-12">
        {/* Section 1 */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-[#DC3173] mb-4">{t("privacyInformationHeading")}</h2>
          <p className="text-gray-700 leading-relaxed">
            {t("privacyInformationDesc")}
          </p>
        </motion.div>

        {/* Section 2 */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-[#DC3173] mb-4">{t("privacyWeUseInfoHeading")}</h2>
          <ul className="text-gray-700 list-disc list-inside space-y-2">
            <li>{t("privacyWeUseInfoList1")}</li>
            <li>{t("privacyWeUseInfoList2")}</li>
            <li>{t("privacyWeUseInfoList3")}</li>
            <li>{t("privacyWeUseInfoList4")}</li>
            <li>{t("privacyWeUseInfoList5")}</li>
          </ul>
        </motion.div>

        {/* Section 3 */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-[#DC3173] mb-4">{t("privacyCookiesHeading")}</h2>
          <p className="text-gray-700 leading-relaxed">
            {t("privacyCookiesDesc")}
          </p>
        </motion.div>

        {/* Section 4 */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-[#DC3173] mb-4">{t("")}</h2>
          <p className="text-gray-700 leading-relaxed">
            {t("")}
          </p>
          <ul className="text-gray-700 list-disc list-inside space-y-2 mt-2">
            <li>{t("privacyRightsList1")}</li>
            <li>{t("privacyRightsList2")}</li>
            <li>{t("privacyRightsList3")}</li>
            <li>{t("privacyRightsList4")}</li>
          </ul>
        </motion.div>

        {/* Section 5 */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-[#DC3173] mb-4">{t("privacyPaymentsHeading")}</h2>
          <p className="text-gray-700 leading-relaxed">
            {t("privacyPaymentsDesc")}
          </p>
        </motion.div>

        {/* Section 6 */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-[#DC3173] mb-4">{t("privacyDeliveryHeading")}</h2>
          <p className="text-gray-700 leading-relaxed">
            {t("privacyDeliveryDesc")}
          </p>
        </motion.div>

        {/* Section 7 */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-[#DC3173] mb-4">{t("")}</h2>
          <p className="text-gray-700 leading-relaxed">
            {t("")}
          </p>
        </motion.div>
      </div>

      {/* Contact Support */}
      <motion.div
        className="bg-[#DC3173]/10 rounded-3xl p-12 mt-16 text-center max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t("privacyContactHeading")}
        </h2>
        <p className="text-gray-700 mb-8">
          {t("privacyContactDesc")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Email */}
          <div className="flex items-center gap-4 bg-white rounded-2xl p-6 hover:shadow-lg transition cursor-pointer w-full min-w-0">
            <Mail className="w-6 h-6 text-[#DC3173] flex-shrink-0" />
            <div className="text-left break-words min-w-0">
              <p className="text-gray-500 text-sm">Email</p>
              <a
                href="mailto:support@deligo.pt"
                className="text-gray-900 font-semibold hover:text-[#FF7EB3] transition break-words min-w-0"
              >
                support@deligo.pt
              </a>
            </div>
          </div>



          {/* WhatsApp */}
          <div className="flex items-center gap-4 bg-white rounded-2xl p-6 hover:shadow-lg transition cursor-pointer">
            <Phone className="w-6 h-6 text-[#DC3173]" />
            <div className="text-left">
              <p className="text-gray-500 text-sm">WhatsApp</p>
              <a href="https://wa.me/YOUR_NUMBER" target="_blank" className="text-gray-900 font-semibold hover:text-[#FF7EB3] transition">
                {t("privacyChatNow")}
              </a>
            </div>
          </div>

          {/* Live Chat */}
          <div className="flex items-center gap-4 bg-white rounded-2xl p-6 hover:shadow-lg transition cursor-pointer">
            <MessageCircle className="w-6 h-6 text-[#DC3173]" />
            <div className="text-left">
              <p className="text-gray-500 text-sm">{t("privacyLiveChat")}</p>
              <a href="/live-chat" className="text-gray-900 font-semibold hover:text-[#FF7EB3] transition">
                {t("privacyStartChat")}
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
