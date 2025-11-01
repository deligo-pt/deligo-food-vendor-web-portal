"use client";

import { motion } from "framer-motion";
import {
  User,
  Briefcase,
  CreditCard,
  FileText,
  CheckCircle2,
} from "lucide-react";

export default function StepperFlow() {
  const steps = [
    {
      id: 1,
      title: "Personal",
      subtitle: "Your Info",
      icon: <User className="w-5 h-5" />,
    },
    {
      id: 2,
      title: "Business",
      subtitle: "Company Info",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      id: 3,
      title: "Bank",
      subtitle: "Payment Setup",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: 4,
      title: "Documents",
      subtitle: "Upload Files",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: 5,
      title: "Complete",
      subtitle: "Finish Setup",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
  ];

  return (
    <div className="w-full py-10 px-4 sm:px-8 bg-gradient-to-r from-[#DC3173]/5 via-[#DC3173]/10 to-[#DC3173]/5 rounded-3xl backdrop-blur-md shadow-inner border border-[#DC3173]/20 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-[#DC3173] to-[#a72b5c] bg-clip-text text-transparent tracking-wide">
          Vendor Registration Process
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          Follow these simple steps to become a verified vendor
        </p>
      </motion.div>

      {/* Desktop & Tablet View */}
      <div className="hidden md:block">
        <div className="relative mx-auto max-w-5xl px-6">
          {/* Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[3px] -translate-y-1/2 bg-gradient-to-r from-[#DC3173]/70 to-[#a72b5c]/70 rounded-full" />

          <ol className="relative flex justify-between items-center flex-wrap gap-y-8">
            {steps.map((s, i) => (
              <motion.li
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center w-[18%] min-w-[120px]"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-[#DC3173] to-[#a72b5c] rounded-full text-white shadow-lg shadow-[#DC3173]/30 border border-white/30"
                >
                  <CheckCircle2 className="w-7 h-7" />
                </motion.div>
                <span className="mt-3 text-base font-semibold text-[#DC3173]">
                  {s.title}
                </span>
                <span className="text-xs text-gray-500">{s.subtitle}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden mt-4">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 px-2">
          {steps.map((s, i) => (
            <motion.div
              key={s.id}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: i * 0.05 }}
              className="min-w-[95px] flex-shrink-0 flex flex-col items-center bg-gradient-to-r from-[#DC3173] to-[#a72b5c] text-white py-4 px-3 rounded-2xl shadow-md shadow-[#DC3173]/30"
            >
              <div className="flex items-center justify-center w-10 h-10 mb-2 bg-white/10 rounded-full">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold">{s.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
