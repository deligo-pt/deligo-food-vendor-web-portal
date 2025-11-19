"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Bell,
  Loader2,
  CheckCircle,
  Clock,
  Package,
} from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0 6px 20px rgba(0,0,0,0.06)";

// Mock Alerts
const ALERTS = [
  {
    name: "Burger Buns",
    level: "critical",
    remaining: 0,
    usedToday: 42,
    eta: "Restock immediately",
  },
  {
    name: "Mozzarella Cheese",
    level: "low",
    remaining: 3,
    usedToday: 18,
    eta: "Runs out in ~4 hours",
  },
  {
    name: "Fresh Tomatoes",
    level: "low",
    remaining: 4,
    usedToday: 25,
    eta: "Runs out today",
  },
  {
    name: "Chicken Breast",
    level: "warning",
    remaining: 12,
    usedToday: 35,
    eta: "Stable",
  },
];

export default function VendorStockAlerts() {
  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[1100px] mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              Stock Alerts
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Real-time ingredient alerts based on order consumption
            </p>
          </div>

          <Button className="text-white flex items-center gap-2" style={{ background: PRIMARY }}>
            <Bell size={18} /> Refresh
          </Button>
        </div>

        {/* LIVE STATUS */}
        <Card className="rounded-3xl bg-white border shadow-md" style={{ boxShadow: SHADOW }}>
          <CardContent className="p-6 flex items-center gap-4">
            <Loader2 size={32} className="animate-spin text-pink-600" />
            <div>
              <p className="font-semibold text-gray-800">Live monitoring enabled</p>
              <p className="text-sm text-gray-500">Tracking orders + consumption in real-time</p>
            </div>
          </CardContent>
        </Card>

        {/* ALERT LIST */}
        <div className="space-y-6">
          {ALERTS.map((alert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card className="rounded-3xl bg-white border shadow-md hover:shadow-xl transition-all">
                <CardContent className="p-6 flex items-center justify-between gap-6">
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600">
                      <Package size={26} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{alert.name}</h2>
                      <p className="text-sm text-gray-600">Used today: {alert.usedToday} units</p>

                      <div className="mt-2">
                        {alert.level === "critical" && (
                          <Badge className="bg-red-100 text-red-700 flex gap-1">
                            <AlertTriangle size={14} /> Critical — Out of Stock
                          </Badge>
                        )}
                        {alert.level === "low" && (
                          <Badge className="bg-amber-100 text-amber-700 flex gap-1">
                            <AlertTriangle size={14} /> Low Stock
                          </Badge>
                        )}
                        {alert.level === "warning" && (
                          <Badge className="bg-green-100 text-green-700 flex gap-1">
                            <CheckCircle size={14} /> Stable
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-gray-900">{alert.remaining}</p>
                    <p className="text-xs text-gray-500">remaining</p>
                    <p className="text-sm mt-2 text-gray-700 flex items-center gap-1 justify-end">
                      <Clock size={14} /> {alert.eta}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI INSIGHTS */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-gray-800" />
              <h2 className="font-bold text-lg">AI Insights</h2>
            </div>

            <Separator />

            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
              <li>Burger buns out of stock — affects 4 top-selling items.</li>
              <li>Mozzarella likely to run out within 4 hours based on usage.</li>
              <li>Tomatoes shortage expected due to weekend spikes.</li>
              <li>Chicken stable but consumption increasing +18% this week.</li>
            </ul>

            <div className="pt-2">
              <Button style={{ background: PRIMARY }} className="text-white">
                Optimize Stock
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
