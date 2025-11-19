"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LineChart,
  TrendingUp,
  Activity,
  Clock,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
} from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const GRADIENT = "linear-gradient(135deg,#FFE0ED,#FFFFFF)";

// Mock Trends Data
const DAILY_ORDERS = [12, 20, 18, 25, 28, 34, 32, 30, 40, 44, 50, 48, 55, 58];
const PEAK_TIMES = [
  { hour: "10 AM", orders: 32 },
  { hour: "1 PM", orders: 54 },
  { hour: "7 PM", orders: 78 },
  { hour: "9 PM", orders: 60 },
];
const CATEGORY_TRENDS = [
  { name: "Burgers", pct: 32 },
  { name: "Pizzas", pct: 27 },
  { name: "Drinks", pct: 18 },
  { name: "Desserts", pct: 12 },
];

export default function VendorOrderTrends() {
  const maxOrders = Math.max(...DAILY_ORDERS);

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[1200px] mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              Order Trends
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Trend analysis of orders over time — peaks, categories & volume
            </p>
          </div>
          <Button className="text-white" style={{ background: PRIMARY }}>
            Export Trends
          </Button>
        </div>

        {/* TOTAL TREND CARD */}
        <Card style={{ background: GRADIENT }} className="rounded-3xl border shadow-md">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Last 14 Days Order Trend</p>
              <h2 className="text-4xl font-extrabold mt-1" style={{ color: PRIMARY }}>
                {DAILY_ORDERS.reduce((a, b) => a + b, 0)} orders
              </h2>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                <TrendingUp className="text-green-600" size={16} /> +12% vs last 14 days
              </p>
            </div>
            <Activity size={48} className="text-pink-600" />
          </CardContent>
        </Card>

        {/* DAILY ORDER LINE GRAPH */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <LineChart className="text-gray-700" />
              <h2 className="font-bold text-lg">Daily Order Volume</h2>
            </div>

            <div className="flex items-end gap-4 h-56">
              {DAILY_ORDERS.map((value, i) => {
                const height = Math.round((value / maxOrders) * 200);
                return (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      className="w-full rounded-t-xl"
                      style={{ background: "linear-gradient(180deg,#FF7BAB,#FF3975)" }}
                    />
                    <span className="text-[10px] text-gray-500 mt-2">D{i + 1}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* PEAK ORDER TIMES */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Clock className="text-gray-700" />
              <h2 className="font-bold text-lg">Peak Ordering Times</h2>
            </div>

            <Separator />

            <div className="space-y-4">
              {PEAK_TIMES.map((t, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-inner">
                  <span className="text-gray-800 font-medium">{t.hour}</span>
                  <span className="text-pink-600 font-bold">{t.orders} orders</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CATEGORY TRENDS */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="text-gray-700" />
              <h2 className="font-bold text-lg">Category Growth</h2>
            </div>

            <div className="space-y-4">
              {CATEGORY_TRENDS.map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {cat.pct > 20 ? (
                      <ArrowUpRight className="text-green-600" />
                    ) : (
                      <ArrowDownRight className="text-red-600" />
                    )}
                    <span className="text-gray-900 font-medium">{cat.name}</span>
                  </div>

                  <div className="w-40 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.pct}%` }}
                      transition={{ duration: 0.7 }}
                      className="h-full rounded-full"
                      style={{ background: PRIMARY }}
                    />
                  </div>

                  <span className="text-sm font-semibold text-gray-700">{cat.pct}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* RECOMMENDATION */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="text-gray-800" />
              <h2 className="font-bold text-lg">AI Order Trend Insights</h2>
            </div>

            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
              <li>Promote pizza category on weekends — strongest upward trend.</li>
              <li>Boost ad budget around 7 PM — highest order spike.</li>
              <li>Offer combo deals on slow days (Tue–Thu) to increase conversions.</li>
              <li>Introduce new drinks — category gaining stable weekly growth.</li>
            </ul>

            <div className="flex gap-3 pt-3">
              <Button className="text-white" style={{ background: PRIMARY }}>Create Campaign</Button>
              <Button variant="outline">Export Data</Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
