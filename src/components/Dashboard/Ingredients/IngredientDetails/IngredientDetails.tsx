"use client";

import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { createIngredientPaymentIntentReq } from "@/src/services/dashboard/ingredient/ingredient.service";
import { TIngredient, TIngredientPaymentIntentPayload } from "@/src/types/ingredient.type";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Info,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Tag,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import PaymentMethodSelectModal from "../Ingredients/PaymentMethodSelectModal";
import { useTranslation } from "@/src/hooks/use-translation";

interface IProps {
  ingredient: TIngredient;
}

export default function IngredientDetail({ ingredient }: IProps) {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(ingredient.minOrder || 1);
  const [isOrdering, setIsOrdering] = useState(false);

  // FIX: Multi-item payload array matching backend specs
  const [orderDetails, setOrderDetails] = useState<{
    ingredientId: string;
    quantity: number;
  }[]>([]);

  const increment = () => setQuantity((q) => Math.min(ingredient.stock, q + 1));
  const decrement = () => setQuantity((q) => Math.max(ingredient.minOrder || 1, q - 1));

  // Determine current unit price based on optional tiered bulk discount thresholds
  const getCurrentUnitPrice = () => {
    if (!ingredient.bulkDiscount || ingredient.bulkDiscount.length === 0) {
      return ingredient.price;
    }
    const sortedTiers = [...ingredient.bulkDiscount].sort((a, b) => b.minQty - a.minQty);
    const activeTier = sortedTiers.find((tier) => quantity >= tier.minQty);

    return activeTier ? activeTier.discountPrice : ingredient.price;
  };

  const currentUnitPrice = getCurrentUnitPrice();
  const isDiscounted = currentUnitPrice < ingredient.price;

  // Determine status color metrics
  const isAvailable = ingredient.status === "available" && ingredient.stock > 0;

  const purchaseIngredient = async (paymentMethod: string) => {
    if (orderDetails.length === 0) return;

    setIsOrdering(true);
    const toastId = toast.loading("Processing payment...");

    const payload = {
      orderDetails,
      paymentMethod,
    } as TIngredientPaymentIntentPayload;

    const result = await createIngredientPaymentIntentReq(payload);
    setIsOrdering(false);

    if (result.success) {
      toast.success(
        "Payment processed successfully! Redirecting to payment page",
        { id: toastId }
      );
      setOrderDetails([]);
      window.location.href = result.data?.redirectUrl;
      return;
    }

    toast.error(result.message || "Failed to place order", { id: toastId });
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Navigation */}
      <div className="mb-4">
        <Link
          href="/vendor/ingredients"
          className="inline-flex items-center gap-2 text-[#DC3173] font-medium hover:underline mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          {t("back_to_ingredients")}
        </Link>
      </div>

      <TitleHeader
        title={t("ingredients_details")}
        subtitle={t("review_physical_inventor_allocations")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
        {/* Left Column: Media & Specifications */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="aspect-square rounded-3xl bg-white border border-gray-100 flex items-center justify-center shadow-sm overflow-hidden relative">
              <Image
                src={ingredient.image}
                alt={ingredient.name}
                width={500}
                height={500}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </motion.div>

          {/* Asset Metadata Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-3">
              <div className="p-3 bg-gray-50 rounded-xl text-gray-500">
                <Tag size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{t("sku_code")}</p>
                <p className="text-sm font-bold text-gray-800">{ingredient.sku}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-3">
              <div className="p-3 bg-gray-50 rounded-xl text-gray-500">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{t("shelf_life")}</p>
                <p className="text-sm font-bold text-gray-800">
                  {ingredient.shelfLifeDays ? `${ingredient.shelfLifeDays} ${t("days")}` : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Tier Discounts Render block (Bulk Discounts List) */}
          {ingredient.bulkDiscount && ingredient.bulkDiscount.length > 0 && (
            <div className="bg-linear-to-br from-amber-50/40 to-orange-50/20 border border-amber-100/70 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Package size={16} /> {t("volume_bulk_discount_schemes")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ingredient.bulkDiscount.map((tier, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl border transition-all ${quantity >= tier.minQty
                      ? "bg-amber-50 border-amber-300 shadow-sm"
                      : "bg-white border-gray-100 text-gray-500"
                      }`}
                  >
                    <p className="text-xs font-medium">{t("buy")} {tier.minQty}+ {ingredient.unit || "units"}</p>
                    <p className={`text-lg font-extrabold ${quantity >= tier.minQty ? "text-amber-700" : "text-gray-700"}`}>
                      €{tier.discountPrice.toFixed(2)} <span className="text-xs font-normal">/ {ingredient.unit || "unit"}</span>
                    </p>
                    {quantity >= tier.minQty && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-amber-200/60 text-amber-800 px-2 py-0.5 rounded-full font-bold mt-1">
                        <CheckCircle2 size={10} /> {t("active_tier_applied")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Calculations & Form Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DC3173]/10 text-[#DC3173]">
                {ingredient.category}
              </span>

              {/* STATUS FIELD: Explicit availability indicators */}
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isAvailable
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
                }`}>
                {isAvailable ? t("available_dot") : t("out_of_stock_suspended")}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              {ingredient.name}
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              {ingredient.description}
            </p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className={`text-3xl font-extrabold ${isDiscounted ? "text-amber-600" : "text-gray-900"}`}>
                €{currentUnitPrice.toFixed(2)}
              </span>
              <span className="text-gray-400 text-sm">/{ingredient.unit || "unit"}</span>
              {isDiscounted && (
                <span className="text-sm line-through text-gray-300 font-medium ml-2">
                  €{ingredient.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* NEW LIVE INVENTORY METRICS PROFILE DISPLAY */}
          <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("inventory_real_time_status")}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block">{t("current_status")}:</span>
                <span className={`font-bold capitalize ${isAvailable ? "text-green-600" : "text-red-600"}`}>
                  {ingredient.status}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">{t("stock_remaining")}:</span>
                <span className="font-bold text-gray-800">
                  {ingredient.stock} {ingredient.unit || "units"}
                </span>
              </div>
            </div>

            {/* BULK DISCOUNT OFFER STATEMENT */}
            {ingredient.bulkDiscount && ingredient.bulkDiscount.length > 0 ? (
              <p className="text-xs text-amber-700 font-medium bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/40">
                🎉 <strong>{t("bulk_discount_offer")}:</strong> {t("get_items_as_low_as")} <strong className="text-sm">€{Math.min(...ingredient.bulkDiscount.map(t => t.discountPrice)).toFixed(2)}</strong> {t("per_unit_by_increasing_your_order_quantities")}
              </p>
            ) : (
              <p className="text-xs text-gray-400 italic">{t("no_wholesale_bulk_discount_rates")}</p>
            )}
          </div>

          {/* Pricing Control Dynamic Panel */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg shadow-gray-100/30">
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold text-gray-700">{t("order_target_quantity")}</span>
              <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1">
                <button
                  type="button"
                  onClick={decrement}
                  className="p-2 bg-white rounded-lg text-[#DC3173] shadow-sm transition-all cursor-pointer hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                  disabled={quantity <= (ingredient.minOrder || 1) || !isAvailable}
                >
                  <Minus size={18} />
                </button>
                <span className="font-bold text-xl text-gray-900 w-12 text-center">
                  {isAvailable ? quantity : 0}
                </span>
                <button
                  type="button"
                  onClick={increment}
                  className="p-2 bg-white rounded-lg text-[#DC3173] shadow-sm transition-all cursor-pointer hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                  disabled={quantity >= ingredient.stock || !isAvailable}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Threshold Disclaimers */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50/60 p-3 rounded-xl">
                <Info size={16} className="shrink-0" />
                <span>{t("minimum_order_quantity")}: {ingredient.minOrder || 1} {t("units")}</span>
              </div>

              {/* Requested Line Placement */}
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">
                <Info size={16} className="shrink-0" />
                <span>{t("maximum_order_quantity")}: {ingredient.stock} t{("units")}</span>
              </div>
            </div>

            {/* Total Summary */}
            <div className="flex justify-between items-center mb-8 pt-6 border-t border-gray-100">
              <div>
                <span className="text-sm font-semibold text-gray-400 block uppercase tracking-wider">{t("subtotal_value")}</span>
                <span className="text-xs text-gray-400 font-medium">({t("excludes")} {ingredient.tax?.taxRate || 0}% {t("tax_profile")})</span>
              </div>
              <span className="text-3xl font-black text-[#DC3173]">
                €{(isAvailable ? quantity * currentUnitPrice : 0).toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              disabled={!isAvailable}
              onClick={() =>
                setOrderDetails([
                  {
                    ingredientId: ingredient._id,
                    quantity: quantity,
                  },
                ])
              }
              className="w-full py-4 bg-[#DC3173] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#DC3173]/10 hover:bg-[#DC3173]/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
            >
              <ShoppingCart size={22} />
              {isAvailable ? t("buy_now") : t("unavailable")}
            </button>
          </div>

          {/* Dispatch Conditions */}
          <div className="flex items-start gap-4 p-4 bg-blue-50/60 border border-blue-100 rounded-xl text-blue-800">
            <Truck size={24} className="shrink-0 mt-0.5 text-blue-600" />
            <div>
              <h4 className="font-bold text-sm mb-0.5">{t("fleet_logistics_distribution")}</h4>
              <p className="text-xs text-blue-700/80 leading-relaxed">
                {t("standard_bulk_supply_lines_arrive")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Method Select Trigger */}
      <PaymentMethodSelectModal
        open={orderDetails.length > 0}
        onOpenChange={(open) => !open && setOrderDetails([])}
        onPurchase={purchaseIngredient}
        isOrdering={isOrdering}
        t={t}
      />
    </div>
  );
}