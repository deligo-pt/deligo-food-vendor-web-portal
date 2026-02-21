"use client";

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
  HashIcon,
  MinusCircleIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

const payout: TPayout = {
  _id: "1",
  payoutId: "PAY-2025-001",
  amount: "84.50",
  method: "Bank Transfer (SEPA)",
  iban: "PT50 0002 0123 5678 9011 22",
  accountHolder: "Deligo Vendor",
  bankName: "Caixa Geral de Depósitos",
  status: "COMPLETED",
  initiatedAt: "2025-11-08 · 09:00 AM",
  processedAt: "2025-11-08 · 02:32 PM",
  settledAt: "2025-11-08 · 05:00 PM",
  reference: "SEPA-REF-20251108-001",
  orders: [
    {
      orderId: "DG-9031",
      amount: "12.90",
      date: "2025-11-08",
      status: "DELIVERED",
    },
    {
      orderId: "DG-9022",
      amount: "19.40",
      date: "2025-11-07",
      status: "DELIVERED",
    },
    {
      orderId: "DG-9018",
      amount: "24.80",
      date: "2025-11-06",
      status: "DELIVERED",
    },
    {
      orderId: "DG-9010",
      amount: "31.20",
      date: "2025-11-05",
      status: "DELIVERED",
    },
  ],
  grossEarnings: "88.30",
  platformFee: "3.80",
  netPayout: "84.50",
  createdAt: "2025-11-08T09:00:00Z",
  updatedAt: "2025-11-08T09:00:00Z",
};

const timeline = [
  {
    label: "Initiated",
    time: "09:00 AM",
    done: true,
  },
  {
    label: "Processing",
    time: "11:15 AM",
    done: true,
  },
  {
    label: "Sent to Bank",
    time: "02:32 PM",
    done: true,
  },
  {
    label: "Settled",
    time: "05:00 PM",
    done: true,
  },
];

export default function PayoutDetails() {
  const router = useRouter();

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
                <span className="bg-black/20 text-black text-xs px-2 py-0.5 rounded-full font-mono">
                  {payout.payoutId}
                </span>
              </div>
              <p className="text-2xl md:text-4xl text-[#DC3173] font-bold mt-2">
                €{payout.amount}
              </p>
              <p className="text-[#DC3173]/70 text-sm mt-2">{payout.method}</p>
            </div>
            <div className="flex items-center gap-2 bg-[#DC3173]/10 border border-[#DC3173]/30 text-[#DC3173] px-4 py-2 rounded-full text-sm font-semibold">
              <CheckCircle2Icon className="w-4 h-4" />
              Completed
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-black/60 text-xs uppercase tracking-wide">
                Date
              </p>
              <p className="text-black font-semibold mt-0.5">
                {format(payout.createdAt, "do MMM yyyy")}
              </p>
            </div>
            <div>
              <p className="text-black/60 text-xs uppercase tracking-wide">
                Bank
              </p>
              <p className="text-black font-semibold mt-0.5">
                {payout.bankName}
              </p>
            </div>
            <div>
              <p className="text-black/60 text-xs uppercase tracking-wide">
                Reference
              </p>
              <p className="text-black font-mono text-sm mt-0.5">
                {payout.reference}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timeline */}
        <motion.div
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
        </motion.div>

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
                value: payout.accountHolder,
              },
              {
                label: "Bank Name",
                value: payout.bankName,
              },
              {
                label: "IBAN",
                value: payout.iban,
                mono: true,
              },
              {
                label: "Method",
                value: payout.method,
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
          <button className="mt-4 w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
            <CopyIcon className="w-3.5 h-3.5" />
            Copy IBAN
          </button>
        </motion.div>
      </div>

      {/* Earnings Breakdown */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
      >
        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUpIcon className="w-4 h-4 text-[#DC3173]" />
          Earnings Breakdown
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
            <div className="flex items-center gap-3">
              <ShoppingBagIcon className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Gross Earnings
              </span>
            </div>
            <span className="font-bold text-green-700">
              +€{payout.grossEarnings}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
            <div className="flex items-center gap-3">
              <MinusCircleIcon className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-700">
                Platform Fee
              </span>
            </div>
            <span className="font-bold text-red-600">
              -€{payout.platformFee}
            </span>
          </div>
          <div className="h-px bg-gray-100 my-2" />
          <div className="flex items-center justify-between p-3 bg-[#DC3173]/5 rounded-xl border border-[#DC3173]/15">
            <div className="flex items-center gap-3">
              <WalletIcon className="w-4 h-4 text-[#DC3173]" />
              <span className="text-sm font-bold text-[#DC3173]">
                Net Payout
              </span>
            </div>
            <span className="font-bold text-[#DC3173] text-lg">
              €{payout.netPayout}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Included Orders */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
      >
        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
          <ShoppingBagIcon className="w-4 h-4 text-[#DC3173]" />
          Included Orders
        </h3>
        <p className="text-gray-400 text-sm mb-5">
          {payout.orders?.length} orders included in this payout
        </p>
        <div className="space-y-3">
          {payout.orders?.map((order, i) => (
            <motion.div
              key={order.orderId}
              initial={{
                opacity: 0,
                x: -10,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.3 + i * 0.07,
              }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#DC3173]/10 rounded-lg flex items-center justify-center">
                  <HashIcon className="w-4 h-4 text-[#DC3173]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Order #{order.orderId}
                  </p>
                  <p className="text-xs text-gray-400">{order.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  {order.status}
                </span>
                <span className="font-bold text-gray-900">
                  +€{order.amount}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
