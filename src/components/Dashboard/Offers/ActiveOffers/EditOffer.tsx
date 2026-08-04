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
import { TMeta } from "@/src/types";
import { TOffer } from "@/src/types/offer.type";
import { TProduct } from "@/src/types/product.type";
import { translateObject } from "@/src/utils/translation/translationObject";
import { offerValidation } from "@/src/validations/offer/offer.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const PRIMARY = "#DC3173";

type TOfferForm = z.infer<typeof offerValidation>;

interface IProps {
  offer: TOffer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  t: (key: string) => string;
}

export default function EditOffer({ offer, open, onOpenChange, t }: IProps) {
  const router = useRouter();
  const { lang } = useStore();
  const [itemsResult, setItemsResult] = useState<{
    data: TProduct[];
    meta?: TMeta;
  }>({ data: [] });
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isSelectedAllProducts, setIsSelectedAllProducts] = useState(true);
  const form = useForm<TOfferForm>({
    resolver: zodResolver(offerValidation),
    values: {
      title: offer?.title || "",
      description: offer?.description || "",
      offerType: offer?.offerType || "PERCENT",
      discountValue: offer?.discountValue || 0,
      maxDiscountAmount: offer?.maxDiscountAmount || 0,
      buyQty: offer?.bogo?.buyQty || 1,
      getQty: offer?.bogo?.getQty || 1,
      buyProductId: offer?.bogo?.buyProductId || "",
      getProductId: offer?.bogo?.getProductId || "",
      validFrom: new Date(offer.validFrom),
      expiresAt: new Date(offer.expiresAt),
      minOrderAmount: offer?.minOrderAmount || 0,
      code: offer?.code || "",
      isAutoApply: offer?.isAutoApply || false,
      maxUsageCount: offer?.maxUsageCount ? String(offer.maxUsageCount) : "",
      userUsageLimit: offer?.userUsageLimit ? String(offer.userUsageLimit) : "",
      applicableProducts: offer?.applicableProducts ? (offer?.applicableProducts as string[]) : [],
      currentLang: lang
    },
  });
  const { formState: { isSubmitting } } = form;
  const [isAutoApply, setIsAutoApply] = useState(false);

  const [watchOfferType, watchApplicableProducts] = useWatch({
    control: form.control,
    name: ["offerType", "applicableProducts"],
  });

  const onSubmit = async (data: TOfferForm) => {
    const toastId = toast.loading("Updating offer...");

    let isAutoApply = data.isAutoApply;
    if (data.offerType === "BOGO") {
      isAutoApply = true;
    } else if (data.offerType === "FLAT") {
      delete data.maxDiscountAmount;
    } else if (isAutoApply) {
      delete data.code;
    } else {
      isAutoApply = data.isAutoApply;
    }

    try {
      const transPayload = {
        title: data.title,
        description: data.description
      };

      const translated = await translateObject(transPayload, lang);

      if (!translated) {
        toast.error("Translation failed!", { id: toastId });
        return;
      }

      const offerData: Partial<TOffer> = {
        title: translated.title ? translated.title : data.title,
        description: translated.description ? translated.description : data.description,

        offerType: data.offerType,
        validFrom: data.validFrom,
        expiresAt: data.expiresAt,
        minOrderAmount: data.minOrderAmount,
        applicableProducts: data.applicableProducts,
        ...(data.discountValue && { discountValue: data.discountValue }),
        ...(data.maxDiscountAmount && { maxDiscountAmount: data.maxDiscountAmount }),
        ...(data.code && { code: data.code }),
        ...(isAutoApply && { isAutoApply: isAutoApply }),

        ...(data.offerType === "BOGO"
          ? {
            bogo: {
              buyQty: data.buyQty as number,
              getQty: data.getQty as number,
              buyProductId: data.buyProductId as string,
              ...(data.getProductId && {
                getProductId: data.getProductId as string,
              })
            },
          }
          : {}),

        ...(data.maxUsageCount
          ? { maxUsageCount: Number(data.maxUsageCount) }
          : {}),

        ...(data.userUsageLimit
          ? { userUsageLimit: Number(data.userUsageLimit) }
          : {}),
      };

      if (isSelectedAllProducts) {
        delete offerData.applicableProducts;
      }

      if (data.maxUsageCount === "") {
        delete offerData.maxUsageCount;
      }

      if (data.userUsageLimit === "") {
        delete offerData.userUsageLimit;
      }

      const result = await updateOfferReq(offer._id, offerData);

      if (result.success) {
        router.refresh();
        toast.success(result.message || "Offer updated successfully!", {
          id: toastId,
        });
        form.reset();
        onOpenChange(false);
        return;
      }

      toast.error(result.message || "Offer updated failed", { id: toastId });
      console.log(result);
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Offer creation failed",
        { id: toastId }
      );
    }
  };

  const getItems = async ({ limit = 10 }) => {
    try {
      setIsLoadingProducts(true);

      const result = await getAllProductsReq({ limit });

      if (result.success) {
        setItemsResult({
          data: result.data,
          meta: result.meta,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applicableProducts = watchApplicableProducts || [];

  const filteredItems = useMemo(() => {
    return itemsResult.data.filter(
      (item) => !applicableProducts.includes(item._id as string)
    );
  }, [itemsResult.data, applicableProducts]);

  useEffect(() => {
    if (!isSelectedAllProducts) {
      getItems({ limit: 50 });
    }
  }, [isSelectedAllProducts]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-medium">
            {t("edit_offer")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <div className="space-y-4">
              <h2 className="font-bold text-lg">{t("offer_details")}</h2>
              <Separator />

              <FormField
                control={form.control}
                name={`title.${lang}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-sm text-gray-700">
                      {t("offer_title_20_perc_off")} <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("offer_title_20_perc_off")}
                        className="h-12 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`description.${lang}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-sm text-gray-700">
                      {t("offer_description")} <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("offer_description")}
                        className="text-base"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="offerType"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-2">
                        <FormLabel className="font-medium text-sm text-gray-700">
                          {t("offer_type")} <span className="text-red-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            className={cn(
                              "w-full h-12",
                              fieldState.invalid ? "border-destructive" : "",
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
                            <SelectItem value="BOGO">{t("buy_1_get_1")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CONDITIONAL INPUTS */}
              {watchOfferType === "PERCENT" && (
                <div className="flex flex-col md:flex-row items-center gap-5 w-full">
                  <FormField
                    control={form.control}
                    name="discountValue"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-medium text-sm text-gray-700">
                          {t("discount_perc_20")} <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("discount_perc_20")}
                            type="number"
                            min={0}
                            max={100}
                            className="h-12 text-base w-full"
                            {...field}
                            value={String(field.value)}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxDiscountAmount"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-medium text-sm text-gray-700">
                          {t("max_discount_amount")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("max_discount_amount")}
                            type="number"
                            min={0}
                            max={1000}
                            className="h-12 text-base w-full"
                            {...field}
                            value={String(field.value)}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

              )}

              {watchOfferType === "FLAT" && (
                <FormField
                  control={form.control}
                  name="discountValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm text-gray-700">
                        {t("discount_value")} <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("flat_discount")}
                          type="number"
                          min={0}
                          max={100}
                          className="h-12 text-base"
                          {...field}
                          value={String(field.value)}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {watchOfferType === "BOGO" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="buyProductId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-sm text-gray-700">
                          {t("buy_product")} <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full h-12!">
                                <SelectValue
                                  placeholder={t("choose_an_item")}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {itemsResult?.data.map((item: TProduct) => (
                                  <SelectItem
                                    key={item._id}
                                    value={item._id as string}
                                  >
                                    {item.name?.[lang]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="getProductId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-sm text-gray-700">
                          {t("get_product")}
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full h-12!">
                                <SelectValue
                                  placeholder={t("choose_an_item")}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {itemsResult?.data.map((item: TProduct) => (
                                  <SelectItem
                                    key={item._id}
                                    value={item._id as string}
                                  >
                                    {item.name?.[lang]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="buyQty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-sm text-gray-700">
                          {t("buy_quantity")} <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("buy_quantity")}
                            type="number"
                            min={1}
                            className="h-12 text-base"
                            {...field}
                            value={String(field.value)}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="getQty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-sm text-gray-700">
                          {t("get_quantity")} <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("get_quantity")}
                            type="number"
                            min={1}
                            className="h-12 text-base"
                            {...field}
                            value={String(field.value)}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

            </div>

            {/* VALIDITY */}
            <div className="space-y-4">
              <h2 className="font-bold text-lg">{t("validity")}</h2>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="validFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-2">
                          <FormLabel className="font-medium text-sm text-gray-700">
                            {t("start_date")} <span className="text-red-600">*</span>
                          </FormLabel>
                          <Input
                            type="date"
                            className="h-12"
                            min={format(new Date(), "yyyy-MM-dd")}
                            value={field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""}
                            onChange={(e) =>
                              field.onChange(e.target.value ? new Date(e.target.value) : null)
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-2">
                          <FormLabel className="font-medium text-sm text-gray-700">
                            {t("end_date")} <span className="text-red-600">*</span>
                          </FormLabel>
                          <Input
                            type="date"
                            className="h-12"
                            min={format(new Date(), "yyyy-MM-dd")}
                            value={field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""}
                            onChange={(e) =>
                              field.onChange(e.target.value ? new Date(e.target.value) : null)
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="minOrderAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-2">
                        <FormLabel className="font-medium text-sm text-gray-700">
                          {t("minimum_order_amount")}
                        </FormLabel>
                        <Input
                          type="number"
                          min={0}
                          className="h-12 text-base"
                          {...field}
                          value={String(field.value)}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maxUsageCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-2">
                          <FormLabel className="font-medium text-sm text-gray-700">
                            {t("maximum_usage_count")}
                          </FormLabel>
                          <Input
                            placeholder={t("maximum_usage_count")}
                            type="number"
                            min={0}
                            className="h-12 text-base"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userUsageLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-2">
                          <FormLabel className="font-medium text-sm text-gray-700">
                            {t("users_usage_limit")}
                          </FormLabel>
                          <Input
                            placeholder={t("users_usage_limit")}
                            type="number"
                            min={0}
                            className="h-12 text-base"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {watchOfferType !== "BOGO" && <FormField
                control={form.control}
                name="isAutoApply"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormLabel className="flex space-y-2 gap-2 items-center">
                        <Input
                          type="checkbox"
                          placeholder={t("offer_description")}
                          className="w-4 h-4 mb-0"
                          {...field}
                          checked={field.value ? true : false}
                          value={"true"}
                          onChange={(e) => {
                            field.onChange(e.target.checked);
                            setIsAutoApply(e.target.checked);
                          }}
                        />
                        <span
                          onClick={() => {
                            field.onChange(!field.value);
                            setIsAutoApply(!field.value)
                          }}
                          className="font-medium text-sm text-gray-700"
                        >
                          {t("will_auto_apply")}
                        </span>
                      </FormLabel>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />}
            </div>

            {/* PROMO CODE */}
            {(watchOfferType !== "BOGO" && !isAutoApply) && <div className="space-y-4">
              <h2 className="font-bold text-lg">{t("promo_code")}</h2>
              <Separator />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={t("enter_promo_code")}
                        className="h-12 text-base uppercase"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>}

            {/* APPLICABLE PRODUCTS */}
            <div className="space-y-4">
              <h2 className="font-bold text-lg">{t("applicable_products")}</h2>
              <Separator />

              <div className="flex items-center w-full gap-4">
                <Label className="font-medium text-sm text-gray-700">
                  <Input
                    className="w-4 h-4"
                    name="products"
                    type="radio"
                    checked={isSelectedAllProducts}
                    onChange={() => {
                      setIsSelectedAllProducts(true);
                    }}
                  />
                  <span>{t("all_products")}</span>
                </Label>
                <Label className="font-medium text-sm text-gray-700">
                  <Input
                    className="w-4 h-4"
                    name="products"
                    type="radio"
                    checked={!isSelectedAllProducts}
                    onChange={() => {
                      setIsSelectedAllProducts(false);
                    }}
                  />
                  <span>{t("selected_products")}</span>
                </Label>
              </div>

              {!isSelectedAllProducts &&
                watchApplicableProducts &&
                watchApplicableProducts?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-1">
                    {watchApplicableProducts?.map((itemId) => (
                      <div
                        key={itemId}
                        className="flex items-center bg-[#DC3173] bg-opacity-10 text-white px-3 py-1 rounded-full"
                      >
                        <span>
                          {itemsResult.data.find((i) => i._id === itemId)
                            ?.name?.[lang] || "-"}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            // setFilteredItems((prev) => {
                            //   const removedItem = itemsResult.data.find(
                            //     (i) => i._id === itemId,
                            //   );
                            //   if (removedItem) {
                            //     return [...prev, removedItem];
                            //   }
                            //   return prev;
                            // });
                            form.setValue(
                              "applicableProducts",
                              watchApplicableProducts.filter(
                                (i) => i !== itemId,
                              ),
                            );
                          }}
                          className="ml-2 text-white hover:text-[#CCC]"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              {!isSelectedAllProducts && (
                <FormField
                  control={form.control}
                  name="applicableProducts"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-2">
                          <Select
                            onValueChange={(value) => {
                              const newValue = [...(field.value || []), value];
                              field.onChange(newValue);
                            }}
                            value="select_products"
                          >
                            <SelectTrigger className="w-full h-12!">
                              <SelectValue placeholder={t("select_products")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="select_products">
                                {isLoadingProducts ? "Loading..." : t("select_products")}
                              </SelectItem>

                              {!isLoadingProducts &&
                                filteredItems.map((item) => (
                                  <SelectItem key={item._id} value={item._id as string}>
                                    {item.name?.[lang]}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* ACTION */}
            <div className="pt-4 flex justify-end gap-4">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 px-6 text-base"
                >
                  {t("cancel")}
                </Button>
              </DialogClose>
              <Button
                className="h-12 px-6 text-base text-white"
                style={{ background: PRIMARY }}
                disabled={isSubmitting}
              >
                {t("update")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
