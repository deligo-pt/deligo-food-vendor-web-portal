/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  ChevronRight,
  Truck,
  User2,
  Check,
  BellRing,
  Loader2,
} from "lucide-react";


const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const CARD_BG = "#FFFFFF";

/* ---------------------- Types ---------------------- */
type RiderStatus = "available" | "busy" | "offline";
type OrderStatus = "new" | "ready" | "assigned" | "picked" | "cancelled";

type Rider = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  status: RiderStatus;
  lastSeen?: string;
};

type Order = {
  id: string;
  customer: string;
  items: string[];
  total: number;
  eta: string;
  address: string;
  status: OrderStatus;
  time: string;
  lat: number;
  lon: number;
  riderId?: string | null;
  flash?: boolean;
};

/* ---------------------- Mock Data ---------------------- */
/* Riders around a Portugal-like area (lat/lon approximate) */
const initialRiders: Rider[] = [
  { id: "R-1", name: "Rider-1", lat: 38.7223, lon: -9.1393, status: "available", lastSeen: "1m" }, // Lisbon
  { id: "R-2", name: "Rider-2", lat: 41.1579, lon: -8.6291, status: "available", lastSeen: "2m" }, // Porto
  { id: "R-3", name: "Rider-3", lat: 37.0194, lon: -7.9308, status: "available", lastSeen: "30s" }, // Faro
];

/* Orders with coordinates (mock = replace with real geocoded coords) */
const initialOrders: Order[] = [
  {
    id: "O-1001",
    customer: "Hugo Martins",
    items: ["Classic Burger"],
    total: 14.21,
    eta: "11 min",
    address: "Old Town, Porto",
    status: "ready",
    time: "10:41 PM",
    lat: 41.1579, // Porto center
    lon: -8.6291,
  },
  {
    id: "O-1002",
    customer: "Sofia Reis",
    items: ["Classic Burger"],
    total: 9.63,
    eta: "7 min",
    address: "Lisbon Downtown",
    status: "ready",
    time: "10:22 PM",
    lat: 38.7223, // Lisbon center
    lon: -9.1393,
  },
];

/* ---------------------- Helpers ---------------------- */
/** Haversine: meters */
function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* Format price */
const formatPrice = (n: number) => `${n.toFixed(2)}€`;

