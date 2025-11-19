"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  Calendar,
  TrendingUp,
  TrendingDown,
  Download,
  ShoppingBag,
  PieChart,
  Euro,
} from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0 6px 20px rgba(0,0,0,0.06)";

// Mock Data
const REPORT = {
  totalSales: 12840.75,
  totalOrders: 1842,
  avgOrderValue: 14.2,
  topCategory: "Burgers",
  growth: +12,
  decline: -4,
};

const DAILY = [12, 16, 10, 22, 28, 24, 30];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function VendorSalesReport() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[1200px] mx-auto space-y-12">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              Sales Report
            </h1>
            <p className="text-gray-600 text-sm mt-1">Detailed revenue & performance analytics</p>
          </div>

          <Button className="text-white flex items-center gap-2" style={{ background: PRIMARY }}>
            <Download size={18} /> Export CSV
          </Button>
        </div>

        {/* DATE FILTER */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="text-sm font-medium text-gray-700">From</label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-12 mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">To</label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-12 mt-1" />
            </div>
            <Button className="h-12 text-white" style={{ background: PRIMARY }}>
              <Calendar size={18} /> Apply Filter
            </Button>
          </CardContent>
        </Card>

        {/* TOP SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[{
            label: "Total Sales",
            value: `€${REPORT.totalSales.toLocaleString()}`,
            icon: <Euro size={26} className="text-pink-600" />
          },{
            label: "Total Orders",
            value: REPORT.totalOrders,
            icon: <ShoppingBag size={26} className="text-blue-600" />
          },{
            label: "Avg Order Value",
            value: `€${REPORT.avgOrderValue}`,
            icon: <PieChart size={26} className="text-green-600" />
          },{
            label: "Top Category",
            value: REPORT.topCategory,
            icon: <BarChart3 size={26} className="text-amber-600" />
          }].map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className="rounded-3xl bg-white border shadow-md hover:shadow-xl transition-all" style={{ boxShadow: SHADOW }}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-2xl bg-gray-100">{item.icon}</div>
                    <h3 className="text-lg font-bold text-gray-700">{item.label}</h3>
                  </div>
                  <p className="text-3xl font-extrabold text-gray-900">{item.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* WEEKLY SALES GRAPH (Placeholder) */}
        <Card className="rounded-3xl bg-white border shadow-md" style={{ height: "300px" }}>
          <CardContent className="h-full p-6 flex flex-col justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
              <BarChart3 /> Weekly Sales Overview
            </h2>

            {/* SIMPLE BAR CHART */}
            <div className="flex items-end justify-between h-full pb-4">
              {DAILY.map((v, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="w-8 rounded-xl"
                    style={{ height: `${v * 6}px`, background: PRIMARY, opacity: 0.85 }}
                  ></div>
                  <p className="text-xs text-gray-500 mt-2">{DAYS[i]}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* GROWTH SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-3xl bg-white border shadow-md p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-green-700">
              <TrendingUp /> Growth Insight
            </h2>
            <Separator className="my-4" />
            <p className="text-3xl font-bold text-green-600">+{REPORT.growth}%</p>
            <p className="text-gray-600 mt-2 text-sm">Your restaurant sales increased this period.</p>
          </Card>

          <Card className="rounded-3xl bg-white border shadow-md p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-red-700">
              <TrendingDown /> Decline Insight
            </h2>
            <Separator className="my-4" />
            <p className="text-3xl font-bold text-red-600">{REPORT.decline}%</p>
            <p className="text-gray-600 mt-2 text-sm">Certain items performed lower than usual.</p>
          </Card>
        </div>

        {/* AI INSIGHTS */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-3">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <BarChart3 className="text-gray-800" /> AI Sales Insights
            </h2>
            <Separator />

            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>Burger category drove most evening orders.</li>
              <li>Friday & Saturday show highest peak in weekly revenue.</li>
              <li>Average order value increased due to combo offers.</li>
              <li>Decline in drinks suggests increasing stock or improving visibility.</li>
            </ul>

            <Button className="text-white mt-2" style={{ background: PRIMARY }}>
              View Full Sales Breakdown
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
