// FULL & COMPLETE — PREMIUM Glovo-Style Vendor Payouts Page
// Next.js + TypeScript + Tailwind + shadcn
// File: app/vendor/payouts/page.tsx

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  BarChart3,
  CalendarClock,
  History,
  TrendingUp,
  Wallet,
} from "lucide-react";

const PRIMARY = "#DC3173";
const GRADIENT = "linear-gradient(135deg, #FFD4E7, #FFFFFF)";
const SHADOW = "0 8px 28px rgba(0,0,0,0.08)";

// STATIC MOCK PAYOUTS (Portugal Glovo-style)
const PAYOUTS = [
  {
    id: "P-1001",
    amount: 84.5,
    date: "2025-11-08",
    status: "completed",
    method: "Bank Transfer (SEPA)",
    iban: "PT50 0002 0123 5678 9011 22",
  },
  {
    id: "P-1002",
    amount: 42.8,
    date: "2025-11-05",
    status: "processing",
    method: "Bank Transfer (SEPA)",
    iban: "PT50 0002 0123 5678 9011 22",
  },
  {
    id: "P-1003",
    amount: 128.1,
    date: "2025-10-30",
    status: "completed",
    method: "Bank Transfer (SEPA)",
    iban: "PT50 0002 0123 5678 9011 22",
  },
];

export default function VendorPayoutsPagePremium() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>("all");

  const filteredPayouts = PAYOUTS.filter((p) =>
    filter === "all" ? true : p.status === filter,
  );

  const statusColor = (status: string) => {
    if (status === "completed") return "bg-green-100 text-green-700";
    if (status === "processing") return "bg-amber-100 text-amber-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen p-6 space-y-10">
      {/* HEADER */}
      <TitleHeader
        title={t("vendor_payouts")}
        subtitle={t("earnings_balance_payout")}
      />

      {/* TOP ANALYTICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AVAILABLE BALANCE */}
        <Card
          className="rounded-3xl border"
          style={{ background: GRADIENT, boxShadow: SHADOW }}
        >
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">{t("available_balance")}</p>
              <h2
                className="text-4xl font-extrabold mt-1"
                style={{ color: PRIMARY }}
              >
                €247.40
              </h2>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <CalendarClock size={14} /> {t("weekly_payout_every_monday")}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white shadow-inner">
              <Wallet size={42} className="text-pink-600" />
            </div>
          </CardContent>
        </Card>

        {/* COMPLETED PAYOUTS */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">{t("payout_completed")}</p>
              <h2 className="text-3xl font-bold mt-1">€212.60</h2>
            </div>
            <TrendingUp className="text-green-600" size={36} />
          </CardContent>
        </Card>

        {/* PROCESSING */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">{t("processing")}</p>
              <h2 className="text-3xl font-bold mt-1">€42.80</h2>
            </div>
            <BarChart3 className="text-amber-600" size={36} />
          </CardContent>
        </Card>
      </div>

      {/* FILTER */}
      <div className="flex justify-between items-center">
        <Select onValueChange={(v) => setFilter(v)}>
          <SelectTrigger className="w-40 bg-white">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            <SelectItem value="completed">{t("completed")}</SelectItem>
            <SelectItem value="processing">{t("processing")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* PAYOUT LIST */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredPayouts.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 160, damping: 18 }}
            >
              <Card className="rounded-3xl bg-white border shadow-md hover:shadow-xl transition-all">
                <CardContent className="p-0 flex justify-between items-center">
                  {/* LEFT */}
                  <div className="p-6 flex items-center gap-5">
                    <div className="p-4 rounded-2xl bg-pink-50 shadow-sm">
                      {p.status === "completed" ? (
                        <ArrowUpRight size={30} className="text-green-600" />
                      ) : (
                        <ArrowDownLeft size={30} className="text-amber-600" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold">
                        €{p.amount.toFixed(2)}
                      </h3>
                      <p className="text-sm text-gray-600">{p.method}</p>
                      <p className="text-xs text-gray-400 mt-1">{p.iban}</p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right p-6">
                    <Badge className={statusColor(p.status)}>{p.status}</Badge>
                    <p className="text-sm text-gray-500 mt-2">{p.date}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredPayouts.length === 0 && (
          <p className="text-center text-gray-500 py-10 text-sm">
            {t("no_payouts_found")}
          </p>
        )}
      </div>

      {/* PORTUGAL RULES */}
      <Card className="rounded-3xl bg-white border shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <History size={18} className="text-gray-700" />
            <h2 className="font-bold text-lg">{t("portugal_payment_rules")}</h2>
          </div>

          <Separator className="my-3" />

          <ul className="text-sm text-gray-600 space-y-2">
            <li>• {t("automatic_weekly_payout")}.</li>
            <li>• {t("iva_handled_per_portuguese_tax")}.</li>
            <li>
              • {t("minimum_payout_threshold")}: <strong>{t("euro_20")}</strong>
              . {t("balances_below_roll_next_cycle")}.
            </li>
            <li>
              • {t("typical_bank_transfer_time")}:{" "}
              <strong>{t("hours_24_48")}</strong>.
            </li>
            <li>• {t("instant_payouts_fees_may_apply")}.</li>
            <li>• {t("payouts_sent_to_registered_iban")}.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
