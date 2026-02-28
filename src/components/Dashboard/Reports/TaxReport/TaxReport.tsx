"use client";

import AnalyticsChart from "@/src/components/AnalyticsChart/AnalyticsChart";
import StatsCard from "@/src/components/StatsCard/StatsCard";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { motion } from "framer-motion";
import { EuroIcon, FileText, PieChart, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const revenueData = [
  {
    name: "Jan",
    revenue: 3200,
    tax: 420,
  },
  {
    name: "Feb",
    revenue: 3800,
    tax: 510,
  },
  {
    name: "Mar",
    revenue: 3500,
    tax: 465,
  },
  {
    name: "Apr",
    revenue: 4200,
    tax: 560,
  },
  {
    name: "May",
    revenue: 4800,
    tax: 640,
  },
  {
    name: "Jun",
    revenue: 5080,
    tax: 650,
  },
];

const taxContributionData = [
  { name: "Product", value: 33.6 },
  { name: "Addon", value: 66.4 },
];

const addonTaxData = [
  {
    name: "Extra Cheese",
    tax: 245,
  },
  {
    name: "Garlic Bread",
    tax: 189,
  },
  {
    name: "Extra Sauce",
    tax: 156,
  },
  {
    name: "Mushrooms",
    tax: 134,
  },
  {
    name: "Jalapeños",
    tax: 98,
  },
];

export default function TaxReport() {
  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <TitleHeader
        title="Tax Report"
        subtitle="Detailed tax breakdown for products and addons"
      />

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Gross Sales"
          value="€24,580.00"
          icon={EuroIcon}
          delay={0}
        />
        <StatsCard
          title="Total Tax Liability"
          value="€3,245.60"
          icon={FileText}
          delay={0.1}
        />
        <StatsCard
          title="Net Revenue"
          value="€21,334.40"
          icon={TrendingUp}
          delay={0.2}
        />
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Tax Contribution */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.4,
          }}
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-md"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <TrendingUp size={18} />
            </div>
            <h3 className="text-sm font-medium text-gray-500">
              Tax Contribution
            </h3>
          </div>
          <AnalyticsChart
            data={taxContributionData}
            dataKey="value"
            height={180}
            type="pie"
          />
          <div className="flex justify-between text-xs mt-2 px-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#DC3173]" />
              <span className="text-gray-600">Product</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#2563eb]" />
              <span className="text-gray-600">Addon</span>
            </div>
          </div>
        </motion.div>

        {/* Tax by Category */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
          }}
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-md col-span-2"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <PieChart size={18} />
            </div>
            <h3 className="text-sm font-medium text-gray-500">
              Tax by Category
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-gray-600">6% Rate</span>
                <span className="font-bold text-gray-900">€420.00</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[15%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-gray-600">10% Rate</span>
                <span className="font-bold text-gray-900">€1,185.60</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[35%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-gray-600">23% Rate</span>
                <span className="font-bold text-gray-900">€1,640.00</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#DC3173] w-[50%]" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue vs Tax Chart */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.5,
          }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-md p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Revenue vs Tax Over Time
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  itemStyle={{
                    color: "#fff",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue (€)"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="tax"
                  name="Tax (€)"
                  stroke="#DC3173"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Addons Chart */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.6,
          }}
          className="bg-white rounded-2xl border border-gray-100 shadow-md p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Top Tax-Generating Addons
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={addonTaxData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  horizontal={false}
                />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  stroke="#64748b"
                  fontSize={11}
                />
                <Tooltip
                  cursor={{
                    fill: "#f8fafc",
                  }}
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar
                  dataKey="tax"
                  name="Tax (€)"
                  fill="#DC3173"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
