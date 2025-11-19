"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

import {
  CheckCircle,
  MapPin,
  Clock,
  Download,
  Printer,
} from "lucide-react";

/* ----------------------------------------
   THEME COLORS (Deligo Premium)
------------------------------------------ */
const PRIMARY = "#DC3173";           // brand
const BG = "#FFF5FA";                // soft background   
const SHADOW = "0px 4px 24px rgba(0,0,0,0.07)"; // premium shadow

/* ----------------------------------------
   Types
------------------------------------------ */
type CompletedOrder = {
  id: string;
  customer: string;
  restaurant: string;
  items: string[];
  address: string;
  amount: number;
  time: string;
  deliveredAt: string;
  rider: string;
  distance: number;
  payment: "card" | "wallet"; // 🔥 NO CASH, as you requested
};

/* ----------------------------------------
   Data
------------------------------------------ */
const initialCompleted: CompletedOrder[] = [
  {
    id: "C-1001",
    customer: "Hugo Martins",
    restaurant: "Burger Town Porto",
    items: ["Classic Burger", "Fries"],
    address: "Rua Central 12, Porto",
    amount: 14.21,
    time: "10:41 PM",
    deliveredAt: "Today",
    rider: "Rider-21",
    distance: 1.4,
    payment: "card",
  },
  {
    id: "C-1002",
    customer: "Sofia Reis",
    restaurant: "Vegify Lisbon",
    items: ["Veg Wrap"],
    address: "Avenida Republica 88, Lisbon",
    amount: 9.63,
    time: "10:24 PM",
    deliveredAt: "Today",
    rider: "Rider-11",
    distance: 0.6,
    payment: "wallet",
  },
];

export default function CompletedOrdersPage() {
  const [orders] = useState(initialCompleted);
  const [query, setQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");

  /* ----------------------------------------
     Filtering Logic
  ------------------------------------------ */
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (paymentFilter !== "all" && o.payment !== paymentFilter) return false;

      if (!query) return true;
      const q = query.toLowerCase();
      return (
        o.customer.toLowerCase().includes(q) ||
        o.restaurant.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      );
    });
  }, [orders, paymentFilter, query]);

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[900px] mx-auto space-y-8">

        {/* PAGE HEADER */}
        <div className="space-y-1">
          <h1
            className="text-4xl font-extrabold tracking-tight"
            style={{ color: PRIMARY }}
          >
            Completed Orders
          </h1>
          <p className="text-gray-600 text-sm">
            Fully delivered orders with earnings & rider data.
          </p>
        </div>

        {/* FILTER BAR */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-3xl shadow-sm border grid grid-cols-1 md:grid-cols-4 gap-4"
          style={{ boxShadow: SHADOW }}
        >
          <Input
            placeholder="Search customer, order ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="focus-visible:ring-pink-300"
          />

          <Select onValueChange={(v) => setPaymentFilter(v)} defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Payment" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="wallet">Wallet</SelectItem>
            </SelectContent>
          </Select>

          {/* EXPORT BUTTONS — now NO OVERFLOW */}
          <div className="flex justify-between md:justify-end gap-2 col-span-1 md:col-span-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-sm px-4"
            >
              <Download size={16} /> Export CSV
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 text-sm px-4"
            >
              <Printer size={16} /> Print
            </Button>
          </div>
        </motion.div>

        {/* COMPLETED ORDER LIST */}
        <div className="space-y-6">
          <AnimatePresence>
            {filtered.map((o) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0px 8px 32px rgba(0,0,0,0.09)",
                }}
                transition={{ type: "spring", stiffness: 180, damping: 15 }}
              >
                <Card
                  className="rounded-3xl p-6 border bg-white"
                  style={{ boxShadow: SHADOW }}
                >
                  <CardContent className="p-0 space-y-4">
                    {/* TOP ROW */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-semibold">{o.customer}</h2>
                        <p className="text-gray-600">{o.restaurant}</p>

                        <div className="flex items-center gap-1 text-gray-500 text-sm mt-2">
                          <Clock size={14} /> Delivered at {o.time}
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className="px-3 py-1 text-xs rounded-full"
                          style={{
                            background: PRIMARY + "18",
                            color: PRIMARY,
                          }}
                        >
                          Completed
                        </div>
                        <div className="text-2xl font-bold mt-2">
                          {o.amount.toFixed(2)}€
                        </div>
                      </div>
                    </div>

                    {/* ITEMS */}
                    <div className="text-sm text-gray-700">
                      Items: {o.items.join(", ")}
                    </div>

                    {/* ADDRESS */}
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <MapPin size={18} className="text-gray-400" />
                      {o.address}
                    </div>

                    {/* RIDER + PAYMENT */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                          style={{
                            background: PRIMARY + "20",
                            color: PRIMARY,
                          }}
                        >
                          {o.rider.split("-")[1]}
                        </div>

                        <div>
                          <p className="font-medium text-gray-800">{o.rider}</p>
                          <p className="text-xs text-gray-500">
                            Distance: {o.distance} km
                          </p>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        Payment:{" "}
                        <span className="font-semibold uppercase text-gray-900">
                          {o.payment}
                        </span>
                      </div>
                    </div>

                    {/* CHECK ICON */}
                    <div className="flex justify-end pt-1">
                      <CheckCircle
                        size={30}
                        className="text-green-600"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