/* ---------------------- Page Component ---------------------- */
export default function VendorAutoAssignPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [riders, setRiders] = useState<Rider[]>(initialRiders);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | OrderStatus | string>("all");
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [autoAssignOnAccept, setAutoAssignOnAccept] = useState(true);

  /* Demo: periodically slightly move riders to emulate real movement (optional) */
  useEffect(() => {
    const interval = setInterval(() => {
      setRiders((prev) =>
        prev.map((r, i) => {
          if (Math.random() < 0.5) {
            // tiny jitter
            const jitter = 0.001 * (Math.random() - 0.5);
            return { ...r, lat: r.lat + jitter, lon: r.lon + jitter, lastSeen: "now" };
          }
          return r;
        })
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  /* Demo: simulate incoming ready orders every 22s */
  useEffect(() => {
    const names = ["Ana", "Luis", "Sofia", "Hugo"];
    const locs = [
      { lat: 38.7223, lon: -9.1393, place: "Lisbon Downtown" },
      { lat: 41.1579, lon: -8.6291, place: "Porto Center" },
      { lat: 37.0194, lon: -7.9308, place: "Faro Market" },
    ];
    const interval = setInterval(() => {
      const pick = names[Math.floor(Math.random() * names.length)];
      const l = locs[Math.floor(Math.random() * locs.length)];
      const newOrder: Order = {
        id: `O-${Date.now().toString().slice(-5)}`,
        customer: `${pick} ${Math.floor(Math.random() * 100)}`,
        items: ["Classic Burger"],
        total: Math.round((6 + Math.random() * 20) * 100) / 100,
        eta: `${2 + Math.floor(Math.random() * 12)} min`,
        address: l.place,
        status: "ready",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        lat: l.lat,
        lon: l.lon,
        flash: true,
      };
      setOrders((p) => [newOrder, ...p]);
      setTimeout(() => setOrders((p) => p.map((o) => ({ ...o, flash: false }))), 1300);
    }, 22000);
    return () => clearInterval(interval);
  }, []);

  /* Filtered orders for UI */
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q)
      );
    });
  }, [orders, filter, query]);

  /* Find nearest available rider — returns riderId + distanceKm */
  function findNearestAvailableRider(lat: number, lon: number) {
    const available = riders.filter((r) => r.status === "available");
    if (available.length === 0) return null;
    let best = available[0];
    let bestDistance = haversineDistanceKm(lat, lon, best.lat, best.lon);
    for (let i = 1; i < available.length; i++) {
      const r = available[i];
      const d = haversineDistanceKm(lat, lon, r.lat, r.lon);
      if (d < bestDistance) {
        bestDistance = d;
        best = r;
      }
    }
    return { rider: best, distanceKm: bestDistance };
  }

  /* Auto assign when vendor accepts */
  const autoAssignNearest = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const found = findNearestAvailableRider(order.lat, order.lon);
    if (!found) {
      // no rider available — show message and keep order ready (or queue)
      // Here we flash the order to indicate failure
      setOrders((p) => p.map((o) => (o.id === orderId ? { ...o, flash: true } : o)));
      setTimeout(() => setOrders((p) => p.map((o) => (o.id === orderId ? { ...o, flash: false } : o))), 900);
      alert("No available riders right now — order will stay in queue.");
      return;
    }

    // assign rider (mark rider busy, set order.riderId, update order status)
    setBusy((b) => ({ ...b, [orderId]: true }));

    setTimeout(() => {
      setRiders((prev) => prev.map((r) => (r.id === found.rider.id ? { ...r, status: "busy" } : r)));
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "assigned", riderId: found.rider.id, flash: false } : o
        )
      );
      setBusy((b) => ({ ...b, [orderId]: false }));
      // optional: notify UI / toast
      // `found.distanceKm` available (rounded)
      const distKm = Math.round(found.distanceKm * 100) / 100;
      console.info(`Order ${orderId} assigned to ${found.rider.name} (${distKm} km)`);
    }, 700); // simulate network delay
  };

  /* Manual Accept action — will auto-assign if toggle on */
  const handleAccept = (orderId: string) => {
    if (autoAssignOnAccept) {
      autoAssignNearest(orderId);
    } else {
      // just mark accepted / assigned manually (up to vendor)
      setOrders((p) => p.map((o) => (o.id === orderId ? { ...o, status: "assigned" } : o)));
    }
  };

  /* Mark picked (rider collected) — free up rider */
  const markPicked = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    setBusy((b) => ({ ...b, [orderId]: true }));
    setTimeout(() => {
      setOrders((p) => p.map((o) => (o.id === orderId ? { ...o, status: "picked" } : o)));
      if (order.riderId) {
        setRiders((prev) => prev.map((r) => (r.id === order.riderId ? { ...r, status: "available" } : r)));
      }
      setBusy((b) => ({ ...b, [orderId]: false }));
    }, 600);
  };

  /* Manual assign via sheet (override auto) */
  const assignManual = (orderId: string, riderId: string) => {
    setBusy((b) => ({ ...b, [orderId]: true }));
    setTimeout(() => {
      setOrders((p) => p.map((o) => (o.id === orderId ? { ...o, status: "assigned", riderId } : o)));
      setRiders((prev) => prev.map((r) => (r.id === riderId ? { ...r, status: "busy" } : r)));
      setBusy((b) => ({ ...b, [orderId]: false }));
    }, 500);
  };

  /* Utility: lookup rider name by id */
  const riderById = (id?: string | null) => riders.find((r) => r.id === id) || null;

  /* UI helpers: list available rider count */
  const availableCount = riders.filter((r) => r.status === "available").length;

  return (
    <div style={{ background: BG }} className="min-h-screen p-6 md:p-10">
      <div className="max-w-[1000px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              Vendor — Ready for pickup
            </h1>
            <div className="mt-2 text-sm text-gray-600">
              Riders available: <strong>{availableCount}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Input placeholder="Search orders..." value={query} onChange={(e: any) => setQuery(e.target.value)} className="w-72" />
            <Select onValueChange={(v) => setFilter(v)} defaultValue="all">
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="picked">Picked</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <label className="text-sm mr-2">Auto-assign on Accept</label>
              <input type="checkbox" checked={autoAssignOnAccept} onChange={(e) => setAutoAssignOnAccept(e.target.checked)} />
            </div>
          </div>
        </div>

        {/* Overview (horizontal) */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          <MiniStat title="Ready" value={orders.filter((o) => o.status === "ready").length} color="#FFECEE" icon={<Truck />} />
          <MiniStat title="Assigned" value={orders.filter((o) => o.status === "assigned").length} color="#E8F4FF" icon={<User2 />} />
          <MiniStat title="Picked" value={orders.filter((o) => o.status === "picked").length} color="#E8FFF0" icon={<Check />} />
          <MiniStat title="Riders avail." value={availableCount} color="#FFF0F6" icon={<User2 />} />
        </div>

        {/* Orders list — ONE CARD PER ROW (full width) */}
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((order) => {
              const assignedRider = riderById(order.riderId);
              const nearest = findNearestAvailableRider(order.lat, order.lon);
              const nearestKm = nearest ? Math.round(nearest.distanceKm * 100) / 100 : null;

              return (
                <motion.div key={order.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
                  <Card className={`p-4 rounded-2xl shadow-md border ${order.flash ? "ring-4 ring-[rgba(220,49,115,0.14)]" : ""}`} style={{ background: CARD_BG }}>
                    <div className="flex items-start justify-between gap-4">
                      {/* Left column: avatar + details */}
                      <div className="flex gap-4 items-start min-w-0">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold" style={{ background: `${PRIMARY}1A`, color: PRIMARY }}>
                          {order.customer.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg truncate">{order.customer}</h3>
                            <div className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> {order.time}</div>
                          </div>

                          <p className="text-sm text-gray-700 mt-2 truncate">{order.items.join(", ")}</p>
                          <p className="text-xs text-gray-500 mt-2 flex items-center gap-2 truncate"><MapPin size={12} /> {order.address}</p>

                          {/* nearest hint (if exists) */}
                          {nearestKm !== null && order.status === "ready" && (
                            <div className="mt-2 text-xs text-gray-600">Nearest rider ~ {nearestKm} km</div>
                          )}
                        </div>
                      </div>

                      {/* Right column: price + actions */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-lg font-bold">{formatPrice(order.total)}</div>
                        <div className="text-xs text-gray-500">ETA {order.eta}</div>

                        {/* status + actions */}
                        <div className="flex items-center gap-2 mt-3">
                          <StatusPill status={order.status} small />
                          {assignedRider && <Badge className="text-xs">{assignedRider.name}</Badge>}
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          {order.status === "ready" && (
                            <>
                              <Button size="sm" onClick={() => handleAccept(order.id)} disabled={!!busy[order.id]}>
                                {busy[order.id] ? <Loader2 className="animate-spin" size={14} /> : "Accept & Assign"}
                              </Button>

                              {/* Manual assign sheet */}
                              <Sheet>
                                <SheetTrigger asChild>
                                  <Button variant="outline" size="sm">Assign Manually <ChevronRight size={14} /></Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-full md:w-[420px] p-6">
                                  <h3 className="text-lg font-semibold mb-2">Assign Rider (Manual)</h3>
                                  <div className="grid grid-cols-1 gap-3">
                                    {riders.map((r) => (
                                      <button key={r.id} className="p-3 bg-white rounded-lg border flex items-center justify-between" onClick={() => assignManual(order.id, r.id)}>
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center"><User2 size={16} /></div>
                                          <div>
                                            <div className="font-medium">{r.name}</div>
                                            <div className="text-xs text-gray-500">Status: {r.status}</div>
                                          </div>
                                        </div>
                                        <div className="text-xs text-gray-500">{Math.round(haversineDistanceKm(order.lat, order.lon, r.lat, r.lon) * 100) / 100} km</div>
                                      </button>
                                    ))}
                                  </div>
                                </SheetContent>
                              </Sheet>
                            </>
                          )}

                          {order.status === "assigned" && (
                            <>
                              <Button size="sm" onClick={() => markPicked(order.id)} disabled={!!busy[order.id]}>
                                {busy[order.id] ? <Loader2 className="animate-spin" size={14} /> : "Mark picked"}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => notifyAssignedRider(order.id)}><BellRing size={14} /></Button>
                            </>
                          )}

                          {order.status === "picked" && <div className="text-sm text-gray-600">Completed</div>}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Riders panel (small) */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Delivery Partners (demo)</h3>
          <div className="flex gap-3">
            {riders.map((r) => (
              <div key={r.id} className="p-3 rounded-lg border bg-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-sm font-medium">{r.name.split("-")[1]}</div>
                <div>
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-xs text-gray-500">Status: {r.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* ------------------ helper inside component ------------------ */

  function notifyAssignedRider(orderId: string) {
    const o = orders.find((x) => x.id === orderId);
    if (!o || !o.riderId) {
      alert("No rider assigned to this order yet.");
      return;
    }
    const rider = riders.find((r) => r.id === o.riderId)!;
    // demo: just flash UI and console
    setBusy((b) => ({ ...b, [orderId]: true }));
    setTimeout(() => {
      setBusy((b) => ({ ...b, [orderId]: false }));
      alert(`Notification sent to ${rider.name} (demo).`);
    }, 700);
  }
}

/* ---------------------- Small subcomponents ---------------------- */

function MiniStat({ title, value, icon, color }: { title: string; value: number; icon?: React.ReactNode; color?: string }) {
  return (
    <div className="min-w-[180px] rounded-xl p-3 shadow-sm border flex items-center gap-3" style={{ background: color || "#fff", borderColor: "#FFD0E1" }}>
      <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-xs text-gray-600">{title}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );
}

/* Status pill */
function StatusPill({ status, small }: { status: OrderStatus; small?: boolean }) {
  const map: Record<OrderStatus, { label: string; bg: string; color: string }> = {
    ready: { label: "READY", bg: "#FFE1EC", color: PRIMARY },
    assigned: { label: "ASSIGNED", bg: "#E8F4FF", color: "#0B67E6" },
    picked: { label: "PICKED", bg: "#E8FFF0", color: "#0F8A3E" },
    cancelled: { label: "CANCELLED", bg: "#FFEDEC", color: "#E53935" },
  };
  const s = map[status];
  return (
    <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${small ? "text-sm" : ""}`} style={{ background: s.bg, color: s.color }}>
      <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
      {s.label}
    </div>
  );
}
