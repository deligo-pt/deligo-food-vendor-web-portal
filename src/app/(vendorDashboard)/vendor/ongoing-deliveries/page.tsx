/* app/vendor/ongoing-deliveries/page.tsx */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  MapPin,
  Navigation,
  CheckCircle,
  Phone,
  CircleDot,
  Bike,
  ArrowRight,
} from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";

/* -----------------------------------
   Order & Delivery Types
------------------------------------ */
type DeliveryStage =
  | "accepted"
  | "picked"
  | "on_the_way"
  | "arriving"
  | "delivered";

type OngoingDelivery = {
  id: string;
  customer: string;
  restaurant: string;
  address: string;
  items: string[];
  rider: {
    id: string;
    name: string;
    phone: string;
    lat: number;
    lon: number;
  };
  stage: DeliveryStage;
  eta: string;
  distanceKm: number;
  time: string;
  flash?: boolean;
};

/* -----------------------------------
   Demo Ongoing Deliveries
------------------------------------ */
const initialDeliveries: OngoingDelivery[] = [
  {
    id: "D-1901",
    customer: "Hugo Martins",
    restaurant: "Burger Town Porto",
    address: "Rua Central 12, Porto",
    items: ["Classic Burger", "Fries"],
    rider: {
      id: "R-21",
      name: "Rider-21",
      phone: "+351 987 456 123",
      lat: 41.1579,
      lon: -8.6291,
    },
    stage: "on_the_way",
    eta: "4–6 min",
    distanceKm: 1.3,
    time: "10:22 PM",
  },
  {
    id: "D-1902",
    customer: "Sofia Lopes",
    restaurant: "Vegify Lisbon",
    address: "Avenida Republica 88, Lisbon",
    items: ["Veg Wrap"],
    rider: {
      id: "R-11",
      name: "Rider-11",
      phone: "+351 931 222 040",
      lat: 38.7223,
      lon: -9.1393,
    },
    stage: "arriving",
    eta: "1–2 min",
    distanceKm: 0.4,
    time: "10:25 PM",
  },
];

/* -----------------------------------
   Stage Map (colors + labels)
------------------------------------ */
const STAGE_INFO: Record<
  DeliveryStage,
  { label: string; color: string }
> = {
  accepted: { label: "Accepted", color: "#8B5CF6" },
  picked: { label: "Picked", color: "#0EA5E9" },
  on_the_way: { label: "On The Way", color: "#F97316" },
  arriving: { label: "Arriving", color: PRIMARY },
  delivered: { label: "Delivered", color: "#16A34A" },
};

/* -----------------------------------
   Component
------------------------------------ */
export default function OngoingDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<OngoingDelivery[]>(
    initialDeliveries
  );

  /* Simulate stage progression every 25s */
  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveries((prev) =>
        prev.map((d) => {
          const order = { ...d };
          if (order.stage === "accepted") order.stage = "picked";
          else if (order.stage === "picked") order.stage = "on_the_way";
          else if (order.stage === "on_the_way") order.stage = "arriving";
          else if (order.stage === "arriving") order.stage = "delivered";
          return order;
        })
      );
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{ background: BG }}
    >
      <div className="max-w-[950px] mx-auto space-y-8">
        <header>
          <h1
            className="text-4xl font-extrabold"
            style={{ color: PRIMARY }}
          >
            Ongoing Deliveries
          </h1>
          <p className="text-gray-600 mt-1">
            Track your live orders — rider location, ETA, and delivery stage.
          </p>
        </header>

        {/* List */}
        <div className="space-y-5">
          <AnimatePresence>
            {deliveries.map((d) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <DeliveryCard delivery={d} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* -----------------------------------
   Delivery Card Component
------------------------------------ */
function DeliveryCard({ delivery: d }: { delivery: OngoingDelivery }) {
  const stage = STAGE_INFO[d.stage];

  return (
    <Card className="rounded-3xl shadow-sm border bg-white p-6">
      <CardContent className="space-y-6 p-0">
        {/* top row */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-semibold text-xl">{d.customer}</h2>
            <p className="text-gray-700">{d.restaurant}</p>
            <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
              <Clock size={16} /> {d.time}
            </div>
          </div>

          <div className="text-right">
            <div
              className="text-xs px-3 py-1 rounded-full inline-flex"
              style={{
                background: stage.color + "15",
                color: stage.color,
              }}
            >
              {stage.label}
            </div>
            <div className="text-lg font-bold mt-2">{d.eta}</div>
          </div>
        </div>

        {/* items */}
        <div className="text-sm text-gray-700">
          Items: {d.items.join(", ")}
        </div>

        {/* address */}
        <p className="text-sm flex items-center gap-2 text-gray-700">
          <MapPin size={18} className="text-gray-500" /> {d.address}
        </p>

        {/* rider */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
              style={{
                background: PRIMARY + "20",
                color: PRIMARY,
              }}
            >
              {d.rider.name.split("-")[1]}
            </div>
            <div>
              <p className="font-medium">{d.rider.name}</p>
              <p className="text-xs text-gray-500">Rider ID: {d.rider.id}</p>
            </div>
          </div>

          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={() =>
              alert(`Calling ${d.rider.phone} (Demo Only)`)
            }
          >
            <Phone size={16} /> Call Rider
          </Button>
        </div>

        {/* distance + map progress */}
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Navigation size={18} className="text-blue-600" />
            {d.distanceKm} km away
          </div>

          <ProgressTimeline stage={d.stage} />
        </div>
      </CardContent>
    </Card>
  );
}

/* -----------------------------------
   Timeline Component (Glovo-style)
------------------------------------ */
function ProgressTimeline({ stage }: { stage: DeliveryStage }) {
  const stages: DeliveryStage[] = [
    "accepted",
    "picked",
    "on_the_way",
    "arriving",
    "delivered",
  ];

  const currentIndex = stages.indexOf(stage);

  return (
    <div className="flex items-center gap-2">
      {stages.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <CircleDot
            size={14}
            className={
              i <= currentIndex
                ? "text-green-600"
                : "text-gray-300"
            }
          />
          {i < stages.length - 1 && (
            <div
              className={`w-8 h-1 rounded ${
                i < currentIndex
                  ? "bg-green-600"
                  : "bg-gray-300"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
}
