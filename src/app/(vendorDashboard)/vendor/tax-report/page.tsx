

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  FileSpreadsheet,
  Euro,
  Percent,
  Calculator,
  ArrowDownRight,
  Download,
  Landmark,
  Receipt,
} from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0 6px 20px rgba(0,0,0,0.06)";

// MOCK TAX DATA (Portugal TVDE/Restaurant Logic)
const TAX_DATA = {
  totalRevenue: 14892.4,
  platformCommission: 2233.8,
  ivaVendorRate: 6,
  ivaPlatformRate: 23,
  vendorIVA: 893.54,
  platformIVA: 514.27,
  netPayout: 11800.59,
};

export default function VendorTaxReportPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[1200px] mx-auto space-y-12">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              Tax Report (IVA Breakdown)
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Portugal-compliant IVA calculation report for vendors
            </p>
          </div>

          <Button className="flex items-center gap-2 text-white" style={{ background: PRIMARY }}>
            <Download size={18} /> Export Tax Report
          </Button>
        </div>

        {/* DATE FILTER */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="text-sm font-medium text-gray-700">From</label>
              <Input type="date" className="mt-1 h-12" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">To</label>
              <Input type="date" className="mt-1 h-12" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <Button className="h-12 text-white" style={{ background: PRIMARY }}>
              <FileSpreadsheet size={18} /> Apply
            </Button>
          </CardContent>
        </Card>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              label: "Total Revenue",
              value: `€${TAX_DATA.totalRevenue.toLocaleString()}`,
              icon: <Euro size={26} className="text-pink-600" />,
            },
            {
              label: "Commission Charged",
              value: `€${TAX_DATA.platformCommission.toLocaleString()}`,
              icon: <Percent size={26} className="text-blue-600" />,
            },
            {
              label: "Vendor IVA (6%)",
              value: `€${TAX_DATA.vendorIVA.toLocaleString()}`,
              icon: <Calculator size={26} className="text-green-600" />,
            },
            {
              label: "Platform IVA (23%)",
              value: `€${TAX_DATA.platformIVA.toLocaleString()}`,
              icon: <Receipt size={26} className="text-amber-600" />,
            },
          ].map((d, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className="rounded-3xl bg-white border shadow-md hover:shadow-xl transition-all" style={{ boxShadow: SHADOW }}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-2xl bg-gray-100">{d.icon}</div>
                    <h3 className="font-bold text-gray-700">{d.label}</h3>
                  </div>
                  <p className="text-3xl font-extrabold">{d.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* NET PAYOUT */}
        <Card className="rounded-3xl bg-white border shadow-md" style={{ boxShadow: SHADOW }}>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
              <Landmark size={22} /> Net Payout After Taxes
            </h2>
            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <p className="text-4xl font-extrabold text-gray-900">
                €{TAX_DATA.netPayout.toLocaleString()}
              </p>
              <ArrowDownRight size={42} className="text-red-500 opacity-80" />
            </div>

            <p className="text-gray-600 text-sm mt-3">
              This is the final payout after applying platform commission & IVA.
            </p>
          </CardContent>
        </Card>

        {/* BREAKDOWN SECTION */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
              <Receipt size={20} /> Detailed Breakdown
            </h2>
            <Separator />

            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Vendor collects revenue and pays <strong>6% IVA</strong> on food sales.</li>
              <li>• Platform commission has its own <strong>23% IVA</strong> (Portugal law).</li>
              <li>• Net payout automatically excludes IVA obligations.</li>
              <li>• Commission is calculated before VAT deduction.</li>
            </ul>
          </CardContent>
        </Card>

        {/* AI INSIGHTS */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
              <Calculator size={20} /> AI Tax Insights
            </h2>
            <Separator />
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>Your IVA % is consistent with Portuguese restaurant tax rules.</li>
              <li>Commission IVA slightly increased due to higher weekend sales.</li>
              <li>Avoid running too many discounts — reduces net taxable revenue.</li>
              <li>Higher order volume = lower per-order tax pressure.</li>
            </ul>

            <Button className="text-white" style={{ background: PRIMARY }}>
              View Full IVA Breakdown
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}