"use client";

import {
  AnimatedCounter,
  AnimatedInteger,
} from "@/src/components/Dashboard/Earnings/EarningsSummary/AnimatedCounter";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { TEarningsAnalytics } from "@/src/types/analytics.type";
import { motion, Variants } from "framer-motion";
import {
  ActivityIcon,
  CalendarIcon,
  ClockIcon,
  EuroIcon,
  PackageIcon,
} from "lucide-react";

interface IProps {
  analyticsData: TEarningsAnalytics;
}

export default function EarningsSummary ({ analyticsData }: IProps) {
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
        stiffness: 100,
        damping: 15,
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
      {/* Header */}
      <TitleHeader
        title="Earnings Summary"
        subtitle="Overview of your earnings and sales"
        extraComponent={
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <CalendarIcon className="w-4 h-4 text-[#DC3173]" />
            <span className="text-sm font-medium text-gray-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        }
      />

      {/* Hero Card - Total Earnings */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-white border border-gray-200 shadow"
      >
        {/* Subtle brand accent top bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-[#DC3173] to-[#e45a92]" />
        {/* Soft background tint */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DC3173]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#DC3173]/10 text-[#DC3173]">
                  <EuroIcon className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold tracking-wider text-gray-400 uppercase">
                  Total Earnings
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-xl md:text-3xl font-bold text-[#DC3173] tracking-tight">
                  <AnimatedCounter
                    value={analyticsData.topCard?.totalEarnings}
                    prefix="€"
                  />
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 md:gap-6 pt-4">
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    Total Orders
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    <AnimatedInteger value={analyticsData.topCard?.orders} />
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    Completed Orders
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    <AnimatedInteger value={analyticsData.topCard?.completed} />
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    Pending Orders
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    <AnimatedInteger value={analyticsData.topCard?.pending} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            y: -4,
          }}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#DC3173]/30 transition-all duration-300 group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#DC3173]/10 rounded-lg text-[#DC3173]">
              <ClockIcon className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">
            Today&lsquo;s Earnings
          </h3>
          <div className="text-3xl font-bold text-gray-900 group-hover:text-[#DC3173] transition-colors">
            <AnimatedCounter
              value={analyticsData.earningsOverview?.today}
              prefix="€"
            />
          </div>
        </motion.div>

        {/* This Week */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            y: -4,
          }}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#DC3173]/30 transition-all duration-300 group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#DC3173]/10 rounded-lg text-[#DC3173]">
              <ActivityIcon className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">This Week</h3>
          <div className="text-3xl font-bold text-gray-900 group-hover:text-[#DC3173] transition-colors">
            <AnimatedCounter
              value={analyticsData.earningsOverview?.thisWeek}
              prefix="€"
            />
          </div>
        </motion.div>

        {/* This Month */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            y: -4,
          }}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#DC3173]/30 transition-all duration-300 group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#DC3173]/10 rounded-lg text-[#DC3173]">
              <CalendarIcon className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">This Month</h3>
          <div className="text-3xl font-bold text-gray-900 group-hover:text-[#DC3173] transition-colors">
            <AnimatedCounter
              value={analyticsData.earningsOverview?.thisMonth}
              prefix="€"
            />
          </div>
        </motion.div>
      </div>

      {/* Products Stats Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#DC3173]/5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2" />

        <div className="flex items-center gap-3 mb-6">
          <PackageIcon className="w-6 h-6 text-[#DC3173]" />
          <h2 className="text-xl font-bold text-gray-900">
            Product Performance
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-200">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              <AnimatedInteger value={analyticsData.products?.total} />
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">
              Total Items
            </div>
          </div>
          <div className="bg-[#DC3173]/10 p-4 rounded-2xl text-center border border-green-100">
            <div className="text-3xl font-bold text-[#DC3173] mb-1">
              <AnimatedInteger value={analyticsData.products?.active} />
            </div>
            <div className="text-xs text-[#DC3173]/80 uppercase tracking-wider">
              Active Items
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-200">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              <AnimatedInteger value={analyticsData.products?.inactive} />
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">
              Inactive Items
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Inventory Progress</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-3 overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-[#DC3173] to-[#e45a92]"
              initial={{
                width: 0,
              }}
              animate={{
                width: `${(analyticsData.products?.active / analyticsData.products?.total) * 100}%`,
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
