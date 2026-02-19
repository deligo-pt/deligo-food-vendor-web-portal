"use client";

import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { TOrderTrends } from "@/src/types/analytics.type";
import { motion, Variants } from "framer-motion";
import {
  ArrowUpRightIcon,
  BarChart2Icon,
  ClockIcon,
  TrendingUpIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Formatter } from "recharts/types/component/DefaultTooltipContent";

interface IProps {
  orderTrends: TOrderTrends;
}

export default function OrderTrends({ orderTrends }: IProps) {
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
        title="Order Trends"
        subtitle="Volume analysis and peak times"
        extraComponent={
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <TrendingUpIcon className="w-4 h-4 text-[#DC3173]" />
            <span className="text-sm font-medium text-gray-600">
              Last 14 Days
            </span>
          </div>
        }
      />

      {/* Summary Hero */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 relative overflow-hidden"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-[#DC3173] to-[#e45a92] absolute top-0 left-0" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-[#DC3173]/10 text-[#DC3173]">
                <BarChart2Icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold tracking-wider text-gray-400 uppercase">
                Total Orders
              </span>
            </div>
            <div className="text-7xl font-bold text-[#DC3173]">
              {orderTrends.summary?.totalOrders}
            </div>
          </div>
          <div className="flex items-center gap-3 bg-green-50 px-5 py-3 rounded-2xl border border-green-100">
            <ArrowUpRightIcon className="w-6 h-6 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-700">
                {orderTrends.summary?.percentage}
              </div>
              <div className="text-sm text-green-600">Period Growth</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Daily Volume Chart */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <BarChart2Icon className="w-6 h-6 text-[#DC3173]" />
          <h2 className="text-xl font-bold text-gray-900">
            Daily Order Volume
          </h2>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={orderTrends.dailyVolume}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC3173" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#DC3173" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#6B7280",
                  fontSize: 11,
                }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#6B7280",
                }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
                }}
                formatter={
                  ((value: number) => [value, "Orders"]) as Formatter<
                    number,
                    "Orders"
                  >
                }
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#DC3173"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorOrders)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Peak Ordering Times */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <ClockIcon className="w-6 h-6 text-[#DC3173]" />
            <h2 className="text-xl font-bold text-gray-900">
              Peak Ordering Times
            </h2>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderTrends.peakOrderingTimes} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  vertical={true}
                  stroke="#E5E7EB"
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#6B7280",
                  }}
                  allowDecimals={false}
                />
                <YAxis
                  dataKey="time"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={55}
                  tick={{
                    fill: "#6B7280",
                  }}
                />
                <Tooltip
                  cursor={{
                    fill: "#F9FAFB",
                  }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
                  }}
                  formatter={
                    ((value: number) => [value, "Orders"]) as Formatter<
                      number,
                      "Orders"
                    >
                  }
                />
                <Bar
                  dataKey="orderCount"
                  fill="#DC3173"
                  radius={[0, 6, 6, 0]}
                  barSize={22}
                  animationDuration={1200}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Growth */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUpIcon className="w-6 h-6 text-[#DC3173]" />
            <h2 className="text-xl font-bold text-gray-900">Category Growth</h2>
          </div>
          <div className="space-y-6">
            {orderTrends.categoryGrowth?.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 truncate pr-2">
                    {item.category}
                  </span>
                  <span className="text-sm font-bold text-[#DC3173] flex-shrink-0">
                    {item.percentage}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-[#DC3173] to-[#e45a92] h-2 rounded-full"
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${item.percentage}%`,
                    }}
                    transition={{
                      duration: 1,
                      delay: index * 0.1,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
