"use client";

import { Card, CardContent } from "@/components/ui/card";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import { useTranslation } from "@/src/hooks/use-translation";
import { TMeta } from "@/src/types";
import { TProductCategory } from "@/src/types/category.type";
import { motion } from "framer-motion";
import { Apple, CupSoda, Flame, Sandwich, Slice, Utensils } from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF4F8";

interface IProps {
  categoriesResult: { data: TProductCategory[]; meta?: TMeta };
}

const icons = {
  0: { icon: <Utensils />, color: "#FFE1E9" },
  1: { icon: <Apple />, color: "#FFF4D5" },
  2: { icon: <Sandwich />, color: "#E3F3FF" },
  3: { icon: <Flame />, color: "#FDEFE2" },
  4: { icon: <CupSoda />, color: "#E8FFE8" },
  5: { icon: <Slice />, color: "#FFF2E9" },
};

export default function Categories({ categoriesResult }: IProps) {
  const { t } = useTranslation();

  const sortOptions = [
    { label: t("newest_first"), value: "-createdAt" },
    { label: t("oldest_first"), value: "createdAt" },
    { label: t("name_a_to_z"), value: "name" },
    { label: t("name_z_to_a"), value: "-name" },
  ];

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[900px] mx-auto space-y-8">
        {/* HEADER */}
        <div>
          <h1
            className="text-4xl font-extrabold tracking-tight"
            style={{ color: PRIMARY }}
          >
            {t("categories")}
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            {t("these_are_platform_managed_categories")}
          </p>
        </div>

        {/* SEARCH */}
        <AllFilters sortOptions={sortOptions} />

        {/* CATEGORY LIST */}
        <div className="space-y-4 mt-4">
          {categoriesResult?.data?.map((cat, i) => (
            <Card
              key={cat._id}
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
                      background: icons[(i % 6) as keyof typeof icons]?.color,
                      boxShadow: "inset 0px 0px 6px rgba(0,0,0,0.05)",
                    }}
                  >
                    {icons[(i % 6) as keyof typeof icons]?.icon}
                  </div>

                  <div>
                    <div className="text-xl font-semibold">{cat.name}</div>
                    <div className="text-sm text-gray-500">
                      {cat.description}
                    </div>
                  </div>
                </div>

                {/* “Platform Controlled” badge */}
                <div
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{
                    background: PRIMARY + "15",
                    color: PRIMARY,
                  }}
                >
                  {t("platform")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* NO RESULTS */}
        {categoriesResult?.data?.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            {t("no_categories_found")}
          </div>
        )}

        {/* PAGINATION */}
        {!!categoriesResult?.meta?.totalPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 md:px-6"
          >
            <PaginationComponent
              totalPages={categoriesResult?.meta?.totalPage as number}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
