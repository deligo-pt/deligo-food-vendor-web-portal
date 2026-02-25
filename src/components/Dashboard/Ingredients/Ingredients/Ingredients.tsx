"use client";

import SingleIngredientCard from "@/src/components/Dashboard/Ingredients/Ingredients/SingleIngredientCard";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { TMeta } from "@/src/types";
import { TIngredient } from "@/src/types/ingredient.type";
import { motion } from "framer-motion";

interface IProps {
  ingredientsData: { data: TIngredient[]; meta?: TMeta };
}

export default function Ingredients({ ingredientsData }: IProps) {
  const { t } = useTranslation();

  const sortOptions = [
    { label: t("newest_first"), value: "-createdAt" },
    { label: t("oldest_first"), value: "createdAt" },
  ];

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <TitleHeader
        title="Ingredients Marketplace"
        subtitle="Purchase ingredients for your store"
      />

      {/* Filters */}
      <AllFilters sortOptions={sortOptions} />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ingredientsData.data?.map((item) => (
          <SingleIngredientCard key={item._id} item={item} />
        ))}
      </div>

      {/* Pagination */}
      {!!ingredientsData?.meta?.totalPage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 md:px-6"
        >
          <PaginationComponent
            totalPages={ingredientsData?.meta?.totalPage as number}
          />
        </motion.div>
      )}
    </div>
  );
}
