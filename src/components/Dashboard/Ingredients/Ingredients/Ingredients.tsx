"use client";

import PaymentMethodSelectModal from "@/src/components/Dashboard/Ingredients/Ingredients/PaymentMethodSelectModal";
import SingleIngredientCard from "@/src/components/Dashboard/Ingredients/Ingredients/SingleIngredientCard";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { createIngredientPaymentIntentReq } from "@/src/services/dashboard/ingredient/ingredient.service";
import { TMeta } from "@/src/types";
import {
  TIngredient,
  TIngredientPaymentIntentPayload,
} from "@/src/types/ingredient.type";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

interface IProps {
  ingredientsData: { data: TIngredient[]; meta?: TMeta };
}

export default function Ingredients({ ingredientsData }: IProps) {
  const { t } = useTranslation();
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{
    ingredient: string;
    totalQuantity: number;
  } | null>(null);

  const sortOptions = [
    { label: t("newest_first"), value: "-createdAt" },
    { label: t("oldest_first"), value: "createdAt" },
  ];

  // const handlePlaceOrder = async () => {
  //   setIsOrdering(true);

  // };

  const purchaseIngredient = async (paymentMethod: string) => {
    setIsOrdering(true);
    const toastId = toast.loading("Proccessing payment...");

    const payload = {
      orderDetails,
      paymentMethod,
    } as TIngredientPaymentIntentPayload;

    const result = await createIngredientPaymentIntentReq(payload);

    setIsOrdering(false);

    if (result.success) {
      toast.success(
        "Payment processed successfully! Redirecting to payment page",
        {
          id: toastId,
        },
      );
      setOrderDetails(null);
      window.location.href = result.data?.redirectUrl;
      return;
    }

    toast.error(result.message || "Failed to place order", { id: toastId });
    console.log(result);
  };

  return (
    <div className="min-h-screen">
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
          <SingleIngredientCard
            key={item._id}
            item={item}
            setOrderDetails={setOrderDetails}
          />
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

      {/* Payment Method Select Modal */}
      <PaymentMethodSelectModal
        open={!!orderDetails?.ingredient}
        onOpenChange={(open) => !open && setOrderDetails(null)}
        onPurchase={purchaseIngredient}
        isOrdering={isOrdering}
      />
    </div>
  );
}
