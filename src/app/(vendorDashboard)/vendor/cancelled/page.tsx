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
  XCircle,
  MapPin,
  Clock,
  UserX,
  Download,
  Printer,
  AlertTriangle,
} from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF3F7";
const CARD_BG = "#FFFFFF";
const SHADOW = "0px 4px 24px rgba(0,0,0,0.07)";

/* -----------------------------------------
   Types
------------------------------------------ */
type CancelledOrder = {
  id: string;
  customer: string;
  restaurant: string;
  items: string[];
  address: string;
  amount: number;
  time: string;
  cancelledAt: string;
  rider?: string | null;
  reason: "customer_cancelled" | "restaurant_cancelled" | "delivery_failed";
  payment: "card" | "wallet";
};

/* -----------------------------------------
   Demo Data
------------------------------------------ */
const initialCancelled: CancelledOrder[] = [
  {
    id: "X-2001",
    customer: "Luis Amaral",
    restaurant: "Pizza Square",
    items: ["Pepperoni Pizza"],
    address: "Old Town 22, Porto",
    amount: 12.89,
    time: "9:54 PM",
    cancelledAt: "Today",
    rider: "Rider-21",
    reason: "customer_cancelled",
    payment: "card",
  },
  {
    id: "X-2002",
    customer: "Ana Ribeiro",
    restaurant: "Healthy Point Lisbon",
    items: ["Green Salad"],
    address: "Av. República 91, Lisbon",
    amount: 8.90,
    time: "7:22 PM",
    cancelledAt: "Today",
    rider: null,
    reason: "restaurant_cancelled",
    payment: "wallet",
  },
  {
    id: "X-2003",
    customer: "Hugo Santos",
    restaurant: "Burger Town Porto",
    items: ["Double Cheese Burger"],
    address: "Rua Central 12, Porto",
    amount: 11.40,
    time: "6:30 PM",
    cancelledAt: "Yesterday",
    rider: "Rider-11",
    reason: "delivery_failed",
    payment: "card",
  },
];

/* -----------------------------------------
   Reason Labels (premium style)
------------------------------------------ */
const REASON_LABEL: Record<
  CancelledOrder["reason"],
  { text: string; color: string }
> = {
  customer_cancelled: { text: "Customer Cancelled", color: "#EA580C" },
  restaurant_cancelled: { text: "Restaurant Cancelled", color: PRIMARY },
  delivery_failed: { text: "Delivery Failed", color: "#DC2626" },
};

export default function CancelledOrdersPage() {
  const [orders] = useState(initialCancelled);
  const [query, setQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");

  /* -----------------------------------------
     Filtering Logic
  ------------------------------------------ */
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (paymentFilter !== "all" && o.payment !== paymentFilter) return false;
      if (reasonFilter !== "all" && o.reason !== reasonFilter) return false;

      if (!query) return true;
      const q = query.toLowerCase();
      return (
        o.customer.toLowerCase().includes(q) ||
        o.restaurant.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      );
    });
  }, [orders, paymentFilter, reasonFilter, query]);

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[900px] mx-auto space-y-8">
        {/* -----------------------------------------
            PAGE HEADER
        ------------------------------------------ */}
        <header className="space-y-1">
          <h1
            className="text-4xl font-extrabold tracking-tight"
            style={{ color: PRIMARY }}
          >
            Cancelled Orders
          </h1>
          <p className="text-gray-600 text-sm">
            See all orders that were cancelled — reason, payment, customer info.
          </p>
        </header>

        {/* -----------------------------------------
            FILTER BAR
        ------------------------------------------ */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-3xl shadow-sm border grid grid-cols-1 md:grid-cols-4 gap-4"
          style={{ boxShadow: SHADOW }}
        >
          <Input
            placeholder="Search order, customer..."
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

          <Select onValueChange={(v) => setReasonFilter(v)} defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reasons</SelectItem>
              <SelectItem value="customer_cancelled">
                Customer Cancelled
              </SelectItem>
              <SelectItem value="restaurant_cancelled">
                Restaurant Cancelled
              </SelectItem>
              <SelectItem value="delivery_failed">Delivery Failed</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-between md:justify-end gap-2 col-span-1 md:col-span-1">
            <Button variant="outline" className="flex items-center gap-2 px-4">
              <Download size={16} /> Export CSV
            </Button>

            <Button variant="outline" className="flex items-center gap-2 px-4">
              <Printer size={16} /> Print
            </Button>
          </div>
        </motion.div>

        {/* -----------------------------------------
            CANCELLED ORDER LIST (one card per row)
        ------------------------------------------ */}
        <div className="space-y-6">
          <AnimatePresence>
            {filtered.map((o) => {
              const reason = REASON_LABEL[o.reason];

              return (
                <motion.div
                  key={o.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  whileHover={{
                    scale: 1.01,
                    boxShadow: "0px 8px 32px rgba(0,0,0,0.09)",
                  }}
                  transition={{ type: "spring", stiffness: 170, damping: 14 }}
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
                            <Clock size={14} />
                            Cancelled at {o.time}
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className="px-3 py-1 text-xs rounded-full"
                            style={{
                              background: reason.color + "18",
                              color: reason.color,
                            }}
                          >
                            {reason.text}
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

                      {/* RIDER & PAYMENT */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                            style={{
                              background: PRIMARY + "20",
                              color: PRIMARY,
                            }}
                          >
                            {o.rider ? o.rider.split("-")[1] : <UserX />}
                          </div>

                          <div>
                            <p className="font-medium text-gray-800">
                              {o.rider ?? "No Rider Assigned"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Payment: {o.payment.toUpperCase()}
                            </p>
                          </div>
                        </div>

                        <AlertTriangle
                          size={28}
                          className="text-red-500"
                        />
                      </div>

                      {/* ICON */}
                      <div className="flex justify-end pt-1">
                        <XCircle size={30} className="text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
