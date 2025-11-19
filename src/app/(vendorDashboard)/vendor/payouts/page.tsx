// FULL & COMPLETE — PREMIUM Glovo-Style Vendor Payouts Page
// Next.js + TypeScript + Tailwind + shadcn
// File: app/vendor/payouts/page.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Download,
  BarChart3,
  History,
  TrendingUp,
  CalendarClock,
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
  const [filter, setFilter] = useState<string>("all");

  const filteredPayouts = PAYOUTS.filter((p) =>
    filter === "all" ? true : p.status === filter
  );

  const statusColor = (status: string) => {
    if (status === "completed") return "bg-green-100 text-green-700";
    if (status === "processing") return "bg-amber-100 text-amber-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen p-6 md:p-10 bg-[#FFF1F7]">
      <div className="max-w-[1200px] mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: PRIMARY }}>
              Vendor Payouts
            </h1>
            <p className="text-gray-600 mt-1 text-sm">Earnings, balance & payout history</p>
          </div>

          <Button className="flex items-center gap-2 text-white" style={{ background: PRIMARY }}>
            <Download size={18} /> Export CSV
          </Button>
        </div>

        {/* TOP ANALYTICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* AVAILABLE BALANCE */}
          <Card
            className="rounded-3xl border"
            style={{ background: GRADIENT, boxShadow: SHADOW }}
          >
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Available Balance</p>
                <h2 className="text-4xl font-extrabold mt-1" style={{ color: PRIMARY }}>
                  €247.40
                </h2>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <CalendarClock size={14} /> Weekly payout every Monday
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
                <p className="text-gray-600 text-sm">Payouts Completed</p>
                <h2 className="text-3xl font-bold mt-1">€212.60</h2>
              </div>
              <TrendingUp className="text-green-600" size={36} />
            </CardContent>
          </Card>

          {/* PROCESSING */}
          <Card className="rounded-3xl bg-white border shadow-md">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Processing</p>
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
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
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
                        <h3 className="text-xl font-bold">€{p.amount.toFixed(2)}</h3>
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
            <p className="text-center text-gray-500 py-10 text-sm">No payouts found.</p>
          )}
        </div>

        {/* PORTUGAL RULES */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <History size={18} className="text-gray-700" />
              <h2 className="font-bold text-lg">Portugal Payment Rules</h2>
            </div>

            <Separator className="my-3" />

            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Automatic weekly SEPA payout every Monday.</li>
              <li>• IVA (VAT) handled per Portuguese tax rules and already applied where required.</li>
              <li>• Minimum payout threshold: <strong>€20</strong>. Balances below this will roll to next cycle.</li>
              <li>• Typical bank transfer time: <strong>24–48 hours</strong>.</li>
              <li>• For instant payouts (if enabled), fees may apply — check Finance settings.</li>
              <li>• Payouts are sent to your registered IBAN. Update bank details in Settings  Finance.</li>
            </ul>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
