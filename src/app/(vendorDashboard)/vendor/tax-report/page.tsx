"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  Calculator,
  Euro,
  FileSpreadsheet,
  Landmark,
  Percent,
  Receipt,
} from "lucide-react";
import { useState } from "react";

const PRIMARY = "#DC3173";
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
  const { t } = useTranslation();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <div className="min-h-screen p-6 space-y-12">
      {/* HEADER */}
      <TitleHeader
        title={t("tax_report_iva_breakdown")}
        subtitle={t("portugal_compliant_iva_calculation")}
      />

      {/* DATE FILTER */}
      <Card className="rounded-3xl bg-white border shadow-md">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("from")}
            </label>
            <Input
              type="date"
              className="mt-1 h-12"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("to")}
            </label>
            <Input
              type="date"
              className="mt-1 h-12"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <Button className="h-12 text-white" style={{ background: PRIMARY }}>
            <FileSpreadsheet size={18} /> {t("apply")}
          </Button>
        </CardContent>
      </Card>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: t("total_revenue"),
            value: `€${TAX_DATA.totalRevenue.toLocaleString()}`,
            icon: <Euro size={26} className="text-pink-600" />,
          },
          {
            label: t("commission_charged"),
            value: `€${TAX_DATA.platformCommission.toLocaleString()}`,
            icon: <Percent size={26} className="text-blue-600" />,
          },
          {
            label: t("vendor_iva"),
            value: `€${TAX_DATA.vendorIVA.toLocaleString()}`,
            icon: <Calculator size={26} className="text-green-600" />,
          },
          {
            label: t("platform_iva"),
            value: `€${TAX_DATA.platformIVA.toLocaleString()}`,
            icon: <Receipt size={26} className="text-amber-600" />,
          },
        ].map((d, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card
              className="rounded-3xl bg-white border shadow-md hover:shadow-xl transition-all"
              style={{ boxShadow: SHADOW }}
            >
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
      <Card
        className="rounded-3xl bg-white border shadow-md"
        style={{ boxShadow: SHADOW }}
      >
        <CardContent className="p-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <Landmark size={22} /> {t("net_payout_after_taxes")}
          </h2>
          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <p className="text-4xl font-extrabold text-gray-900">
              €{TAX_DATA.netPayout.toLocaleString()}
            </p>
            <ArrowDownRight size={42} className="text-red-500 opacity-80" />
          </div>

          <p className="text-gray-600 text-sm mt-3">
            {t("this_is_final_payout_applying")}
          </p>
        </CardContent>
      </Card>

      {/* BREAKDOWN SECTION */}
      <Card className="rounded-3xl bg-white border shadow-md">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <Receipt size={20} /> {t("detailed_breakdown")}
          </h2>
          <Separator />

          <ul className="text-sm text-gray-700 space-y-2">
            <li>
              • {t("vendor_collects_revenue")}{" "}
              <strong>{t("iva_6_perc")}</strong> {t("on_food_sales")}
            </li>
            <li>
              • {t("platform_commission_has")}{" "}
              <strong>{t("iva_23_perc")}</strong> {t("portugal_law")}.
            </li>
            <li>• {t("net_payout_automatically_excludes")}</li>
            <li>• {t("commission_is_calculated_before")}</li>
          </ul>
        </CardContent>
      </Card>

      {/* AI INSIGHTS */}
      <Card className="rounded-3xl bg-white border shadow-md">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
            <Calculator size={20} /> {t("ai_tax_insights")}
          </h2>
          <Separator />
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
            <li>{t("your_iva_consistant_portuguese")}</li>
            <li>{t("commission_iva_slightly_increased")}</li>
            <li>{t("avoid_running_too_many_discounts")}</li>
            <li>{t("higher_order_volume_lower")}</li>
          </ul>

          <Button className="text-white" style={{ background: PRIMARY }}>
            {t("view_full_iva_breakdown")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
