"use client";

import { cn } from "@/lib/utils";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { TPayout } from "@/src/types/payout.type";
import { format } from "date-fns";
import { motion, Variants } from "framer-motion";
import {
  ArrowLeftIcon,
  BuildingIcon,
  CheckCircle2Icon,
  ClockIcon,
  CopyIcon,
  ThumbsUpIcon,
  XCircleIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// const timeline = [
//   {
//     label: "Initiated",
//     time: "09:00 AM",
//     done: true,
//   },
//   {
//     label: "Processing",
//     time: "11:15 AM",
//     done: true,
//   },
//   {
//     label: "Sent to Bank",
//     time: "02:32 PM",
//     done: true,
//   },
//   {
//     label: "Settled",
//     time: "05:00 PM",
//     done: true,
//   },
// ];

interface IProps {
  payout: TPayout;
}

export default function PayoutDetails({ payout }: IProps) {
  const router = useRouter();
  const [ibanCopied, setIbanCopied] = useState(false);

  const copyIban = () => {
    navigator.clipboard.writeText(payout.bankDetails.iban!);
    setIbanCopied(true);
    setTimeout(() => setIbanCopied(false), 3000);
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
        stiffness: 90,
        damping: 18,
      },
    },
  } as Variants;

  return (
    <motion.div
      className="min-h-screen p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Back */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <button
          onClick={() => router.push("/vendor/payouts")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Payouts
        </button>
      </motion.div>

      {/* Header */}
      <TitleHeader
        title="Payout Details"
        subtitle="Full details of the payout"
      />

      {/* Hero Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-black/70 text-sm font-medium">
                  Payout
                </span>
                {payout.payoutId && (
                  <span className="bg-black/20 text-black text-xs px-2 py-0.5 rounded-full font-mono">
                    {payout.payoutId}
                  </span>
                )}
              </div>
              <p className="text-2xl md:text-4xl text-[#DC3173] font-bold mt-2">
                €{payout.amount}
              </p>
              <p className="text-[#DC3173]/70 text-sm mt-2">
                {payout.paymentMethod}
              </p>
            </div>
            <div
              className={cn(
                "flex items-center gap-2 border px-4 py-2 rounded-full text-sm font-semibold",
                payout.status === "PAID"
                  ? "bg-[#DC3173]/10 border-[#DC3173]/30 text-[#DC3173]"
                  : payout.status === "PENDING"
                    ? "bg-amber-100 border-amber-200 text-amber-800"
                    : payout.status === "FAILED"
                      ? "bg-red-100 border-red-200 text-red-800"
                      : payout.status === "PROCESSING"
                        ? "bg-amber-100 border-amber-200 text-amber-800"
                        : "bg-gray-100 border-gray-200 text-gray-800",
              )}
            >
              {payout.status === "PAID" && (
                <CheckCircle2Icon className="w-4 h-4" />
              )}
              {payout.status === "PENDING" && <ClockIcon className="w-4 h-4" />}
              {payout.status === "FAILED" && (
                <XCircleIcon className="w-4 h-4" />
              )}
              {payout.status === "PROCESSING" && (
                <ClockIcon className="w-4 h-4" />
              )}
              <span>{payout.status}</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-black/60 text-xs uppercase tracking-wide">
                Date
              </p>
              <p className="text-black font-semibold mt-0.5">
                {payout.createdAt
                  ? format(payout.createdAt, "do MMM yyyy")
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-black/60 text-xs uppercase tracking-wide">
                Bank
              </p>
              <p className="text-black font-semibold mt-0.5">
                {payout.bankDetails?.bankName}
              </p>
            </div>
            <div>
              <p className="text-black/60 text-xs uppercase tracking-wide">
                Reference
              </p>
              <p className="text-black font-mono text-sm mt-0.5">
                {payout.bankReferenceId}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
      {/* Timeline */}
      {/* <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
        >
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-[#DC3173]" />
            Payout Timeline
          </h3>
          <div className="relative">
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gray-100" />
            <div className="space-y-6">
              {timeline.map((step) => (
                <div
                  key={step.label}
                  className="flex items-start gap-4 relative"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${step.done ? "bg-[#DC3173]" : "bg-gray-100"}`}
                  >
                    {step.done ? (
                      <CheckCircle2Icon className="w-4 h-4 text-white" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`font-semibold text-sm ${step.done ? "text-gray-900" : "text-gray-400"}`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {format(payout.createdAt, "do MMM yyyy")} · {step.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div> */}

      {/* Bank Details */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
      >
        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BuildingIcon className="w-4 h-4 text-[#DC3173]" />
          Bank Account
        </h3>
        <div className="space-y-4">
          {[
            {
              label: "Account Holder",
              value: payout.bankDetails?.accountHolder || "N/A",
            },
            {
              label: "Bank Name",
              value: payout.bankDetails?.bankName || "N/A",
            },
            {
              label: "IBAN",
              value: payout.bankDetails?.iban || "N/A",
              mono: true,
            },
            {
              label: "Method",
              value: payout.paymentMethod || "N/A",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
            >
              <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                {item.label}
              </span>
              <span
                className={`text-sm text-gray-900 font-medium ${item.mono ? "font-mono" : ""}`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
        {ibanCopied ? (
          <div className="font-semibold text-[#DC3173] mt-4 w-full flex items-center justify-center gap-2 border border-[#DC3173] rounded-xl py-2.5 text-sm">
            <ThumbsUpIcon className="w-3.5 h-3.5" />
            Copied to clipboard
          </div>
        ) : (
          <button
            onClick={copyIban}
            className="mt-4 w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <CopyIcon className="w-3.5 h-3.5" />
            Copy IBAN
          </button>
        )}
      </motion.div>
      {/* </div> */}
    </motion.div>
  );
}
