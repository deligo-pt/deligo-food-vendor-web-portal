"use client";

import AddVariationForm from "@/src/components/Dashboard/Products/VariationManagement/AddVariationForm";
import AddVaritionOptionForm from "@/src/components/Dashboard/Products/VariationManagement/AddVaritionOptionForm";
import VariationDeleteButton from "@/src/components/Dashboard/Products/VariationManagement/VariationDeleteButton";
import VariationInlineEdit from "@/src/components/Dashboard/Products/VariationManagement/VariationInlineEdit";
import VariationOptionRow from "@/src/components/Dashboard/Products/VariationManagement/VariationOptionRow";
import {
  removeVariationReq,
  renameVariationReq,
  updateVariationPrice,
} from "@/src/services/dashboard/products/variation";
import { useStore } from "@/src/store/store";
import { LocalizedType } from "@/src/types";
import { TProduct } from "@/src/types/product.type";
import { translateObject } from "@/src/utils/translation/translationObject";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircleIcon,
  ChevronDownIcon,
  LayersIcon,
  PlusIcon,
  TagIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DEFAULT_PRODUCT_IMAGE, getProductImage } from "@/src/consts/product.const";

interface IProps {
  product: TProduct;
  businessTypeSlug: "store" | "restaurant";
  t: (key: string) => string;
}

