"use client";

import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { TRatingSummary } from "@/src/types/review.type";
import { motion, Variants } from "framer-motion";
import {
  AwardIcon,
  MessageCircleIcon,
  StarIcon,
  TrendingUpIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Formatter } from "recharts/types/component/DefaultTooltipContent";

const getStar = (star: string) => {
  switch (star) {
    case "five":
      return "5★";
    case "four":
      return "4★";
    case "three":
      return "3★";
    case "two":
      return "2★";
    case "one":
      return "1★";
    default:
      return "0★";
  }
};

export default function RatingSummary({
  summaryResult,
}: {
  summaryResult: TRatingSummary;
}) {
  const { t } = useTranslation();

  const radialData = [
    {
      name: "Rating",
      value: (summaryResult.summary?.avgRating / 5) * 100,
      fill: "#DC3173",
    },
  ];

  const starPercentages = Object.entries(
    summaryResult.summary?.starPercentages || {},
  ).map(([key, value]) => ({ name: getStar(key), value }));

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
      y: 30,
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

  const formatCategory = (cat: string) =>
    cat.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

  return (
    <motion.div
      className="min-h-screen p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <TitleHeader
        title={t("rating_summary")}
        subtitle={t("customer_satisfaction_overview")}
      />

      <motion.div
        variants={itemVariants}
        className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
      >
        <div className="space-y-4">
          <div className="inline-flex gap-2 bg-[#DC3173]/8 text-[#DC3173] text-xs font-semibold px-3 py-1.5 rounded-full">
            <AwardIcon className="w-3.5 h-3.5" />
            Customer Satisfaction
          </div>
          <div className="mt-6 flex items-center gap-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                Total Reviews
              </p>
              <p className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 mt-0.5">
                {summaryResult.summary?.avgRating}
              </p>
            </div>
            <div className="w-px h-10 bg-gray-100" />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                Avg Score
              </p>
              <p className="text-xl md:text-2xl lg:text-4xl  font-bold text-gray-900 mt-0.5">
                {summaryResult.summary?.avgRating?.toFixed(1)}
              </p>
            </div>
            <div className="w-px h-10 bg-gray-100" />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                Out of
              </p>
              <p className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 mt-0.5">
                5.0
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Based on last {summaryResult.summary?.totalRatings || 0} reviews
          </p>
        </div>

        {/* Radial Score */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                startAngle={90}
                endAngle={-270}
                data={radialData}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  background={{
                    fill: "#f1f5f9",
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-gray-900">
                {summaryResult.summary?.avgRating?.toFixed(1) || "0.0"}
              </span>
              <span className="text-gray-400 text-sm">/ 5</span>
            </div>
          </div>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <StarIcon
                key={s}
                className={`w-4 h-4 ${s <= (summaryResult.summary?.avgRating || 0) ? "fill-[#DC3173] text-[#DC3173]" : "text-gray-200"}`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Sentiment Strip — 3 cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            label: "Positive Reviews",
            value: summaryResult.summary?.sentimentPercentages?.positive,
            color: "emerald",
            border: "border-l-4 border-emerald-400",
            bg: "bg-emerald-50",
            text: "text-emerald-600",
            num: "text-emerald-700",
          },
          {
            label: "Neutral Reviews",
            value: summaryResult.summary?.sentimentPercentages?.neutral,
            color: "amber",
            border: "border-l-4 border-amber-400",
            bg: "bg-amber-50",
            text: "text-amber-600",
            num: "text-amber-700",
          },
          {
            label: "Negative Reviews",
            value: summaryResult.summary?.sentimentPercentages?.negative,
            color: "red",
            border: "border-l-4 border-red-400",
            bg: "bg-red-50",
            text: "text-red-600",
            num: "text-red-700",
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${item.border}`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-wide ${item.text}`}
            >
              {item.label}
            </p>
            <p className={`text-4xl font-bold mt-2 ${item.num}`}>
              {item.value}%
            </p>
            <div className={`mt-3 h-1.5 rounded-full ${item.bg}`}>
              <div
                className={`h-full rounded-full bg-current ${item.text}`}
                style={{
                  width: `${item.value}%`,
                }}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Breakdown + Trend — two column */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Horizontal Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-[#DC3173]/10 rounded-lg flex items-center justify-center">
              <TrendingUpIcon className="w-4 h-4 text-[#DC3173]" />
            </div>
            <h3 className="font-semibold text-gray-900">Star Distribution</h3>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={starPercentages}
                layout="vertical"
                margin={{
                  left: 0,
                  right: 16,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#F1F5F9"
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#94A3B8",
                    fontSize: 11,
                  }}
                  domain={[0, 100]}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748B",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                  width={32}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #E2E8F0",
                    fontSize: 12,
                  }}
                  formatter={
                    ((v: number) => [`${v}%`, "Reviews"]) as Formatter<
                      number,
                      string
                    >
                  }
                />
                <Bar dataKey="value" fill="#DC3173" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Trend */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-[#DC3173]/10 rounded-lg flex items-center justify-center">
              <MessageCircleIcon className="w-4 h-4 text-[#DC3173]" />
            </div>
            <h3 className="font-semibold text-gray-900">30-Day Trend</h3>
          </div>
          <div className="h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summaryResult.chart}>
                <defs>
                  <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC3173" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#DC3173" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#94A3B8",
                    fontSize: 10,
                  }}
                  interval={6}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#94A3B8",
                    fontSize: 10,
                  }}
                  domain={[0, 5]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #E2E8F0",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avgRatings"
                  stroke="#DC3173"
                  strokeWidth={2}
                  fill="url(#ratingGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
            {summaryResult.summary?.avgRating === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <MessageCircleIcon className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-gray-400 text-sm font-medium">
                  Awaiting reviews
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Category Ratings — 2x2 grid */}
      <motion.div variants={itemVariants}>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Category Scores
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(summaryResult.summary?.categoryRatings)?.map(
            ([key, value], i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                transition={{
                  delay: i * 0.05,
                }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center"
              >
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {formatCategory(key)}
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {value?.toFixed(1)}
                </p>
                <div className="flex justify-center gap-1.5 mt-3">
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <div
                      key={dot}
                      className={`w-2 h-2 rounded-full ${dot <= value ? "bg-[#DC3173]" : "bg-gray-200"}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">No reviews yet</p>
              </motion.div>
            ),
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
