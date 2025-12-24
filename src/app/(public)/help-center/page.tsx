"use client";

import { useState } from "react";
import { ChevronDown, Mail, Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/src/hooks/use-translation";


export default function HelpCenterPage() {
  const { t } = useTranslation();
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const toggleFAQ = (idx: number) => setActiveFAQ(activeFAQ === idx ? null : idx);


  const categories = [
    {
      title: t("categoriesTitle1"),
      description: t("categoriesDesc1"),
    },
    {
      title: t("categoriesTitle2"),
      description: t("categoriesDesc2"),
    },
    {
      title: t("categoriesTitle3"),
      description: t("categoriesDesc3"),
    },
    {
      title: t("categoriesTitle4"),
      description: t("categoriesDesc4"),
    },
  ];

  const faqs = [
    {
      question: t("helpFaqQues1"),
      answer: t("helpFaqAns1"),
    },
    {
      question: t("helpFaqQues2"),
      answer: t("helpFaqAns2"),
    },
    {
      question: t("helpFaqQues3"),
      answer: t("helpFaqAns3"),
    },
    {
      question: t("helpFaqQues4"),
      answer: t("helpFaqAns4"),
    },
    {
      question: t("helpFaqQues5"),
      answer: t("helpFaqAns5"),
    },
    {
      question: t("helpFaqQues6"),
      answer: t("helpFaqAns6"),
    },
  ];

  return (
    <div className="bg-gray-50 px-6 sm:px-10 lg:px-20 py-20 space-y-28">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto space-y-4"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold text-[#DC3173]">
          {t("helpCenter")}
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl">
          {t("helpCenterDesc")}
        </p>
      </motion.div>

      {/* Category Guides */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {categories.map((cat, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition flex flex-col items-center text-center space-y-4 cursor-pointer"
          >
            <div className="text-[#DC3173] text-4xl">📌</div>
            <h3 className="font-bold text-gray-900 text-lg">{cat.title}</h3>
            <p className="text-gray-600 text-sm">{cat.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* FAQ Section */}
      <div className="space-y-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">{t("frequentlyAskedQuestion")}</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition hover:shadow-2xl">
              <div
                className="flex justify-between items-center"
                onClick={() => toggleFAQ(idx)}
              >
                <h3 className="text-gray-900 font-medium text-lg">{faq.question}</h3>
                <ChevronDown
                  className={`w-6 h-6 text-pink-400 transition-transform ${activeFAQ === idx ? "rotate-180" : ""}`}
                />
              </div>
              {activeFAQ === idx && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-gray-600"
                >
                  {faq.answer}
                </motion.p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Vendor Tips Section */}
      <motion.div
        className="max-w-5xl mx-auto space-y-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">{t("vendorTips")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition cursor-pointer">
            <h3 className="font-bold text-gray-900 mb-2">{t("optimizeMenu")}</h3>
            <p className="text-gray-600 text-sm">
              {t("optimizeMenuDesc")}
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition cursor-pointer">
            <h3 className="font-bold text-gray-900 mb-2">{t("fastOrder")}</h3>
            <p className="text-gray-600 text-sm">
              {t("fastOrderDesc")}
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition cursor-pointer">
            <h3 className="font-bold text-gray-900 mb-2">{t("leveragePromotions")}</h3>
            <p className="text-gray-600 text-sm">
              {t("leverageDesc")}
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition cursor-pointer">
            <h3 className="font-bold text-gray-900 mb-2">{t("monitorAnalytics")}</h3>
            <p className="text-gray-600 text-sm">
              {t("monitorDesc")}
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition cursor-pointer">
            <h3 className="font-bold text-gray-900 mb-2">{t("maintainCustomer")}</h3>
            <p className="text-gray-600 text-sm">
              {t("maintainCustomerDesc")}
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition cursor-pointer">
            <h3 className="font-bold text-gray-900 mb-2">{t("ecoFriendlyPractises")}</h3>
            <p className="text-gray-600 text-sm">
              {t("ecoFriendlyDesc")}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Contact Support */}
      <motion.div
        className="bg-linear-to-r from-[#FF7EB3]/20 to-[#DC3173]/20 rounded-3xl p-10 text-center space-y-6 max-w-5xl mx-auto shadow-xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          {t("stillHaveQuestions")}
        </h2>
        <p className="text-gray-700 text-lg sm:text-xl">
          {t("haveQuestionsDesc")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          {/* Email */}
          <div className="flex items-center gap-4 bg-gray-900/80 rounded-2xl p-6 hover:bg-linear-to-r hover:from-[#FF7EB3]/40 hover:to-[#DC3173]/40 transition-transform transform hover:-translate-y-2 shadow-lg cursor-pointer">
            <Mail className="w-7 h-7 text-pink-400 animate-pulse" />
            <div className="text-left">
              <p className="text-gray-300 font-medium text-sm">Email</p>
              <a
                href="mailto:support@deligo.com"
                className="text-white font-semibold text-base hover:text-white/90 transition"
              >
                support@deligo.pt
              </a>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="flex items-center gap-4 bg-gray-900/80 rounded-2xl p-6 hover:bg-linear-to-r hover:from-[#FF7EB3]/40 hover:to-[#DC3173]/40 transition-transform transform hover:-translate-y-2 shadow-lg cursor-pointer">
            <Phone className="w-7 h-7 text-pink-400 animate-bounce" />
            <div className="text-left">
              <p className="text-gray-300 font-medium text-sm">WhatsApp</p>
              <a
                href="https://wa.me/YOUR_NUMBER"
                target="_blank"
                className="text-white font-semibold text-base hover:text-white/90 transition"
              >
                {t("privacyChatNow")}
              </a>
            </div>
          </div>

          {/* Live Chat */}
          <div className="flex items-center gap-4 bg-gray-900/80 rounded-2xl p-6 hover:bg-linear-to-r hover:from-[#FF7EB3]/40 hover:to-[#DC3173]/40 transition-transform transform hover:-translate-y-2 shadow-lg cursor-pointer">
            <MessageCircle className="w-7 h-7 text-pink-400 animate-pulse" />
            <div className="text-left">
              <p className="text-gray-300 font-medium text-sm">{t("privacyLiveChat")}</p>
              <a
                href="/live-chat"
                className="text-white font-semibold text-base hover:text-white/90 transition"
              >
                {t("privacyStartChat")}
              </a>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
