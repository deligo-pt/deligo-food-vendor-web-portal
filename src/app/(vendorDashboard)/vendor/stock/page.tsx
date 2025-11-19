/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  ArrowUp,
  ArrowDown,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF2F8";

// Static product list
const STATIC_STOCK = [
  {
    id: "P1",
    name: "Chicken Burger",
    category: "Burgers",
    stock: 18,
    minStock: 10,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
  },
  {
    id: "P2",
    name: "Margherita Pizza",
    category: "Pizza",
    stock: 4,
    minStock: 8,
    image: "https://images.unsplash.com/photo-1548365328-5473d2bc4a37",
  },
  {
    id: "P3",
    name: "Fresh Orange Juice",
    category: "Drinks",
    stock: 0,
    minStock: 5,
    image: "https://images.unsplash.com/photo-1580555705450-989dcd28d23b",
  },
  {
    id: "P4",
    name: "Greek Salad",
    category: "Salads",
    stock: 21,
    minStock: 12,
    image: "https://images.unsplash.com/photo-1569058242253-92a9c755a30c",
  },
  {
    id: "P5",
    name: "Classic Coffee",
    category: "Coffee",
    stock: 7,
    minStock: 5,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348",
  },
];

export default function VendorStockPremium() {
  const [products, setProducts] = useState(STATIC_STOCK);
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const adjustStock = (id: string, change: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + change) } : p
      )
    );
  };

  const getStockStatus = (p: any) => {
    if (p.stock === 0)
      return { text: "Out of Stock", color: "#DC2626", icon: <XCircle size={16} /> };
    if (p.stock < p.minStock)
      return { text: "Low Stock", color: "#EA580C", icon: <AlertTriangle size={16} /> };
    return { text: "In Stock", color: PRIMARY, icon: <CheckCircle size={16} /> };
  };

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[900px] mx-auto space-y-8">

        {/* HEADER */}
        <header>
          <h1
            className="text-4xl font-extrabold"
            style={{ color: PRIMARY }}
          >
            Stock Management
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Update product stock in real-time — 
          </p>
        </header>

        {/* SEARCH */}
        <Input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />

        {/* PRODUCT LIST */}
        <div className="space-y-6 pt-2">
          <AnimatePresence>
            {filtered.map((p) => {
              const status = getStockStatus(p);

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  whileHover={{ scale: 1.015 }}
                  transition={{ type: "spring", stiffness: 170, damping: 16 }}
                >
                  <Card
                    className="rounded-3xl overflow-hidden border bg-white"
                    style={{
                      boxShadow:
                        "0px 6px 24px rgba(0,0,0,0.08), inset 0px 0px 12px rgba(0,0,0,0.03)",
                    }}
                  >
                    <CardContent className="p-0 flex">

                      {/* LEFT SIDE CONTENT */}
                      <div className="flex items-start gap-5 p-5 flex-1">

                        {/* PRODUCT IMAGE */}
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-24 h-24 object-cover rounded-2xl shadow-md"
                        />

                        {/* PRODUCT INFO */}
                        <div className="flex flex-col justify-between h-full">

                          <div>
                            <h2 className="text-xl font-semibold">{p.name}</h2>
                            <p className="text-sm text-gray-500">{p.category}</p>

                            {/* STATUS BADGE */}
                            <span
                              className="mt-2 px-3 py-1 rounded-full inline-flex items-center gap-1 text-xs font-medium"
                              style={{
                                background: status.color + "15",
                                color: status.color,
                              }}
                            >
                              {status.icon}
                              {status.text}
                            </span>
                          </div>

                          {/* STOCK BAR */}
                          <div className="mt-3 w-40 h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div
                              className="h-full"
                              style={{
                                width: `${Math.min((p.stock / (p.minStock * 2)) * 100, 100)}%`,
                                background: status.color,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* RIGHT SIDE STOCK CONTROLS */}
                      <div className="p-5 border-l flex flex-col items-center justify-center gap-4 bg-white/40 backdrop-blur-sm">

                        {/* STOCK NUMBER */}
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Stock</div>
                          <div className="text-4xl font-bold text-gray-800">
                            {p.stock}
                          </div>
                        </div>

                        {/* CONTROL BUTTONS */}
                        <div className="flex gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => adjustStock(p.id, +1)}
                            className="rounded-full p-3"
                          >
                            <ArrowUp size={16} />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => adjustStock(p.id, -1)}
                            className="rounded-full p-3"
                          >
                            <ArrowDown size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* NO RESULTS */}
        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}
