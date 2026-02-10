// Vendor Sales Analytics Page — Ultra Premium Glovo/UberEats Style
// Next.js + TypeScript + Tailwind + shadcn
// File: app/vendor/sales-analytics/page.tsx

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChartHorizontal,
  LineChart,
  TrendingUp,
} from "lucide-react";

const PRIMARY = "#DC3173";
const GRADIENT = "linear-gradient(135deg, #FFE0ED, #FFFFFF)";
const SHADOW = "0px 8px 26px rgba(0,0,0,0.1)";

// Static dataset (Glovo-style sales analytics)
const SALES_OVERVIEW = {
  totalSales: 4231.6,
  bestDay: "Friday",
  worstDay: "Monday",
  avgDailySales: 604.5,
};

const WEEKLY_SALES = [
  { day: "Mon", value: 410 },
  { day: "Tue", value: 520 },
  { day: "Wed", value: 610 },
  { day: "Thu", value: 690 },
  { day: "Fri", value: 880 },
  { day: "Sat", value: 700 },
  { day: "Sun", value: 520 },
];

const TOP_ITEMS = [
  { name: "Chicken Burger", sales: 183 },
  { name: "Margherita Pizza", sales: 162 },
  { name: "Fresh Orange Juice", sales: 134 },
  { name: "Greek Salad", sales: 118 },
];

export default function VendorSalesAnalyticsPage() {
  const { t } = useTranslation();
  const maxValue = Math.max(...WEEKLY_SALES.map((d) => d.value));

  return (
    <div className="min-h-screen p-6 space-y-10">
      {/* HEADER */}
      <TitleHeader
        title={t("sales_analytics")}
        subtitle={t(
          "deep_insights_revenue_best_selling_items_performance_trends",
        )}
      />

      {/* SALES SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          style={{ background: GRADIENT, boxShadow: SHADOW }}
          className="rounded-3xl border"
        >
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">{t("total_sales")}</p>
              <h2
                className="text-4xl font-extrabold"
                style={{ color: PRIMARY }}
              >
                €{SALES_OVERVIEW.totalSales.toFixed(2)}
              </h2>
              <p className="text-xs text-gray-500 mt-2">{t("last_7_days")}</p>
            </div>
            <TrendingUp size={42} className="text-green-600" />
          </CardContent>
        </Card>

        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">
                {t("best_performing_day")}
              </p>
              <h2 className="text-3xl font-bold">{SALES_OVERVIEW.bestDay}</h2>
            </div>
            <ArrowUpRight size={42} className="text-green-600" />
          </CardContent>
        </Card>

        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">{t("slowest_day")}</p>
              <h2 className="text-3xl font-bold">{SALES_OVERVIEW.worstDay}</h2>
            </div>
            <ArrowDownRight size={42} className="text-red-600" />
          </CardContent>
        </Card>
      </div>

      {/* WEEKLY SALES GRAPH */}
      <Card className="rounded-3xl bg-white border shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <LineChart className="text-gray-600" />
            <h2 className="font-bold text-lg">{t("weekly_sales_trend")}</h2>
          </div>

          <div className="flex items-end gap-4 h-52">
            {WEEKLY_SALES.map((d, i) => {
              const height = Math.round((d.value / maxValue) * 180);
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ height: 4 }}
                    animate={{ height }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className="w-full rounded-t-xl"
                    style={{
                      background: "linear-gradient(180deg,#FF97C0,#FF5A92)",
                    }}
                  />
                  <div className="text-xs text-gray-600 mt-2">{d.day}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* TOP SELLING ITEMS */}
      <Card className="rounded-3xl bg-white border shadow-md">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <BarChartHorizontal className="text-gray-700" />
            <h2 className="font-bold text-lg">{t("top_selling_items")}</h2>
          </div>

          <Separator />

          <div className="space-y-4">
            {TOP_ITEMS.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-inner"
              >
                <span className="text-gray-800 font-medium">{item.name}</span>
                <span className="text-pink-600 font-bold">
                  {item.sales} {t("sold")}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FOOTNOTE */}
      <p className="text-center text-xs text-gray-500 pt-6">
        {t("data_based_on_last_7_days")}
      </p>
    </div>
  );
}
