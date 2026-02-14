"use client";

import ProductVariationCard from "@/src/components/Dashboard/Products/VariationManagement/ProductVariationCard";
import AllFilters from "@/src/components/Filtering/AllFilters";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { TMeta } from "@/src/types";
import { TProduct } from "@/src/types/product.type";
import { AnimatePresence, motion } from "framer-motion";
import { Layers, Package, Tag } from "lucide-react";

interface IProps {
  productsData: { data: TProduct[]; meta?: TMeta };
}

export default function VariationManagement({ productsData }: IProps) {
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

  const filterOptions = [
    {
      label: t("availability_status"),
      key: "status",
      placeholder: "Select a status",
      type: "select",
      items: [
        {
          label: t("in_stock"),
          value: t("in_stock"),
        },
        {
          label: t("out_of_stock"),
          value: t("out_of_stock"),
        },
        {
          label: t("limited"),
          value: t("limited"),
        },
      ],
    },
  ];

  const totalVariations = productsData.data?.reduce(
    (sum, p) => sum + p.variations.length,
    0,
  );

  const totalOptions = productsData.data?.reduce(
    (sum, p) => sum + p.variations.reduce((s, v) => s + v.options.length, 0),
    0,
  );

  return (
    <div className="min-h-screen bg-pink-50/50 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Header */}
        <TitleHeader
          title="Variation Management"
          subtitle="Add, edit, and manage product variations"
        />

        {/* Filters */}
        <AllFilters sortOptions={sortOptions} filterOptions={filterOptions} />

        {/* Stats */}
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
          }}
          className="flex flex-wrap items-center gap-6 mb-8 px-5 py-3.5 bg-white rounded-xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Package size={16} className="text-[#DC3173]" />
            <span className="text-sm text-gray-500">Products:</span>
            <span className="text-sm font-bold text-gray-900">
              {productsData.meta?.total || 0}
            </span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-blue-400" />
            <span className="text-sm text-gray-500">Variations:</span>
            <span className="text-sm font-bold text-gray-900">
              {totalVariations}
            </span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-green-400" />
            <span className="text-sm text-gray-500">Options:</span>
            <span className="text-sm font-bold text-gray-900">
              {totalOptions}
            </span>
          </div>
        </motion.div>

        {/* Product List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {productsData.data?.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
              >
                <ProductVariationCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>

          {productsData.meta?.total === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex p-4 bg-white rounded-full text-[#DC3173] mb-3 shadow-sm">
                <Package size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No products found
              </h3>
              <p className="text-gray-500 mt-1">
                Try adjusting your search or filter
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
