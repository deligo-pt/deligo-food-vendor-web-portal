

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Leaf,
  Plus,
  AlertTriangle,
  CheckCircle,
  Sprout,
} from "lucide-react";
import { useTranslation } from "@/src/hooks/use-translation";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0px 4px 20px rgba(0,0,0,0.06)";

// Static mock ingredients
const STATIC_ING = [
  {
    name: "Chicken Breast",
    stock: 12,
    unit: "kg",
    status: "in-stock",
  },
  {
    name: "Fresh Tomatoes",
    stock: 4,
    unit: "kg",
    status: "low",
  },
  {
    name: "Burger Buns",
    stock: 0,
    unit: "pcs",
    status: "out",
  },
  {
    name: "Mozzarella Cheese",
    stock: 3,
    unit: "kg",
    status: "low",
  },
  {
    name: "Lettuce",
    stock: 15,
    unit: "pcs",
    status: "in-stock",
  },
];

export default function VendorIngredientsPage() {
  const { t } = useTranslation();
  const [ingredients, setIngredients] = useState(STATIC_ING);
  const [query, setQuery] = useState("");

  const filtered = ingredients.filter((i) =>
    i.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[1100px] mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              {t("ingredients")}
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              {t("manage_all_ingredients_menu")}
            </p>
          </div>

          <Button className="text-white flex items-center gap-2" style={{ background: PRIMARY }}>
            <Plus size={18} /> {t("add_ingredients")}
          </Button>
        </div>

        {/* SEARCH */}
        <Input
          placeholder={t("search_ingredients")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />

        {/* LIST */}
        <div className="space-y-6 pt-4">
          {filtered.map((ing, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card className="rounded-3xl bg-white border shadow-md hover:shadow-xl transition-all" style={{ boxShadow: SHADOW }}>
                <CardContent className="p-5 flex items-center justify-between gap-6">
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600">
                      <Leaf size={26} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{ing.name}</h2>
                      <p className="text-sm text-gray-600">
                        {ing.stock} {ing.unit} {t("available")}
                      </p>

                      {/* Status */}
                      <div className="mt-2">
                        {ing.status === "in-stock" && (
                          <Badge className="bg-green-100 text-green-700 flex gap-1">
                            <CheckCircle size={14} /> {t("in_stock")}
                          </Badge>
                        )}
                        {ing.status === "low" && (
                          <Badge className="bg-amber-100 text-amber-700 flex gap-1">
                            <AlertTriangle size={14} /> {t("low_stock")}
                          </Badge>
                        )}
                        {ing.status === "out" && (
                          <Badge className="bg-red-100 text-red-700 flex gap-1">
                            <AlertTriangle size={14} /> {t("out_of_stock")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-3">
                    <Button variant="outline">{t("edit")}</Button>
                    <Button variant="destructive">{t("delete")}</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-10">{t("no_ingredients_found")}</p>
        )}

        {/* AI INSIGHTS */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Sprout className="text-gray-800" />
              <h2 className="font-bold text-lg">{t("ai_insights")}</h2>
            </div>

            <Separator />

            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
              <li>{t("tomatoes_mozzarella_cheese")}</li>
              <li>{t("chicken_most_used_ingredients")}</li>
              <li>{t("burger_buns_out_of_stock")}</li>
              <li>{t("increasing_salad_sales")}</li>
            </ul>

            <div className="pt-2">
              <Button className="text-white" style={{ background: PRIMARY }}>
                {t("optimize_inventory")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
