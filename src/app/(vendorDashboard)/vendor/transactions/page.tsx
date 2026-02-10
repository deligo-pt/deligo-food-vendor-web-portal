"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  Search,
  Wallet,
} from "lucide-react";

// Mock transactions
const STATIC_TRANSACTIONS = [
  {
    id: "T-2401",
    type: "payout",
    amount: 84.5,
    date: "2025-11-08",
    description: "Weekly Payout (SEPA)",
  },
  {
    id: "T-2402",
    type: "order",
    amount: 12.9,
    date: "2025-11-08",
    description: "Order #DG-9031 Completed",
  },
  {
    id: "T-2403",
    type: "fee",
    amount: -2.5,
    date: "2025-11-07",
    description: "Platform Service Fee",
  },
  {
    id: "T-2404",
    type: "order",
    amount: 19.4,
    date: "2025-11-07",
    description: "Order #DG-9022 Completed",
  },
  {
    id: "T-2405",
    type: "refund",
    amount: -8.0,
    date: "2025-11-06",
    description: "Order Refund Processed",
  },
];

export default function VendorTransactionsHistory() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = STATIC_TRANSACTIONS.filter((t) => {
    const matchQuery =
      query.length === 0 ||
      t.description.toLowerCase().includes(query.toLowerCase()) ||
      t.id.toLowerCase().includes(query.toLowerCase());
    const matchFilter = filter === "all" ? true : t.type === filter;
    return matchQuery && matchFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ArrowUpRight className="text-green-600" size={22} />;
      case "payout":
        return <ArrowDownLeft className="text-blue-600" size={22} />;
      case "fee":
        return <ArrowDownLeft className="text-red-600" size={22} />;
      case "refund":
        return <ArrowDownLeft className="text-amber-600" size={22} />;
      default:
        return <Receipt className="text-gray-600" size={22} />;
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-10">
      {/* HEADER */}
      <TitleHeader
        title={t("transaction_history")}
        subtitle={t("full_breakdown_of_earnings_payouts_fees")}
      />

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            placeholder={t("search_transactions")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>

        {/* Type Filter */}
        <Select onValueChange={setFilter} defaultValue="all">
          <SelectTrigger className="w-48 bg-white">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            <SelectItem value="order">{t("orders")}</SelectItem>
            <SelectItem value="payout">{t("payouts")}</SelectItem>
            <SelectItem value="fee">{t("fees")}</SelectItem>
            <SelectItem value="refund">{t("refunds")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* LIST */}
      <div className="space-y-5">
        <AnimatePresence>
          {filtered.map((trx) => (
            <motion.div
              key={trx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 160, damping: 20 }}
            >
              <Card className="rounded-3xl bg-white border shadow-md hover:shadow-xl transition-all">
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-pink-50 shadow-sm">
                      {getIcon(trx.type)}
                    </div>

                    <div>
                      <h2 className="text-base font-semibold text-gray-800">
                        {trx.description}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">{trx.date}</p>
                    </div>
                  </div>

                  {/* RIGHT — AMOUNT */}
                  <div className="text-right">
                    <div
                      className={`text-xl font-bold ${
                        trx.amount >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {trx.amount >= 0 ? "+" : ""}€{trx.amount.toFixed(2)}
                    </div>
                    <p className="text-xs text-gray-400">
                      {t("id")}: {trx.id}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500 text-sm">
            {t("no_transactions_found")}
          </div>
        )}
      </div>

      {/* SUMMARY BOX */}
      <Card className="rounded-3xl bg-white border shadow-md mt-10">
        <CardContent className="p-6 space-y-3">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Wallet className="text-gray-700" /> {t("summary")}
          </h2>

          <Separator />

          <ul className="text-sm text-gray-600 space-y-2">
            <li>• {t("positive_values_revenue_from_orders")}</li>
            <li>• {t("negative_values_fees_adjustments_refunds")}</li>
            <li>• {t("weekly_sepa_cycle_portugal")}</li>
            <li>• {t("refunds_may_take_24_48_hours")}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
