"use client";


import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  TrendingUp,
  Flame,
  BarChart3,
  ChartBarStacked,
  TrendingDown,
} from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const GRADIENT = "linear-gradient(135deg,#FFE0ED,#FFFFFF)";

// Mock Data (Glovo-style ranking)
const TOP_ITEMS = [
  {
    name: "Chicken Burger",
    sold: 183,
    rating: 4.7,
    growth: 18,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600",
  },
  {
    name: "Margherita Pizza",
    sold: 162,
    rating: 4.5,
    growth: 11,
    image:
      "https://images.unsplash.com/photo-1548365328-5473d2bc4a37?w=600",
  },
  {
    name: "Fresh Orange Juice",
    sold: 134,
    rating: 4.8,
    growth: 22,
    image:
      "https://images.unsplash.com/photo-1580555705450-989dcd28d23b?w=600",
  },
  {
    name: "Greek Salad",
    sold: 118,
    rating: 4.4,
    growth: -6,
    image:
      "https://images.unsplash.com/photo-1569058242253-92a9c755a30c?w=600",
  },
];

export default function VendorTopItemsPage() {
  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[1100px] mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              Top Selling Items
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Best-performing menu items — sales, rating & growth
            </p>
          </div>

          <Button style={{ background: PRIMARY }} className="text-white">
            Export
          </Button>
        </div>

        {/* SUMMARY CARD */}
        <Card style={{ background: GRADIENT }} className="rounded-3xl border shadow-md">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Total Items Sold (7 days)</p>
              <h2 className="text-4xl font-extrabold mt-1" style={{ color: PRIMARY }}>
                {TOP_ITEMS.reduce((a, b) => a + b.sold, 0)} items
              </h2>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <ChartBarStacked size={14} /> Updated hourly
              </p>
            </div>
            <BarChart3 size={48} className="text-pink-600" />
          </CardContent>
        </Card>

        {/* TOP ITEM CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOP_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="rounded-3xl bg-white border shadow-md hover:shadow-xl transition-all">
                <CardContent className="p-0">
                  <div className="flex items-center gap-5 p-5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-2xl object-cover shadow-sm"
                    />

                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>

                      <div className="flex items-center gap-3 text-sm mt-1 text-gray-600">
                        <span>{item.sold} sold</span>
                        <span className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500" />
                          {item.rating}
                        </span>
                      </div>

                      {/* Growth */}
                      <div className="mt-2 flex items-center gap-2">
                        {item.growth >= 0 ? (
                          <Badge className="bg-green-100 text-green-700">+{item.growth}%</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700">{item.growth}%</Badge>
                        )}

                        {item.growth >= 0 ? (
                          <TrendingUp className="text-green-600" size={20} />
                        ) : (
                          <TrendingDown className="text-red-600" size={20} />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* INSIGHTS */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="text-gray-800" />
              <h2 className="font-bold text-lg">AI Insights</h2>
            </div>

            <Separator />

            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
              <li>Chicken Burger is outperforming all categories — increase visibility on home page.</li>
              <li>Fresh Orange Juice shows fastest growth — add combo deals with burgers.</li>
              <li>Greek Salad sales dropped — consider refreshing photo or making it a featured item.</li>
              <li>Pizza category has stable demand — promote during weekends for higher boost.</li>
            </ul>

            <div className="flex gap-3 pt-2">
              <Button className="text-white" style={{ background: PRIMARY }}>Create Promo</Button>
              <Button variant="outline">Export Data</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
