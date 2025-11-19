// Vendor Sales Analytics Page — Ultra Premium Glovo/UberEats Style
// Next.js + TypeScript + Tailwind + shadcn
// File: app/vendor/sales-analytics/page.tsx

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  BarChartHorizontal,
  ChartLine,
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
  const maxValue = Math.max(...WEEKLY_SALES.map((d) => d.value));

  return (
    <div className="min-h-screen p-6 md:p-10 bg-[#FFF1F7]">
      <div className="max-w-[1200px] mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              Sales Analytics
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Deep insights into revenue, best-selling items & performance trends
            </p>
          </div>

          <Button style={{ background: PRIMARY }} className="text-white flex items-center gap-2">
            <ChartLine size={18} /> Export Report
          </Button>
        </div>

        {/* SALES SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card style={{ background: GRADIENT, boxShadow: SHADOW }} className="rounded-3xl border">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Total Sales</p>
                <h2 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
                  €{SALES_OVERVIEW.totalSales.toFixed(2)}
                </h2>
                <p className="text-xs text-gray-500 mt-2">Last 7 days</p>
              </div>
              <TrendingUp size={42} className="text-green-600" />
            </CardContent>
          </Card>

          <Card className="rounded-3xl bg-white border shadow-md">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Best Performing Day</p>
                <h2 className="text-3xl font-bold">{SALES_OVERVIEW.bestDay}</h2>
              </div>
              <ArrowUpRight size={42} className="text-green-600" />
            </CardContent>
          </Card>

          <Card className="rounded-3xl bg-white border shadow-md">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Slowest Day</p>
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
              <h2 className="font-bold text-lg">Weekly Sales Trend</h2>
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
                      style={{ background: "linear-gradient(180deg,#FF97C0,#FF5A92)" }}
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
              <h2 className="font-bold text-lg">Top Selling Items</h2>
            </div>

            <Separator />

            <div className="space-y-4">
              {TOP_ITEMS.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-inner">
                  <span className="text-gray-800 font-medium">{item.name}</span>
                  <span className="text-pink-600 font-bold">{item.sales} sold</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FOOTNOTE */}
        <p className="text-center text-xs text-gray-500 pt-6">
          Data based on last 7 days | Updated automatically 
        </p>
      </div>
    </div>
  );
}