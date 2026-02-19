"use client";

import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { TTopPerformingItems } from "@/src/types/analytics.type";
import { motion, Variants } from "framer-motion";
import { ShoppingBagIcon, StarIcon, TrendingUpIcon } from "lucide-react";
import Image from "next/image";

interface IProps {
  topPerformingItemsData: TTopPerformingItems;
}

export default function TopPerformingItems({ topPerformingItemsData }: IProps) {
  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  } as Variants;

  const maxSold = Math.max(
    ...(topPerformingItemsData.topItems?.map((i) => i.sold) || [0]),
  );

  return (
    <motion.div
      className="min-h-screen p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <TitleHeader
        title="Top Performing Items"
        subtitle="Your best sellers and trending products"
        extraComponent={
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <ShoppingBagIcon className="w-4 h-4 text-[#DC3173]" />
            <span className="text-sm font-medium text-gray-600">
              {topPerformingItemsData.summary?.totalItemsSold} Items Sold Total
            </span>
          </div>
        }
      />

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topPerformingItemsData.topItems?.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* Image */}
            <div className="relative w-full h-48 overflow-hidden bg-gray-100">
              <Image
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                width={300}
                height={300}
              />
              {/* Rank badge */}
              <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-[#DC3173] text-white font-bold text-sm flex items-center justify-center shadow-lg">
                #{index + 1}
              </div>
              {/* Growth badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-md">
                <TrendingUpIcon className="w-3 h-3" />+{item.growthPercentage}%
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-bold text-gray-900 text-lg mb-3">
                {item.name}
              </h3>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBagIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-2xl font-bold text-[#DC3173]">
                    {item.sold}
                  </span>
                  <span className="text-sm text-gray-500">units sold</span>
                </div>
                {item.rating > 0 ? (
                  <div className="flex items-center gap-1 text-amber-500">
                    <StarIcon className="w-4 h-4 fill-amber-400" />
                    <span className="text-sm font-bold">{item.rating}</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">No ratings yet</span>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#DC3173] to-[#e45a92] rounded-full"
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${(item.sold / maxSold) * 100}%`,
                  }}
                  transition={{
                    duration: 1,
                    delay: index * 0.15,
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
