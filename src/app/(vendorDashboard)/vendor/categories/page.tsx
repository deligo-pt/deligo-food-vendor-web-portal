"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  UtensilsCrossed,
  Slice,
  Wine,
  Coffee,
  Salad,
  Apple,
} from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF4F8";

// Static Glovo-style categories (vendor cannot edit/add)
const STATIC_CATEGORIES = [
  {
    id: "1",
    name: "Burgers",
    icon: <UtensilsCrossed size={22} />,
    color: "#FFE1E9",
    description: "All types of burgers",
  },
  {
    id: "2",
    name: "Pizza",
    icon: <Slice size={22} />,
    color: "#FFF4D5",
    description: "Fresh hot pizzas",
  },
  {
    id: "3",
    name: "Drinks",
    icon: <Wine size={22} />,
    color: "#E3F3FF",
    description: "Cold & hot drinks",
  },
  {
    id: "4",
    name: "Coffee",
    icon: <Coffee size={22} />,
    color: "#FDEFE2",
    description: "Premium fresh coffee",
  },
  {
    id: "5",
    name: "Salads",
    icon: <Salad size={22} />,
    color: "#E8FFE8",
    description: "Healthy salads & sides",
  },
  {
    id: "6",
    name: "Fruits",
    icon: <Apple size={22} />,
    color: "#FFF2E9",
    description: "Fresh fruits & bowls",
  },
];

export default function VendorCategoriesStatic() {
  const [query, setQuery] = useState("");

  const filtered = STATIC_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[900px] mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1
            className="text-4xl font-extrabold tracking-tight"
            style={{ color: PRIMARY }}
          >
            Categories
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            These are platform-managed categories.  
            Vendors cannot create or edit categories (Glovo-style).
          </p>
        </div>

        {/* SEARCH */}
        <Input
          placeholder="Search categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />

        {/* CATEGORY LIST */}
        <div className="space-y-4 mt-4">
          {filtered.map((cat) => (
            <Card
              key={cat.id}
              className="p-5 rounded-3xl border bg-white"
              style={{
                boxShadow: "0px 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              <CardContent className="p-0 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      background: cat.color,
                      boxShadow: "inset 0px 0px 6px rgba(0,0,0,0.05)",
                    }}
                  >
                    {cat.icon}
                  </div>

                  <div>
                    <div className="text-xl font-semibold">{cat.name}</div>
                    <div className="text-sm text-gray-500">{cat.description}</div>
                  </div>
                </div>

                {/* “Platform Controlled” badge */}
                <div className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{
                      background: PRIMARY + "15",
                      color: PRIMARY,
                    }}>
                  Platform
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* NO RESULTS */}
        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
}
