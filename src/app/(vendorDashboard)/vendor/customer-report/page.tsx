

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import {
  Users,
  Search,

  BarChart3,
  Star,
  Euro,
  UserRound,
  Clock3,
  Download,
} from "lucide-react";
import { useTranslation } from "@/src/hooks/use-translation";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0 6px 20px rgba(0,0,0,0.06)";

// STATIC MOCK DATA
const CUSTOMERS = [
  {
    id: "C1",
    name: "Rafi Ahmed",
    orders: 42,
    totalSpent: 329.5,
    lastOrder: "2025-11-10",
    rating: 4.8,
  },
  {
    id: "C2",
    name: "Sadia Khan",
    orders: 18,
    totalSpent: 140.2,
    lastOrder: "2025-11-06",
    rating: 4.6,
  },
  {
    id: "C3",
    name: "Imran H",
    orders: 9,
    totalSpent: 62.3,
    lastOrder: "2025-11-01",
    rating: 4.2,
  },
  {
    id: "C4",
    name: "Maria Silva",
    orders: 67,
    totalSpent: 502.8,
    lastOrder: "2025-11-09",
    rating: 4.9,
  },
];

export default function CustomerReportPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const filtered = CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[1200px] mx-auto space-y-12">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-4xl font-extrabold tracking-tight"
              style={{ color: PRIMARY }}
            >
              {t("customer_report")}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {t("see_customer_trends_spending_behaviour")}
            </p>
          </div>

          <Button className="flex items-center gap-2 text-white" style={{ background: PRIMARY }}>
            <Download size={18} /> {t("export_csv")}
          </Button>
        </div>

        {/* OVERVIEW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[{
            label: t("total_customers"),
            value: CUSTOMERS.length,
            icon: <Users size={28} className="text-pink-600" />,
          }, {
            label: t("avg_rating"),
            value: (
              CUSTOMERS.reduce((a, b) => a + b.rating, 0) / CUSTOMERS.length
            ).toFixed(1),
            icon: <Star size={28} className="text-yellow-500" />,
          }, {
            label: t("highest_spender"),
            value: CUSTOMERS.sort((a, b) => b.totalSpent - a.totalSpent)[0].name,
            icon: <Euro size={28} className="text-green-600" />,
          }, {
            label: t("most_orders"),
            value: CUSTOMERS.sort((a, b) => b.orders - a.orders)[0].name,
            icon: <BarChart3 size={28} className="text-blue-600" />,
          }].map((d, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
            >
              <Card
                className="rounded-3xl bg-white border shadow-md hover:shadow-xl transition-all"
                style={{ boxShadow: SHADOW }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-gray-100 rounded-2xl">{d.icon}</div>
                    <h3 className="font-bold text-gray-700">{d.label}</h3>
                  </div>
                  <p className="text-3xl font-extrabold">{d.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* SEARCH */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <Input
            placeholder={t("search_customer")}
            className="pl-10 h-12"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* CUSTOMER LIST */}
        <div className="space-y-4">
          {filtered.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Card className="rounded-3xl bg-white border shadow-md hover:shadow-xl transition-all" style={{ boxShadow: SHADOW }}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center text-xl font-bold" style={{ color: PRIMARY }}>
                      {c.name[0]}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold">{c.name}</h3>

                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <UserRound size={14} /> {c.orders} {t("orders")}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Euro size={14} /> €{c.totalSpent.toFixed(2)} {t("total_spent")}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock3 size={14} /> {t("last_order")}: {c.lastOrder}
                      </p>
                    </div>
                  </div>

                  {/* RATING */}
                  <div className="flex items-center gap-1 bg-gray-100 px-4 py-2 rounded-full">
                    <Star size={18} className="text-yellow-500" />
                    <span className="text-lg font-bold">{c.rating}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-10">{t("no_customers_found")}</p>
          )}
        </div>

        {/* AI INSIGHTS */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
              <Users size={20} /> {t("ai_customer_insights")}
            </h2>
            <Separator />

            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>{t("customers_with_orders_per_month")}</li>
              <li>{t("top_spenders_usually_order")}</li>
              <li>{t("high_rated_customers_reorder")}</li>
              <li>{t("weekend_offers_boost_returning")}</li>
            </ul>

            <Button className="text-white" style={{ background: PRIMARY }}>
              {t("view_full_customer_breakdown")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}