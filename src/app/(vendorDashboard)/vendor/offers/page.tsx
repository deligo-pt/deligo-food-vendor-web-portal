"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Percent,
  Flame,
  TrendingUp,
  Plus,
  Tag,
  CalendarClock,
} from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0 6px 20px rgba(0,0,0,0.06)";

const OFFERS = [
  {
    title: "20% OFF on All Burgers",
    code: "BURGER20",
    validTill: "2025-11-30",
    usage: 122,
    boost: 18,
    type: "percentage",
  },
  {
    title: "Buy 1 Get 1 Free — Fresh Juices",
    code: "JUICEB1G1",
    validTill: "2025-11-25",
    usage: 89,
    boost: 26,
    type: "bogo",
  },
  {
    title: "€3 OFF Above €12 Orders",
    code: "SAVE3",
    validTill: "2025-12-02",
    usage: 64,
    boost: 11,
    type: "flat",
  },
];

export default function VendorActiveOffers() {
  const [query, setQuery] = useState("");

  const filtered = OFFERS.filter((o) => o.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[1100px] mx-auto space-y-12">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              Active Offers
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Boost sales with special discounts & promotions
            </p>
          </div>

          <Button className="text-white flex items-center gap-2" style={{ background: PRIMARY }}>
            <Plus size={18} /> Create Offer
          </Button>
        </div>

        {/* SEARCH */}
        <Input
          placeholder="Search offers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />

        {/* OFFER LIST */}
        <div className="space-y-6 pt-4">
          {filtered.map((offer, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card className="rounded-3xl bg-white border shadow-md hover:shadow-xl transition-all" style={{ boxShadow: SHADOW }}>
                <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-6">

                  {/* LEFT */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600">
                      {offer.type === "percentage" && <Percent size={28} />}
                      {offer.type === "bogo" && <Tag size={28} />}
                      {offer.type === "flat" && <Flame size={28} />}
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{offer.title}</h2>

                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <Badge variant="outline">Code: {offer.code}</Badge>
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-gray-600 text-sm">
                        <CalendarClock size={14} /> Valid till: {offer.validTill}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right md:min-w-[200px]">
                    <p className="text-sm text-gray-500">Total Used</p>
                    <p className="text-3xl font-bold text-gray-900">{offer.usage}</p>

                    <div className="flex justify-end gap-2 items-center mt-2 text-sm font-semibold">
                      <TrendingUp className="text-green-600" size={18} /> +{offer.boost}% boost
                    </div>

                    <Button variant="outline" className="mt-4 w-full">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-10">No offers found.</p>
          )}
        </div>

        {/* AI INSIGHTS */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="text-gray-800" />
              <h2 className="font-bold text-lg">AI Insights</h2>
            </div>

            <Separator />

            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>Juice B1G1 offer has the highest engagement — keep it active on weekends.</li>
              <li>Flat €3 OFF drives good conversion for lunch hours.</li>
              <li>Burger 20% OFF boosted sales by 18% — consider extending the offer.</li>
              <li>Offers ending soon should be promoted with a banner push.</li>
            </ul>

            <div className="pt-2">
              <Button className="text-white" style={{ background: PRIMARY }}>
                Create New Promo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
