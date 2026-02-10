"use client";

import StockProductCard from "@/src/components/Dashboard/StockManagement/StockProductCard";
import AllFilters from "@/src/components/Filtering/AllFilters";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { TMeta } from "@/src/types";
import { TProduct } from "@/src/types/product.type";
import { AnimatePresence } from "framer-motion";
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
    <div className="min-h-screen p-6">
      {/* Header */}
      <TitleHeader
        title={t("stock_management")}
        subtitle={t("update_product_stock_in_real_time")}
      />

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
  );
}
