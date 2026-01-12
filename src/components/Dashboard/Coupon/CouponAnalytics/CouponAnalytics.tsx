"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/src/hooks/use-translation";
import { TCouponAnalytics } from "@/src/types/coupon.type";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Flame, Percent } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0 6px 20px rgba(0,0,0,0.06)";

interface IProps {
  couponsAnalyticsResult: TCouponAnalytics;
}

export default function CouponAnalytics({ couponsAnalyticsResult }: IProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[1200px] mx-auto space-y-12">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              {t("coupon_analytics")}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {t("performance_insights_all_active_past_coupon")}
            </p>
          </div>

          {/* <Button className="text-white" style={{ background: PRIMARY }}>
            Export Report
          </Button> */}
        </div>

        {/* CHART PLACEHOLDER */}
        <Card
          className="rounded-3xl bg-white border shadow-md"
          style={{ height: "280px" }}
        >
          <CardContent className="flex items-center justify-center h-full text-gray-500">
            {couponsAnalyticsResult?.coupons?.length > 0 ? <ResponsiveContainer width="100%" height="100%">
              <BarChart data={couponsAnalyticsResult?.monthlyAnalysis}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip cursor={{ display: "none" }} />
                <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
              </BarChart>
            </ResponsiveContainer> : <p className="text-center text-gray-500 py-10">{t("no_analytics_found")}</p>}
          </CardContent>
        </Card>

        {/* COUPON LIST */}
        <div className="space-y-6">
          {couponsAnalyticsResult?.coupons?.map((c, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card
                className="rounded-3xl bg-white border shadow-md hover:shadow-xl transition-all"
                style={{ boxShadow: SHADOW }}
              >
                <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-6">
                  {/* LEFT */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600">
                      {c.discountType === "PERCENT" && <Percent size={28} />}
                      {c.discountType === "FLAT" && <Flame size={28} />}
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {c.couponCode}
                      </h2>

                      <div className="flex items-center gap-3 text-sm mt-2 text-gray-600">
                        <Badge variant="outline">
                          {t("usage")}: {c.totalCustomerUsage}
                        </Badge>
                        {/* <span className="flex items-center gap-1 text-green-600 font-semibold">
                          <TrendingUp size={16} /> {c.}% boost
                        </span> */}
                      </div>

                      <div className="mt-3">
                        <p className="text-sm text-gray-500">
                          {t("top_items_influenced")}:
                        </p>
                        <ul className="text-sm list-disc pl-5 text-gray-700">
                          {c.topItemsInfluenced.map((i, k) => (
                            <li key={k}>{i.name}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right md:min-w-[220px]">
                    <p className="text-sm text-gray-500">{t("revenue_impact")}</p>

                    {c.revenueImpact >= 0 ? (
                      <p className="text-3xl font-bold text-green-600 flex items-center justify-end gap-1">
                        <ArrowUpRight size={20} /> €{c.revenueImpact}
                      </p>
                    ) : (
                      <p className="text-3xl font-bold text-red-600 flex items-center justify-end gap-1">
                        <ArrowDownLeft size={20} /> €{c.revenueImpact}
                      </p>
                    )}

                    {/* <Button variant="outline" className="mt-4 w-full">
                      View Details
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI INSIGHTS */}
        {/* <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-gray-800" />
              <h2 className="font-bold text-lg">AI Insights</h2>
            </div>
            <Separator />

            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>B1G1 offers produce highest customer engagement.</li>
              <li>Percentage discounts perform best during dinner hours.</li>
              <li>
                Flat discounts help increase conversion on low basket orders.
              </li>
              <li>Coupons ending soon should be pushed via banners.</li>
            </ul>

            <Button className="text-white" style={{ background: PRIMARY }}>
              Optimize Coupons
            </Button>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
