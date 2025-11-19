/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import {  Truck, Clock, MapPin, User } from "lucide-react";



const DELIGO = "#DC3173";

type Status = "new" | "accepted" | "preparing" | "ready" | "delivered" | "cancelled";

type Order = {
  id: string;
  customer: string;
  items: { name: string; qty: number }[];
  total: number;
  eta: string;
  address: string;
  status: Status;
  startedAt?: number | null; // timestamp when started preparing
  progress?: number; // 0-100 visual progress
  rider?: string | null;
  time: string;
};

const samplePreparing: Order[] = [
  {
    id: "DG-5001",
    customer: "Ana Costa",
    items: [{ name: "Grilled Salmon", qty: 1 }, { name: "Caesar Salad", qty: 1 }],
    total: 21.5,
    eta: "12–18 min",
    address: "Rua das Flores 12, Lisbon",
    status: "preparing",
    startedAt: Date.now() - 1000 * 60 * 2,
    progress: 15,
    rider: null,
    time: "16:05",
  },
  {
    id: "DG-5002",
    customer: "Luis Ferreira",
    items: [{ name: "Paneer Tikka", qty: 2 }],
    total: 13.9,
    eta: "8–12 min",
    address: "Av. Central 9, Porto",
    status: "preparing",
    startedAt: Date.now() - 1000 * 60 * 6,
    progress: 45,
    rider: "Rider-07",
    time: "16:01",
  },
  {
    id: "DG-5003",
    customer: "Sofia Ribeiro",
    items: [{ name: "Veggie Pizza", qty: 1 }],
    total: 10.5,
    eta: "20–30 min",
    address: "Praça Nova 3, Braga",
    status: "preparing",
    startedAt: Date.now() - 1000 * 60 * 1,
    progress: 8,
    rider: null,
    time: "16:07",
  },
  {
    id: "DG-5006",
    customer: "Sofia Ribeiro",
    items: [{ name: "Veggie Pizza", qty: 1 }],
    total: 10.5,
    eta: "20–30 min",
    address: "Praça Nova 3, Braga",
    status: "preparing",
    startedAt: Date.now() - 1000 * 60 * 1,
    progress: 8,
    rider: null,
    time: "16:07",
  },
];

