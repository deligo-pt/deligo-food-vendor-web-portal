/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { updateOfferReq } from "@/src/services/dashboard/offers/offers";
import { getAllProductsReq } from "@/src/services/dashboard/products/products";
import { useStore } from "@/src/store/store";
import { TOffer } from "@/src/types/offer.type";
import { TProduct } from "@/src/types/product.type";
import { translateObject } from "@/src/utils/translation/translationObject";
import {
  getProductSkuOptions,
  offerValidation,
  productHasVariations,
  TOfferForm,
} from "@/src/validations/offer/offer.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { Resolver, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { ProductSelector } from "../CreateOffer/ProductSelection";
import { useRouter } from "next/navigation";

const PRIMARY = "#DC3173";

interface IProps {
  offer: TOffer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  t: (key: string) => string;
}


export default function EditOffer({ offer, open, onOpenChange, t }: IProps) {
  const { lang } = useStore();
  const router = useRouter();
  const [products, setProducts] = useState<TProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Derive initial values from existing offer
  const initialScopeType =
    (offer as any)?.scopeType === "SPECIFIC_PRODUCTS"
      ? ("SPECIFIC_PRODUCTS" as const)
      : undefined;

  const initialScopeProducts: string[] =
    (offer as any)?.scopeProducts ||
    (Array.isArray(offer?.applicableProducts)
      ? (offer.applicableProducts as string[])
      : []) ||
    [];

  const initialBuyAndReward = (offer as any)?.buyAndReward || {
    buy: {
      scope: "SPECIFIC_PRODUCTS",
      productIds: [],
      categoryIds: [],
      quantity: 1,
    },
    reward: {
      type: "SAME_PRODUCT",
      quantity: 1,
      productId: "",
      options: [],
    },
  };

  const form = useForm<TOfferForm>({
    resolver: zodResolver(offerValidation) as unknown as Resolver<TOfferForm>,
    mode: "onChange",
    defaultValues: {
      title: {
        en: (offer?.title as any)?.en || "",
        pt: (offer?.title as any)?.pt || "",
      },
      description: {
        en: (offer?.description as any)?.en || "",
        pt: (offer?.description as any)?.pt || "",
      },
      offerType: (offer?.offerType as any) || "PERCENT",
      discountValue: offer?.discountValue ?? undefined,
      maxDiscountAmount: offer?.maxDiscountAmount ?? undefined,
      scopeType: initialScopeType,
      scopeCategories: [],
      scopeProducts: initialScopeProducts,
      buyAndReward: {
        buy: {
          scope: "SPECIFIC_PRODUCTS",
          productIds: initialBuyAndReward?.buy?.productIds || [],
          categoryIds: [],
          quantity: initialBuyAndReward?.buy?.quantity || 1,
        },
        reward: {
          type: initialBuyAndReward?.reward?.type || "SAME_PRODUCT",
          quantity: initialBuyAndReward?.reward?.quantity || 1,
          productId: initialBuyAndReward?.reward?.productId || "",
          variationSku: initialBuyAndReward?.reward?.variationSku || "",
          options: (initialBuyAndReward?.reward?.options || []).map(
            (o: any) => ({
              productId: o.productId,
              variationSku: o.variationSku || "",
            }),
          ),
        },
      },
      validFrom: offer?.validFrom
        ? new Date(offer.validFrom)
        : new Date(),
      expiresAt: offer?.expiresAt
        ? new Date(offer.expiresAt)
        : new Date(),
      minOrderAmount: offer?.minOrderAmount ?? undefined,
      code: offer?.code || "",
      isAutoApply: offer?.isAutoApply ?? false,
      userUsageLimit: offer?.userUsageLimit
        ? String(offer.userUsageLimit)
        : "",
      isActive: (offer as any)?.isActive ?? true,
      currentLang: lang,
    },
  });

  const {
    formState: { isSubmitting },
    control,
    setValue,
    getValues,
    reset,
  } = form;

  // Reset form when offer changes / dialog opens
  useEffect(() => {
    if (open && offer) {
      const scopeType =
        (offer as any)?.scopeType === "SPECIFIC_PRODUCTS"
          ? "SPECIFIC_PRODUCTS"
          : undefined;
      const scopeProducts: string[] =
        (offer as any)?.scopeProducts ||
        (Array.isArray(offer?.applicableProducts)
          ? (offer.applicableProducts as string[])
          : []) ||
        [];
      const bar = (offer as any)?.buyAndReward;

      reset({
        title: {
          en: (offer?.title as any)?.en || "",
          pt: (offer?.title as any)?.pt || "",
        },
        description: {
          en: (offer?.description as any)?.en || "",
          pt: (offer?.description as any)?.pt || "",
        },
        offerType: (offer?.offerType as any) || "PERCENT",
        discountValue: offer?.discountValue,
        maxDiscountAmount: offer?.maxDiscountAmount,
        scopeType: scopeType as any,
        scopeCategories: [],
        scopeProducts,
        buyAndReward: {
          buy: {
            scope: "SPECIFIC_PRODUCTS",
            productIds: bar?.buy?.productIds || [],
            categoryIds: [],
            quantity: bar?.buy?.quantity || 1,
          },
          reward: {
            type: bar?.reward?.type || "SAME_PRODUCT",
            quantity: bar?.reward?.quantity || 1,
            productId: bar?.reward?.productId || "",
            variationSku: bar?.reward?.variationSku || "",
            options: (bar?.reward?.options || []).map((o: any) => ({
              productId: o.productId,
              variationSku: o.variationSku || "",
            })),
          },
        },
        validFrom: offer?.validFrom
          ? new Date(offer.validFrom)
          : new Date(),
        expiresAt: offer?.expiresAt
          ? new Date(offer.expiresAt)
          : new Date(),
        minOrderAmount: offer?.minOrderAmount ?? 0,
        code: offer?.code || "",
        isAutoApply: offer?.isAutoApply ?? false,
        userUsageLimit: offer?.userUsageLimit
          ? String(offer.userUsageLimit)
          : "",
        isActive: (offer as any)?.isActive ?? true,
        currentLang: lang,
      });
    }
  }, [open, offer, lang, reset]);

  const [
    watchOfferType,
    watchIsAutoApply,
    watchScopeType,
    watchRewardType,
    watchScopeProducts,
    watchBuyProductIds,
    watchRewardProductId,
    // watchRewardVariationSku,
    watchRewardOptions,
  ] = useWatch({
    control,
    name: [
      "offerType",
      "isAutoApply",
      "scopeType",
      "buyAndReward.reward.type",
      "scopeProducts",
      "buyAndReward.buy.productIds",
      "buyAndReward.reward.productId",
      // "buyAndReward.reward.variationSku",
      "buyAndReward.reward.options",
    ],
  });

  /* -------------------- Helpers -------------------- */
  const toggleInArray = (
    fieldName: "scopeProducts" | "buyAndReward.buy.productIds",
    id: string,
  ) => {
    const current = (getValues(fieldName) as string[]) || [];
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    setValue(fieldName, next, { shouldValidate: true });
  };

  const toggleCategoryProducts = (
    fieldName: "scopeProducts" | "buyAndReward.buy.productIds",
    categoryId: string,
    selectAll: boolean,
  ) => {
    const idsInCat = products
      .filter((p) => {
        const catId = (p as any).category?._id || "uncategorized";
        return catId === categoryId;
      })
      .map((p) => p._id as string);

    const current = (getValues(fieldName) as string[]) || [];
    const next = selectAll
      ? Array.from(new Set([...current, ...idsInCat]))
      : current.filter((id) => !idsInCat.includes(id));

    setValue(fieldName, next, { shouldValidate: true });
  };

  const selectSingleRewardProduct = (productId: string) => {
    const current = getValues("buyAndReward.reward.productId");
    setValue(
      "buyAndReward.reward.productId",
      current === productId ? "" : productId,
      { shouldValidate: true },
    );
    setValue("buyAndReward.reward.variationSku", "", { shouldValidate: true });
  };

  const setOptionSku = (productId: string, sku: string) => {
    const current =
      (getValues("buyAndReward.reward.options") as any[]) || [];
    setValue(
      "buyAndReward.reward.options",
      current.map((o) =>
        o.productId === productId ? { ...o, variationSku: sku } : o,
      ),
      { shouldValidate: true },
    );
  };

  const productsById = useMemo(() => {
    const map = new Map<string, TProduct>();
    products.forEach((p) => map.set(p._id as string, p));
    return map;
  }, [products]);

  const fixedRewardProduct = watchRewardProductId
    ? productsById.get(watchRewardProductId)
    : undefined;
  const fixedNeedsSku = fixedRewardProduct
    ? productHasVariations(fixedRewardProduct)
    : false;
  const fixedSkuOptions = fixedRewardProduct
    ? getProductSkuOptions(fixedRewardProduct, lang)
    : [];

  const toggleRewardOptionProduct = (productId: string) => {
    const current =
      (getValues("buyAndReward.reward.options") as any[]) || [];
    const exists = current.find((o) => o.productId === productId);

    if (exists) {
      setValue(
        "buyAndReward.reward.options",
        current.filter((o) => o.productId !== productId),
        { shouldValidate: true },
      );
    } else {
      setValue(
        "buyAndReward.reward.options",
        [...current, { productId, variationSku: "" }],
        { shouldValidate: true },
      );
    }
  };

  const selectedRewardOptionIds = useMemo(() => {
    return (watchRewardOptions || [])
      .map((o: any) => o.productId)
      .filter(Boolean);
  }, [watchRewardOptions]);

  /* -------------------- Load products -------------------- */
  useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        setIsLoadingProducts(true);
        const result = await getAllProductsReq(100);
        if (result.success) {
          setProducts(result.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    load();
  }, [open]);

  /* -------------------- SUBMIT -------------------- */
  const onSubmit = async (data: TOfferForm) => {
    const toastId = toast.loading("Updating offer...");

    try {
      const translated = await translateObject(
        { title: data.title, description: data.description },
        lang,
      );

      if (!translated) {
        toast.error("Translation failed!", { id: toastId });
        return;
      }

      const offerData: Record<string, any> = {
        title: translated.title || data.title,
        description: translated.description || data.description,
        offerType: data.offerType,
        validFrom: format(data.validFrom, "yyyy-MM-dd"),
        expiresAt: format(data.expiresAt, "yyyy-MM-dd"),
        ...(data.minOrderAmount != null && data.minOrderAmount > 0
          ? { minOrderAmount: data.minOrderAmount }
          : {}),
        ...(data.userUsageLimit
          ? { userUsageLimit: Number(data.userUsageLimit) }
          : {}),
        isActive: data.isActive ?? true,
        isAutoApply: data.isAutoApply ?? false,
      };

      if (data.offerType === "PERCENT" || data.offerType === "FLAT") {
        offerData.discountValue = data.discountValue;

        if (data.offerType === "PERCENT" && data.maxDiscountAmount != null) {
          offerData.maxDiscountAmount = data.maxDiscountAmount;
        }

        if (
          data.scopeType === "SPECIFIC_PRODUCTS" &&
          data.scopeProducts?.length
        ) {
          offerData.scopeType = "SPECIFIC_PRODUCTS";
          offerData.scopeProducts = data.scopeProducts;
        } else {
          offerData.scopeType = "ALL_PRODUCTS"
        }

        if (!data.isAutoApply && data.code) {
          offerData.code = data.code.toUpperCase();
        }
      }

      if (data.offerType === "BUY_AND_REWARD" && data.buyAndReward) {
        offerData.isAutoApply = true;

        const buy: Record<string, any> = {
          scope: "SPECIFIC_PRODUCTS",
          productIds: data.buyAndReward.buy.productIds || [],
          quantity: data.buyAndReward.buy.quantity,
        };

        const reward: Record<string, any> = {
          type: data.buyAndReward.reward.type,
          quantity: data.buyAndReward.reward.quantity,
        };

        if (data.buyAndReward.reward.type === "FIXED_PRODUCT") {
          reward.productId = data.buyAndReward.reward.productId;
          if (data.buyAndReward.reward.variationSku) {
            reward.variationSku = data.buyAndReward.reward.variationSku;
          }
        }

        if (data.buyAndReward.reward.type === "CUSTOMER_CHOICE") {
          reward.options = (data.buyAndReward.reward.options || [])
            .filter((opt) => opt.productId)
            .map((opt) => {
              const o: any = { productId: opt.productId };
              if (opt.variationSku) o.variationSku = opt.variationSku;
              return o;
            });
        }

        offerData.buyAndReward = { buy, reward };
      };

      const result = await updateOfferReq(offer._id, offerData as Partial<TOffer>);

      if (result.success) {
        toast.success(result.message || "Offer updated successfully!", {
          id: toastId,
        });
        onOpenChange(false);
        router.refresh();
        return;
      }

      if (result?.data?.errorSources) {
        result.data.errorSources.forEach(
          (err: { path: string; message: string }) => {
            toast.error(err.message, { id: toastId });
          },
        );
        return;
      }

      toast.error(result.message || "Offer update failed", { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Offer update failed",
        { id: toastId },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-medium">
            {t("edit_offer")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* ===================== OFFER DETAILS ===================== */}
            <div className="space-y-4">
              <h2 className="font-bold text-lg">{t("offer_details")}</h2>
              <Separator />

              <FormField
                control={control}
                name={`title.${lang}` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("offer_title_20_perc_off")}{" "}
                      <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("offer_title_20_perc_off")}
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`description.${lang}` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("offer_description")}{" "}
                      <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("offer_description")}
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="offerType"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      {t("offer_type")}{" "}
                      <span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        if (val === "BUY_AND_REWARD") {
                          setValue("isAutoApply", true);
                        }
                      }}
                      value={field.value}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full h-11",
                          fieldState.invalid && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder={t("select_type")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERCENT">
                          {t("percentage_discount")}
                        </SelectItem>
                        <SelectItem value="FLAT">
                          {t("flat_amount_off")}
                        </SelectItem>
                        <SelectItem value="BUY_AND_REWARD">
                          Buy & Reward
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PERCENT / FLAT */}
              {(watchOfferType === "PERCENT" ||
                watchOfferType === "FLAT") && (
                  <>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <FormField
                        control={control}
                        name="discountValue"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>
                              {watchOfferType === "PERCENT"
                                ? t("discount_perc_20")
                                : t("discount_value")}{" "}
                              <span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                max={
                                  watchOfferType === "PERCENT"
                                    ? 100
                                    : undefined
                                }
                                className="h-11"
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? undefined
                                      : Number(e.target.value),
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {watchOfferType === "PERCENT" && (
                        <FormField
                          control={control}
                          name="maxDiscountAmount"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>
                                {t("max_discount_amount")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  className="h-11"
                                  value={field.value ?? ""}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value === ""
                                        ? undefined
                                        : Number(e.target.value),
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="font-medium text-sm text-gray-700">
                        Applicable Products
                      </Label>
                      <div className="flex flex-wrap gap-5">
                        <Label className="flex items-center gap-2 cursor-pointer">
                          <Input
                            type="radio"
                            className="w-4 h-4 accent-[#DC3173]"
                            checked={!watchScopeType}
                            onChange={() => {
                              setValue("scopeType", undefined);
                              setValue("scopeProducts", []);
                            }}
                          />
                          <span className="text-sm">All Products</span>
                        </Label>
                        <Label className="flex items-center gap-2 cursor-pointer">
                          <Input
                            type="radio"
                            className="w-4 h-4 accent-[#DC3173]"
                            checked={
                              watchScopeType === "SPECIFIC_PRODUCTS"
                            }
                            onChange={() => {
                              setValue("scopeType", "SPECIFIC_PRODUCTS");
                            }}
                          />
                          <span className="text-sm">
                            Specific Products
                          </span>
                        </Label>
                      </div>

                      {watchScopeType === "SPECIFIC_PRODUCTS" && (
                        <FormField
                          control={control}
                          name="scopeProducts"
                          render={() => (
                            <FormItem className="space-y-2">
                              {isLoadingProducts ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">
                                  Loading products...
                                </p>
                              ) : (
                                <ProductSelector
                                  products={products}
                                  lang={lang}
                                  selectionMode="multi"
                                  selectedIds={watchScopeProducts || []}
                                  onToggle={(id) =>
                                    toggleInArray("scopeProducts", id)
                                  }
                                  onToggleCategory={(catId, selectAll) =>
                                    toggleCategoryProducts(
                                      "scopeProducts",
                                      catId,
                                      selectAll,
                                    )
                                  }
                                  height="h-52"
                                />
                              )}
                              {(watchScopeProducts?.length ?? 0) > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  {watchScopeProducts!.length} product
                                  {watchScopeProducts!.length === 1
                                    ? ""
                                    : "s"}{" "}
                                  selected
                                </p>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </>
                )}

              {/* BUY_AND_REWARD */}
              {watchOfferType === "BUY_AND_REWARD" && (
                <div className="space-y-5 border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">
                      Buy Condition
                    </h3>

                    <FormField
                      control={control}
                      name="buyAndReward.buy.quantity"
                      render={({ field }) => (
                        <FormItem className="max-w-[140px]">
                          <FormLabel>
                            Buy Quantity{" "}
                            <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              className="h-11"
                              value={field.value ?? 1}
                              onChange={(e) =>
                                field.onChange(
                                  Number(e.target.value) || 1,
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="buyAndReward.buy.productIds"
                      render={() => (
                        <FormItem className="space-y-2">
                          <FormLabel>
                            Products to buy{" "}
                            <span className="text-red-600">*</span>
                          </FormLabel>
                          {isLoadingProducts ? (
                            <p className="text-sm text-muted-foreground py-4 text-center">
                              Loading products...
                            </p>
                          ) : (
                            <ProductSelector
                              products={products}
                              lang={lang}
                              selectionMode="multi"
                              selectedIds={watchBuyProductIds || []}
                              onToggle={(id) =>
                                toggleInArray(
                                  "buyAndReward.buy.productIds",
                                  id,
                                )
                              }
                              onToggleCategory={(catId, selectAll) =>
                                toggleCategoryProducts(
                                  "buyAndReward.buy.productIds",
                                  catId,
                                  selectAll,
                                )
                              }
                              height="h-48"
                            />
                          )}
                          {(watchBuyProductIds?.length ?? 0) > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {watchBuyProductIds!.length} product
                              {watchBuyProductIds!.length === 1
                                ? ""
                                : "s"}{" "}
                              selected
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Reward</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FormField
                        control={control}
                        name="buyAndReward.reward.type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reward Type</FormLabel>
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val);
                                setValue(
                                  "buyAndReward.reward.productId",
                                  "",
                                );
                                setValue(
                                  "buyAndReward.reward.variationSku",
                                  "",
                                );
                                setValue(
                                  "buyAndReward.reward.options",
                                  [],
                                );
                              }}
                              value={field.value}
                            >
                              <SelectTrigger className="h-11">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="SAME_PRODUCT">
                                  Same Product
                                </SelectItem>
                                <SelectItem value="FIXED_PRODUCT">
                                  Fixed Product
                                </SelectItem>
                                <SelectItem value="CUSTOMER_CHOICE">
                                  Customer Choice
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="buyAndReward.reward.quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Reward Quantity{" "}
                              <span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                className="h-11"
                                value={field.value ?? 1}
                                onChange={(e) =>
                                  field.onChange(
                                    Number(e.target.value) || 1,
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {watchRewardType === "FIXED_PRODUCT" && (
                      <div className="space-y-3">
                        <FormField
                          control={control}
                          name="buyAndReward.reward.productId"
                          render={() => (
                            <FormItem className="space-y-2">
                              <FormLabel>
                                Reward Product{" "}
                                <span className="text-red-600">*</span>
                              </FormLabel>
                              <ProductSelector
                                products={products}
                                lang={lang}
                                selectionMode="single"
                                selectedIds={
                                  watchRewardProductId
                                    ? [watchRewardProductId]
                                    : []
                                }
                                onToggle={(id) =>
                                  selectSingleRewardProduct(id)
                                }
                                onToggleCategory={() => { }}
                                height="h-48"
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {fixedNeedsSku && (
                          <FormField
                            control={control}
                            name="buyAndReward.reward.variationSku"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Variation SKU{" "}
                                  <span className="text-red-600">*</span>
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value || ""}
                                >
                                  <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select variation SKU" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {fixedSkuOptions.map((opt) => (
                                      <SelectItem
                                        key={opt.sku}
                                        value={opt.sku}
                                      >
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    )}

                    {watchRewardType === "CUSTOMER_CHOICE" && (
                      <FormField
                        control={control}
                        name="buyAndReward.reward.options"
                        render={() => (
                          <FormItem className="space-y-2">
                            <FormLabel>
                              Reward Options{" "}
                              <span className="text-red-600">*</span>
                            </FormLabel>
                            <ProductSelector
                              products={products}
                              lang={lang}
                              selectionMode="multi"
                              selectedIds={selectedRewardOptionIds}
                              onToggle={(id) =>
                                toggleRewardOptionProduct(id)
                              }
                              onToggleCategory={(catId, selectAll) => {
                                const idsInCat = products
                                  .filter((p) => {
                                    const cId =
                                      (p as any).category?._id ||
                                      "uncategorized";
                                    return cId === catId;
                                  })
                                  .map((p) => p._id as string);

                                const current =
                                  (getValues(
                                    "buyAndReward.reward.options",
                                  ) as any[]) || [];

                                if (selectAll) {
                                  const existingIds = new Set(
                                    current.map((o) => o.productId),
                                  );
                                  const toAdd = idsInCat
                                    .filter(
                                      (id) => !existingIds.has(id),
                                    )
                                    .map((id) => ({ productId: id, variationSku: "" }));
                                  setValue(
                                    "buyAndReward.reward.options",
                                    [...current, ...toAdd],
                                    { shouldValidate: true },
                                  );
                                } else {
                                  setValue(
                                    "buyAndReward.reward.options",
                                    current.filter(
                                      (o) =>
                                        !idsInCat.includes(o.productId),
                                    ),
                                    { shouldValidate: true },
                                  );
                                }
                              }}
                              height="h-48"
                            />
                            {/* SKU required when product has variations */}
                            {selectedRewardOptionIds.length > 0 && (
                              <div className="space-y-2 pt-2 border-t border-gray-100">
                                {(watchRewardOptions || []).map((opt: any) => {
                                  if (!opt.productId) return null;
                                  const prod = productsById.get(opt.productId);
                                  if (!prod || !productHasVariations(prod))
                                    return null;
                                  const skuOpts = getProductSkuOptions(
                                    prod,
                                    lang,
                                  );
                                  return (
                                    <div key={opt.productId} className="space-y-1">
                                      <Label className="text-sm">
                                        SKU for{" "}
                                        {prod.name?.[lang as "en" | "pt"] ||
                                          "product"}{" "}
                                        <span className="text-red-600">*</span>
                                      </Label>
                                      <Select
                                        value={opt.variationSku || ""}
                                        onValueChange={(sku) =>
                                          setOptionSku(opt.productId, sku)
                                        }
                                      >
                                        <SelectTrigger className="h-10">
                                          <SelectValue placeholder="Select variation SKU" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {skuOpts.map((s) => (
                                            <SelectItem
                                              key={s.sku}
                                              value={s.sku}
                                            >
                                              {s.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            {selectedRewardOptionIds.length > 0 && (
                              <p className="text-xs text-muted-foreground">
                                {selectedRewardOptionIds.length} option
                                {selectedRewardOptionIds.length === 1
                                  ? ""
                                  : "s"}{" "}
                                selected
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ===================== VALIDITY ===================== */}
            <div className="space-y-4">
              <h2 className="font-bold text-lg">{t("validity")}</h2>
              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="validFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("start_date")}{" "}
                        <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="h-11"
                          value={
                            field.value
                              ? format(
                                new Date(field.value),
                                "yyyy-MM-dd",
                              )
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? new Date(e.target.value)
                                : null,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("end_date")}{" "}
                        <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="h-11"
                          value={
                            field.value
                              ? format(
                                new Date(field.value),
                                "yyyy-MM-dd",
                              )
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? new Date(e.target.value)
                                : null,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name="minOrderAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("minimum_order_amount")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        className="h-11"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="userUsageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("users_usage_limit")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        className="h-11"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchOfferType !== "BUY_AND_REWARD" && (
                <FormField
                  control={control}
                  name="isAutoApply"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 cursor-pointer">
                        <Input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={!!field.value}
                          onChange={(e) =>
                            field.onChange(e.target.checked)
                          }
                        />
                        <span>{t("will_auto_apply")}</span>
                      </FormLabel>
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* ===================== PROMO CODE ===================== */}
            {watchOfferType !== "BUY_AND_REWARD" &&
              !watchIsAutoApply && (
                <div className="space-y-3">
                  <h2 className="font-bold text-lg">
                    {t("promo_code")}
                  </h2>
                  <Separator />
                  <FormField
                    control={control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder={t("enter_promo_code")}
                            className="h-11 uppercase"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value.toUpperCase(),
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

            {/* ===================== ACTIONS ===================== */}
            <div className="pt-2 flex justify-end gap-3">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 px-5"
                >
                  {t("cancel")}
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="h-11 px-5 text-white"
                style={{ background: PRIMARY }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : t("update")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}