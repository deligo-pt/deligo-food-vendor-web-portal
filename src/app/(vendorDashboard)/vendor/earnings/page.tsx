// app/vendor/earnings-summary/page.tsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useTranslation } from "@/src/hooks/use-translation";
import {
  ArrowDownCircle,
  BarChart3,
  CalendarDays,
  FileBarChart,
  TrendingUp,
  Wallet,
} from "lucide-react";

const PRIMARY = "#DC3173";
const GRADIENT = "linear-gradient(135deg, #FFE0ED, #FFFFFF)";
const SHADOW = "0 8px 28px rgba(0,0,0,0.08)";

/* ---------------------------
   Mock data (static)
----------------------------*/
const SUMMARY = {
  totalEarnings: 1284.75,
  thisWeek: 286.4,
  lastWeek: 241.9,
  completedOrders: 142,
  cancelledOrders: 7,
  avgOrderValue: 9.85,
};

const DAILY_EARNINGS = [
  { day: "Mon", value: 42 },
  { day: "Tue", value: 56 },
  { day: "Wed", value: 38 },
  { day: "Thu", value: 81 },
  { day: "Fri", value: 92 },
  { day: "Sat", value: 72 },
  { day: "Sun", value: 65 },
];

/* Helper to scale bars to visual px height (keeps consistent across data) */
const maxValue = Math.max(...DAILY_EARNINGS.map((d) => d.value));
const BAR_MAX_HEIGHT = 160; // px

export default function EarningsSummaryPage() {
  const { t } = useTranslation();
  const [range, setRange] = useState<"7d" | "30d">("7d");

  return (
    <div className="min-h-screen p-6 md:p-10 bg-[#FFF1F7]">
      <div className="max-w-[1200px] mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-4xl font-extrabold tracking-tight"
              style={{ color: PRIMARY }}
            >
              {t("earnings_summary")}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {t("performance_overview")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">{t("range")}</div>
            <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-sm">
              <button
                onClick={() => setRange("7d")}
                className={`px-3 py-1 rounded-full text-sm ${range === "7d" ? "bg-[rgba(220,49,115,0.12)] text-primary" : "text-gray-600"}`}
                style={range === "7d" ? { color: PRIMARY } : {}}
              >
                7d
              </button>
              <button
                onClick={() => setRange("30d")}
                className={`px-3 py-1 rounded-full text-sm ${range === "30d" ? "bg-[rgba(220,49,115,0.12)] text-primary" : "text-gray-600"}`}
                style={range === "30d" ? { color: PRIMARY } : {}}
              >
                30d
              </button>
            </div>

            <Button
              style={{ background: PRIMARY }}
              className="text-white flex items-center gap-2"
            >
              <FileBarChart size={16} /> {t("export_report")}
            </Button>
          </div>
        </div>

        {/* Top summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total earnings */}
          <Card
            className="rounded-3xl border"
            style={{ background: GRADIENT, boxShadow: SHADOW }}
          >
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">{t("total_earnings")}</p>
                <h2
                  className="text-4xl font-extrabold"
                  style={{ color: PRIMARY }}
                >
                  €{SUMMARY.totalEarnings.toFixed(2)}
                </h2>
                <p className="text-xs text-gray-500 mt-2">
                  {t("since_joining_the_platform")}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white shadow-inner">
                <Wallet size={42} className="text-pink-600" />
              </div>
            </CardContent>
          </Card>

          {/* This week */}
          <Card className="rounded-3xl border bg-white shadow-md">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">{t("this_week")}</p>
                <h2 className="text-3xl font-bold">
                  €{SUMMARY.thisWeek.toFixed(2)}
                </h2>
                <div className="text-xs text-gray-500 mt-1">
                  {t("vs_last_week")}
                </div>
              </div>
              <TrendingUp size={36} className="text-green-600" />
            </CardContent>
          </Card>

          {/* Last week */}
          <Card className="rounded-3xl border bg-white shadow-md">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">{t("last_week")}</p>
                <h2 className="text-3xl font-bold">
                  €{SUMMARY.lastWeek.toFixed(2)}
                </h2>
                <div className="text-xs text-gray-500 mt-1">
                  {t("reference")}
                </div>
              </div>
              <ArrowDownCircle size={36} className="text-amber-600" />
            </CardContent>
          </Card>
        </div>

        {/* Weekly earnings chart */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="text-gray-600" />
                <h2 className="font-bold text-lg">
                  {t("weekly_earnings_overview")}
                </h2>
              </div>

              <div className="text-sm text-gray-500">
                {t("total_this_week")}:{" "}
                <span className="font-semibold text-gray-800">
                  €{SUMMARY.thisWeek.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Bars */}
            <div className="flex items-end gap-4 h-48">
              {DAILY_EARNINGS.map((d) => {
                const height = Math.round(
                  (d.value / maxValue) * BAR_MAX_HEIGHT,
                );
                return (
                  <div
                    key={d.day}
                    className="flex-1 flex flex-col items-center"
                  >
                    <motion.div
                      initial={{ height: 4 }}
                      animate={{ height }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 20,
                      }}
                      className="w-full rounded-t-xl"
                      style={{
                        background: "linear-gradient(180deg,#FF97C0,#FF5A92)",
                      }}
                      title={`${d.day}: €${d.value}`}
                    />
                    <div className="text-xs text-gray-600 mt-2">{d.day}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Order metrics */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="text-gray-600" />
              <h2 className="font-bold text-lg">{t("order_metrics")}</h2>
            </div>

            <Separator />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <Metric
                label={t("completed_orders")}
                value={SUMMARY.completedOrders}
                tone="green"
              />
              <Metric
                label={t("cancelled_orders")}
                value={SUMMARY.cancelledOrders}
                tone="red"
              />
              <Metric
                label={t("avg_order_value")}
                value={`€${SUMMARY.avgOrderValue}`}
                tone="pink"
              />
              <Metric
                label={t("total_revenue")}
                value={`€${SUMMARY.totalEarnings.toFixed(0)}`}
                tone="gray"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------
   Metric component
----------------------------*/
function Metric({
  label,
  value,
  tone = "gray",
}: {
  label: string;
  value: string | number;
  tone?: "green" | "red" | "pink" | "gray";
}) {
  const colorClass =
    tone === "green"
      ? "text-green-600"
      : tone === "red"
        ? "text-red-600"
        : tone === "pink"
          ? "text-pink-600"
          : "text-gray-800";

  return (
    <div className="p-4 bg-gray-50 rounded-2xl shadow-inner">
      <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
      <div className="text-gray-600 text-sm mt-1">{label}</div>
    </div>
  );
}