export default function VendorPreparingPage() {
  const [orders, setOrders] = useState<Order[]>(samplePreparing);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"latest" | "eta" | "progress">("latest");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [autoAdvance, setAutoAdvance] = useState(true); // auto progress simulation

  // simulate progress for preparing orders
  useEffect(() => {
    if (!autoAdvance) return;
    const tick = setInterval(() => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.status !== "preparing") return o;
          const inc = Math.max(1, Math.floor(Math.random() * 6)); // 1-6%
          const next = Math.min(100, (o.progress ?? 0) + inc);
          const updated: Order = { ...o, progress: next };
          if (next >= 100) {
            updated.status = "ready";
            updated.progress = 100;
          }
          return updated;
        })
      );
    }, 2000);
    return () => clearInterval(tick);
  }, [autoAdvance]);

  // search + sort
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = orders.filter((o) => o.status === "preparing" || o.status === "accepted");
    if (q) {
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.items.some((it) => it.name.toLowerCase().includes(q)) ||
          o.address.toLowerCase().includes(q)
      );
    }
    if (sort === "latest") list = list.sort((a, b) => (b.startedAt ?? 0) - (a.startedAt ?? 0));
    if (sort === "eta") list = list.sort((a, b) => a.eta.localeCompare(b.eta));
    if (sort === "progress") list = list.sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0));
    return list;
  }, [orders, query, sort]);

  // actions
  const markReady = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "ready", progress: 100 } : o)));
  };
  const cancelOrder = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)));
  };
  const assignRider = (id: string, rider?: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, rider: rider ?? null } : o)));
  };
  const bulkMarkReady = () => {
    setOrders((prev) => prev.map((o) => (selected[o.id] ? { ...o, status: "ready", progress: 100 } : o)));
    setSelected({});
  };

  // helper to toggle checkbox in selected
  const toggleSelect = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold" style={{ color: DELIGO }}>
              Preparing Orders
            </h1>
            <p className="text-sm text-gray-600 mt-1">Manage orders currently in kitchen — progress, assign riders & mark ready.</p>
          </div>

          <div className="flex items-center gap-3">
            <Input placeholder="Search orders, customer, item..." value={query} onChange={(e: any) => setQuery(e.target.value)} className="w-64 md:w-96" />
            <Select onValueChange={(v: any) => setSort(v)} defaultValue="latest">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="eta">ETA</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setOrders(samplePreparing)}>Reset</Button>
              <Button size="sm" onClick={bulkMarkReady} className="bg-[--brand] text-white" style={{ background: DELIGO }}>
                Bulk Ready
              </Button>
            </div>
          </div>
        </div>

        {/* content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* left: list */}
          <Card className="col-span-2 p-0 overflow-hidden rounded-2xl shadow-lg">
            <CardHeader className="flex items-center justify-between p-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: DELIGO }} />
                Preparing ({filtered.length})
              </CardTitle>

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={autoAdvance} onChange={(e) => setAutoAdvance(e.target.checked)} className="form-checkbox" />
                  <span className="text-xs text-gray-600">Auto progress</span>
                </label>
                <Badge className="text-sm">Realtime</Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              {/* animated list */}
              <div className="space-y-4">
                <AnimatePresence>
                  {filtered.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      layout
                      transition={{ type: "spring", stiffness: 150, damping: 18 }}
                      className="bg-white rounded-2xl shadow-sm p-4 flex flex-col md:flex-row gap-3 md:gap-6 items-start md:items-center"
                    >
                      <div className="flex items-start gap-3 md:items-center min-w-0 w-full">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 rounded-xl bg-[rgba(220,49,115,0.08)] flex items-center justify-center text-xl font-bold" style={{ color: DELIGO }}>
                            {order.customer.charAt(0)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-lg truncate">{order.customer}</h3>
                                <div className="text-xs text-gray-500 flex items-center gap-1"><Clock size={14} /> {order.time}</div>
                              </div>

                              <div className="text-sm text-gray-700 mt-2 leading-5 break-words">
                                {order.items.map((it, i) => (
                                  <span key={i} className="inline-block mr-3">
                                    {it.qty}× {it.name}
                                  </span>
                                ))}
                              </div>

                              <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
                                <div className="flex items-center gap-1"><MapPin size={12} /> <span className="truncate">{order.address}</span></div>
                                <Badge variant="outline">{order.eta}</Badge>
                              </div>
                            </div>

                            {/* checkbox for bulk */}
                            <div className="hidden md:block">
                              <input type="checkbox" checked={!!selected[order.id]} onChange={() => toggleSelect(order.id)} />
                            </div>
                          </div>

                          {/* progress bar */}
                          <div className="mt-3">
                            <ProgressBar value={order.progress ?? 0} />
                          </div>

                          {/* rider info & small actions for mobile (stacked) */}
                          <div className="mt-3 flex items-center gap-2 text-sm">
                            <span className="flex items-center gap-1 text-gray-600"><User size={14} /> {order.rider ?? "Unassigned"}</span>
                            <span className="text-gray-400">·</span>
                            <span className="text-xs text-gray-500">{order.status.toUpperCase()}</span>
                          </div>
                        </div>
                      </div>

                      {/* actions */}
                      <div className="flex-shrink-0 flex flex-col items-end gap-2 md:items-center">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => assignRider(order.id, `Rider-${Math.floor(Math.random() * 99) + 1}`)}>
                            Assign Rider
                          </Button>
                          <Button size="sm" onClick={() => markReady(order.id)} style={{ background: DELIGO, color: "#fff" }}>
                            Mark Ready
                          </Button>
                        </div>

                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => cancelOrder(order.id)}>
                            Cancel
                          </Button>
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button size="sm" variant="ghost">Details</Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full md:w-[480px] p-6 overflow-y-auto">
                              <OrderSheetContent order={order} onAssign={(r) => assignRider(order.id, r)} onReady={() => markReady(order.id)} onCancel={() => cancelOrder(order.id)} />
                            </SheetContent>
                          </Sheet>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* right: stats & quick actions */}
          <div className="space-y-4">
            <Card className="p-4 rounded-2xl shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Preparing Orders</div>
                  <div className="text-2xl font-bold">{orders.filter((o) => o.status === "preparing").length}</div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-500">Avg time</div>
                  <div className="font-semibold">15m</div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Button variant="ghost" className="w-full" onClick={() => setOrders((prev) => prev.map((o) => (o.status === "preparing" ? { ...o, progress: Math.min(100, (o.progress ?? 0) + 10) } : o)))}>
                  Boost Progress (+10%)
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setSelected({})}>Clear Selection</Button>
              </div>
            </Card>

            <Card className="p-4 rounded-2xl shadow">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-lg bg-[rgba(220,49,115,0.08)]" style={{ color: DELIGO }}>
                  <Truck />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Delivery Partners</div>
                  <div className="text-xl font-bold">18</div>
                </div>
              </div>

              <div className="mt-4">
                <Button className="w-full" style={{ background: DELIGO, color: "#fff" }}>Open Rider Pool</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- small subcomponents ---------- */

function ProgressBar({ value }: { value: number }) {
  const safe = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${safe}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="h-3 rounded-full"
        style={{ background: `linear-gradient(90deg, ${DELIGO}, #ff7fb3)` }}
      />
      <div className="mt-1 text-xs text-gray-500">{safe}%</div>
    </div>
  );
}

function OrderSheetContent({ order, onAssign, onReady, onCancel }: { order: Order; onAssign?: (rider?: string) => void; onReady?: () => void; onCancel?: () => void }) {
  const [rider, setRider] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold">{order.customer}</h3>
          <div className="text-sm text-gray-600">{order.id} • {order.time}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">ETA</div>
          <div className="font-bold">{order.eta}</div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold">Items</h4>
        <ul className="mt-2 space-y-2">
          {order.items.map((it, i) => (
            <li key={i} className="flex justify-between items-center p-3 rounded-md bg-gray-50">
              <div>{it.name}</div>
              <div className="text-sm text-gray-600">Qty {it.qty}</div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold">Delivery</h4>
        <div className="text-sm text-gray-600 flex items-center gap-2 mt-1"><MapPin size={14} /> {order.address}</div>
      </div>

      <div className="space-y-2">
        <Input placeholder="Assign rider (Rider-XX)" value={rider} onChange={(e:any)=> setRider(e.target.value)} />
        <div className="flex gap-2">
          <Button className="flex-1" onClick={() => { onAssign && onAssign(rider || `Rider-${Math.floor(Math.random()*99)+1}`); setRider(""); }}>Assign</Button>
          <Button variant="outline" className="flex-1" onClick={() => onReady && onReady()}>Mark Ready</Button>
        </div>
        <Button variant="destructive" className="w-full" onClick={() => onCancel && onCancel()}>Cancel Order</Button>
      </div>
    </div>
  );
}