export default function ProductVariationCard({ product, businessTypeSlug, t }: IProps) {
  const { lang } = useStore();
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddVariation, setShowAddVariation] = useState(false);
  const [addingOptionFor, setAddingOptionFor] = useState<LocalizedType>({});

  const variationCount = product?.variations?.length || 0;
  const optionCount = (product?.variations || [])?.reduce(
    (sum, v) => sum + (v?.options?.length || 0),
    0,
  );

  // A renamed name or label is translated again: the translator keeps a
  // filled other language, which would leave the old name there.
  const renamed = (value: LocalizedType | undefined, next: string) => {
    const other = lang === "en" ? "pt" : "en";
    return {
      [lang]: next,
      [other]: next === value?.[lang] ? (value?.[other] ?? "") : "",
    } as { en: string; pt: string };
  };

  const renameVariation = async (data: {
    oldName: string;
    newName?: { en: string; pt: string };
    oldLabel?: string;
    newLabel?: { en: string; pt: string };
  }) => {
    const toastId = toast.loading("Renaming variation...");
    const translated = await translateObject(data, lang);

    if (!translated) {
      // Cancelled in the translation dialog: back to the form, nothing saved.
      toast.dismiss(toastId);
      return;
    }

    const result = await renameVariationReq(product.productId, translated);

    if (result.success) {
      toast.success(result.message || "Variation renamed successfully!", {
        id: toastId,
      });
      router.refresh();
      return;
    }

    toast.error(result.message || "Failed to rename variation.", {
      id: toastId,
    });
    console.log(result);
  };

  const updatePrice = async (variation: {
    newPrice: number;
    variationSku: string;
  }) => {
    // Already a number: `VariationPriceInlineEdit` parses comma or dot. The old
    // `/[^0-9.]/g` clean-up saved "9,99" as 999.
    const numericPrice = variation.newPrice;

    const toastId = toast.loading("Updating variation price...");

    const payload = {
      newPrice: numericPrice,
      variationSku: variation.variationSku
    }

    const result = await updateVariationPrice(product.productId, payload);

    if (result.success) {
      toast.success(result.message || "Variation price updated successfully!", {
        id: toastId,
      });
      router.refresh();
      return;
    }

    toast.error(result.message || "Failed to update variation price.", {
      id: toastId,
    });
    console.log(result);
  };

  const deleteVariation = async (data: {
    name: string;
    labelToRemove?: string;
  }) => {
    const toastId = toast.loading("Deleting variation...");
    const result = await removeVariationReq(product.productId, data);

    if (result.success) {
      toast.success(result.message || "Variation deleted successfully!", {
        id: toastId,
      });
      router.refresh();
      return;
    }

    toast.error(result.message || "Failed to delete variation.", {
      id: toastId,
    });
    console.log(result);
  };

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div
        className="p-5 flex items-center gap-5 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
          <Image
            src={getProductImage(product) || DEFAULT_PRODUCT_IMAGE}
            alt={product.name?.[lang] as string}
            className="w-full h-full object-fill"
            width={300}
            height={300}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-gray-900 truncate">
              {product.name?.[lang]}
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            {variationCount > 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
                <LayersIcon size={11} />
                {t(variationCount === 1 ? "variation_count_one" : "variation_count_other").replace("{count}", String(variationCount))} ·{" "}
                {t(optionCount === 1 ? "option_count_one" : "option_count_other").replace("{count}", String(optionCount))}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                {t("no_variations")}
              </span>
            )}
            <span className="text-xs text-gray-400">
              {product.category.name?.[lang]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* One variation group per product (23 Oct 2026): a product that has
              one adds options to it instead. Products saved earlier with
              several groups keep them. */}
          {variationCount === 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddVariation(true);
                if (!isExpanded) setIsExpanded(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#DC3173] bg-[#DC3173]/10 rounded-lg hover:bg-[#DC3173]/30 transition-colors"
            >
              <PlusIcon size={14} />
              {t("add_variation")}
            </button>
          )}

          <motion.div
            animate={{
              rotate: isExpanded ? 180 : 0,
            }}
            transition={{
              duration: 0.2,
            }}
            className="text-gray-400"
          >
            <ChevronDownIcon size={20} />
          </motion.div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 bg-gray-50/40 p-5 space-y-4">
              {variationCount > 0 && (
                <p className="text-xs font-medium text-[#DC3173]" data-testid="variation-one-group-note">
                  {t("variation_one_group_note")}
                </p>
              )}

              {/* Add Variation Form */}
              <AnimatePresence>
                {showAddVariation && variationCount === 0 && (
                  <AddVariationForm
                    productId={product.productId}
                    onCancel={() => setShowAddVariation(false)}
                    businessTypeSlug={businessTypeSlug}
                  />
                )}
              </AnimatePresence>

              {/* Variation Groups */}
              {product?.variations?.length === 0 && !showAddVariation && (
                <div className="text-center py-8">
                  <div className="inline-flex p-3 bg-white rounded-full text-gray-300 mb-3 shadow-sm">
                    <LayersIcon size={28} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    {t("no_variations")}
                  </p>
                  {/* <p className="text-xs text-gray-400 mt-1">
                    Click &ldquo;Add Variation&rdquo; to create one
                  </p> */}
                </div>
              )}

              <AnimatePresence mode="popLayout">
                {product?.variations?.map((variation, vIdx) => (
                  <motion.div
                    key={`${vIdx}-${variation.name}`}
                    layout
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    {/* Variation Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-gray-50">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="p-1 bg-[#DC3173]/10 rounded-md">
                          <TagIcon size={14} className="text-[#DC3173]" />
                        </div>
                        <VariationInlineEdit
                          value={variation.name?.[lang] as string}
                          onSave={(newName) =>
                            renameVariation({
                              oldName: variation.name?.en as string,
                              newName: renamed(variation.name, newName),
                            })
                          }
                          t={t}
                          className="text-sm font-bold text-gray-900"
                        />
                        <span className="shrink-0 text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                          {t(variation.options.length === 1 ? "option_count_one" : "option_count_other").replace("{count}", String(variation.options.length))}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setAddingOptionFor(variation.name)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#DC3173] hover:bg-[#DC3173]/10 rounded-lg transition-colors"
                        >
                          <PlusIcon size={13} />
                          {t("option_lg")}
                        </button>
                        <VariationDeleteButton
                          onConfirm={() =>
                            // The API finds the group by its English name, whatever the panel's
                            // language (in PT, "Tamanho" answered "could not be found").
                            deleteVariation({ name: (variation.name?.en ?? variation.name?.[lang]) as string })
                          }
                          label={t("delete_variation")}
                        />
                      </div>
                    </div>

                    {/* Options List */}
                    <div className="divide-y divide-gray-50">
                      <AnimatePresence mode="popLayout">
                        {variation.options.map((option, oIdx) => (
                          <motion.div
                            key={`${oIdx}-${option.sku}`}
                            layout
                            initial={{
                              opacity: 0,
                            }}
                            animate={{
                              opacity: 1,
                            }}
                            exit={{
                              opacity: 0,
                              x: -20,
                            }}
                          >
                            <VariationOptionRow
                              label={option.label?.[lang] as string}
                              price={option.price}
                              stock={
                                businessTypeSlug === "store"
                                  ? { quantity: option.stockQuantity, isOutOfStock: option.isOutOfStock }
                                  : undefined
                              }
                              onRename={(newLabel) =>
                                renameVariation({
                                  oldName: variation.name?.en as string,
                                  oldLabel: option.label?.en,
                                  newLabel: renamed(option.label, newLabel),
                                })
                              }
                              onPrice={(newPrice) =>
                                updatePrice({
                                  newPrice,
                                  variationSku: option?.sku,
                                })
                              }
                              onDelete={() =>
                                deleteVariation({
                                  name: (variation.name?.en ?? variation.name?.[lang]) as string,
                                  labelToRemove: option.label?.en ?? option.label?.[lang],
                                })
                              }
                              t={t}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {variation.options.length === 0 && (
                        <div className="px-4 py-4 text-center">
                          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                            <AlertCircleIcon size={12} />
                            {t("no_options_add_one")}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Add Option Form */}
                    <AnimatePresence>
                      {(addingOptionFor.en || addingOptionFor.pt) && (
                        <div className="px-4 pb-3">
                          <AddVaritionOptionForm
                            productId={product.productId}
                            variationName={addingOptionFor}
                            onCancel={() => setAddingOptionFor({ en: "", pt: "" })}
                            businessTypeSlug={businessTypeSlug}
                            t={t}
                          />
                        </div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
