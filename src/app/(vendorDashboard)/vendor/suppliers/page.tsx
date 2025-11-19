// Vendor Suppliers Page — Ultra Premium Glovo-Style
// Next.js + TypeScript + Tailwind + shadcn
// File: app/vendor/suppliers/page.tsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Phone,
  Mail,
  MapPin,
  Star,
  Plus,
  Building2,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0 6px 20px rgba(0,0,0,0.06)";

// Static Suppliers
const STATIC_SUPPLIERS = [
  {
    name: "FreshFarm Produce",
    rating: 4.7,
    phone: "+351 912 300 122",
    email: "contact@freshfarm.pt",
    address: "Rua da Alegria 21, Lisbon",
    reliability: "excellent",
    lastDelivery: "2 days ago",
  },
  {
    name: "Porto Meats & Poultry",
    rating: 4.4,
    phone: "+351 915 882 112",
    email: "support@pmp.pt",
    address: "Av. Boavista 402, Porto",
    reliability: "good",
    lastDelivery: "5 days ago",
  },
  {
    name: "DailyDairy Co.",
    rating: 4.1,
    phone: "+351 914 777 321",
    email: "hello@dailydairy.pt",
    address: "Rua Verde 90, Coimbra",
    reliability: "average",
    lastDelivery: "8 days ago",
  },
];

export default function VendorSuppliersPage() {
  const [query, setQuery] = useState("");
  const filtered = STATIC_SUPPLIERS.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[1100px] mx-auto space-y-12">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              Suppliers
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage suppliers powering your restaurant&apos;s inventory
            </p>
          </div>

          <Button className="text-white flex items-center gap-2" style={{ background: PRIMARY }}>
            <Plus size={18} /> Add Supplier
          </Button>
        </div>

        {/* SEARCH */}
        <Input
          placeholder="Search suppliers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />

        {/* SUPPLIER LIST */}
        <div className="space-y-6 pt-4">
          {filtered.map((sup, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card className="rounded-3xl bg-white border shadow-md hover:shadow-xl transition-all" style={{ boxShadow: SHADOW }}>
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">

                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600">
                      <Building2 size={28} />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{sup.name}</h2>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-700">
                        <Star className="text-yellow-400" size={16} /> {sup.rating}
                      </div>

                      {/* Contact */}
                      <div className="mt-3 space-y-1 text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone size={14} /> {sup.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={14} /> {sup.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} /> {sup.address}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right md:min-w-[200px]">
                    {sup.reliability === "excellent" && (
                      <Badge className="bg-green-100 text-green-700 flex gap-1 justify-center">
                        <CheckCircle size={14} /> Excellent
                      </Badge>
                    )}
                    {sup.reliability === "good" && (
                      <Badge className="bg-amber-100 text-amber-700 flex gap-1 justify-center">
                        <Clock size={14} /> Good
                      </Badge>
                    )}
                    {sup.reliability === "average" && (
                      <Badge className="bg-red-100 text-red-700 flex gap-1 justify-center">
                        <AlertTriangle size={14} /> Average
                      </Badge>
                    )}

                    <p className="mt-3 text-sm text-gray-600 flex items-center gap-1 justify-end">
                      <Truck size={14} /> Last delivery: {sup.lastDelivery}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-10">No suppliers found.</p>
          )}
        </div>

        {/* AI INSIGHTS */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Truck className="text-gray-800" />
              <h2 className="font-bold text-lg">AI Insights</h2>
            </div>
            <Separator />

            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>FreshFarm is your most reliable supplier — 98% on-time delivery rate.</li>
              <li>Mozzarella stock issues linked to supplier delays — consider backup vendor.</li>
              <li>Weekend deliveries show slower response — plan bulk orders Friday morning.</li>
            </ul>

            <div className="pt-2">
              <Button className="text-white" style={{ background: PRIMARY }}>
                Optimize Supplier Management
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
