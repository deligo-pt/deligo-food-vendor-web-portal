"use client";

import StockProductCard from "@/src/components/Dashboard/StockManagement/StockProductCard";
import AllFilters from "@/src/components/Filtering/AllFilters";
import { useTranslation } from "@/src/hooks/use-translation";
import { TMeta } from "@/src/types";
import { TProduct } from "@/src/types/product.type";
import { AnimatePresence, motion } from "framer-motion";
import { Package } from "lucide-react";

interface IProps {
  productsResult: {
    data: TProduct[];
    meta?: TMeta;
  };
}

export default function StockManagement({ productsResult }: IProps) {
  const { t } = useTranslation();

  const sortOptions = [
    { label: t("newest_first"), value: "-createdAt" },
    { label: t("oldest_first"), value: "createdAt" },
    { label: t("name_a_to_z"), value: "name" },
    { label: t("name_z_to_a"), value: "-name" },
    { label: t("price_high_to_low"), value: "-pricing.finalPrice" },
    { label: t("price_low_to_high"), value: "pricing.finalPrice" },
    { label: t("highest_rated"), value: "-rating.average" },
    { label: t("lowest_rated"), value: "rating.average" },
  ];

  return (
    <div className="min-h-screen bg-pink-50/50 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="text-3xl font-extrabold text-[#DC3173] tracking-tight"
          >
            {t("stock_management")}
          </motion.h1>
          <motion.p
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.1,
            }}
            className="text-gray-500 mt-1 text-lg"
          >
            {t("update_product_stock_in_real_time")}
          </motion.p>
        </div>

        {/* FILTERS */}
        <AllFilters sortOptions={sortOptions} />

        {/* Product List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {productsResult.data?.map((product) => (
              <StockProductCard key={product._id} product={product} />
            ))}
          </AnimatePresence>

          {productsResult.meta?.total === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex bg-white rounded-full text-[#DC3173]/70 mb-3 shadow-sm">
                <Package size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-500">
                {t("no_products_found")}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
