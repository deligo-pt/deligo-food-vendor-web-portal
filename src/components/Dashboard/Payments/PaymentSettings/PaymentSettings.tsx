"use client";

import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  AlertTriangleIcon,
  CalendarIcon,
  CheckIcon,
  EyeOffIcon,
  InfoIcon,
  LandmarkIcon,
  LockIcon,
  ShieldCheckIcon,
  ShieldIcon,
} from "lucide-react";
import { useState } from "react";

const tabs = [
  {
    id: "bank",
    label: "Bank Account",
    icon: LandmarkIcon,
  },
  {
    id: "payout",
    label: "Payout Schedule",
    icon: CalendarIcon,
  },
  {
    id: "security",
    label: "Security",
    icon: ShieldIcon,
  },
];

const scheduleOptions = [
  {
    id: "weekly",
    label: "Weekly",
    sub: "Every Monday",
  },
  {
    id: "biweekly",
    label: "Bi-weekly",
    sub: "Every other Monday",
  },
  {
    id: "monthly",
    label: "Monthly",
    sub: "First Monday of the month",
  },
];

export default function PaymentSettings() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("bank");
  const [iban, setIban] = useState("PT50 0002 0123 5678 9011 22");
  const [accountHolder, setAccountHolder] = useState("Deligo Vendor");
  const [bankName, setBankName] = useState("Caixa Geral de Depósitos");
  const [selectedSchedule, setSelectedSchedule] = useState("weekly");

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    },
  } as Variants;

  return (
    <motion.div
      className="min-h-screen p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <TitleHeader
        title={t("payment_settings")}
        subtitle={t("configure_bank_account_payout_method_security")}
      />

      {/* Two-column layout */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-start"
      >
        {/* Left Sidebar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 last:mb-0 ${isActive ? "bg-[#DC3173]/8 text-[#DC3173]" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeDot"
                    className="w-1.5 h-1.5 rounded-full bg-[#DC3173]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Panel */}
        <AnimatePresence mode="wait">
          {activeTab === "bank" && (
            <motion.div
              key="bank"
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -20,
              }}
              transition={{
                duration: 0.2,
              }}
              className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-[#DC3173]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <LandmarkIcon className="w-6 h-6 text-[#DC3173]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Bank Account Details
                  </h2>
                  <p className="text-gray-500 text-sm mt-0.5">
                    Your linked SEPA bank account for payouts
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-100 mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    IBAN
                  </label>
                  <input
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:bg-white focus:border-[#DC3173] focus:ring-2 focus:ring-[#DC3173]/20 outline-none transition-all font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:bg-white focus:border-[#DC3173] focus:ring-2 focus:ring-[#DC3173]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:bg-white focus:border-[#DC3173] focus:ring-2 focus:ring-[#DC3173]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <InfoIcon className="w-3.5 h-3.5" />
                  <span>Changes require identity verification</span>
                </div>
                <motion.button
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="flex items-center gap-2 bg-[#DC3173] text-white px-6 py-2.5 rounded-xl font-medium text-sm"
                >
                  <CheckIcon className="w-4 h-4" />
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === "payout" && (
            <motion.div
              key="payout"
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -20,
              }}
              transition={{
                duration: 0.2,
              }}
              className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CalendarIcon className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Payout Schedule
                  </h2>
                  <p className="text-gray-500 text-sm mt-0.5">
                    Choose when you receive your earnings
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-100 mb-6" />

              <div className="space-y-3">
                {scheduleOptions.map((opt) => {
                  const isSelected = selectedSchedule === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedSchedule(opt.id)}
                      className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${isSelected ? "ring-2 ring-[#DC3173] border-[#DC3173]/30 bg-[#DC3173]/5" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "border-[#DC3173]" : "border-gray-300"}`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-[#DC3173]" />
                        )}
                      </div>
                      <div>
                        <p
                          className={`font-semibold text-sm ${isSelected ? "text-[#DC3173]" : "text-gray-900"}`}
                        >
                          {opt.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {opt.sub}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <InfoIcon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-700 text-sm">
                  Payments follow SEPA rules for Portugal. Processing may take
                  1–3 business days.
                </p>
              </div>

              <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
                <motion.button
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="flex items-center gap-2 bg-[#DC3173] text-white px-6 py-2.5 rounded-xl font-medium text-sm"
                >
                  <CheckIcon className="w-4 h-4" />
                  Save Schedule
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              key="security"
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -20,
              }}
              transition={{
                duration: 0.2,
              }}
              className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Security & Verification
                  </h2>
                  <p className="text-gray-500 text-sm mt-0.5">
                    Protect your account and earnings
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-100 mb-6" />

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-6">
                <AlertTriangleIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800 text-sm">
                    Identity Not Verified
                  </p>
                  <p className="text-amber-600 text-xs mt-0.5">
                    Verify your identity to enable payout changes
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  {
                    icon: LockIcon,
                    title: "Payout Change Protection",
                    desc: "All payout modifications require identity confirmation",
                  },
                  {
                    icon: EyeOffIcon,
                    title: "Data Privacy",
                    desc: "Your banking details are encrypted and never shared",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {item.title}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <motion.button
                whileHover={{
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#DC3173] text-white py-3.5 rounded-xl font-semibold text-sm"
              >
                <ShieldCheckIcon className="w-5 h-5" />
                Verify Identity
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
