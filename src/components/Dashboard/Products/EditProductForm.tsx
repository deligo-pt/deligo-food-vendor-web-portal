/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/src/hooks/use-translation";
import { getAddOnsGroupReq } from "@/src/services/dashboard/add-ons/add-ons";
import { getAllProductCategoriesReq } from "@/src/services/dashboard/categories/product-categories";
import { getAllTaxesReq } from "@/src/services/dashboard/taxes/taxes";
import { useStore } from "@/src/store/store";
import {
  DEFAULT_PRODUCT_IMAGE,
  getProductImage,
  isDefaultProductImage,
} from "@/src/consts/product.const";
import { TMeta, TResponse } from "@/src/types";
import { TAddonGroup } from "@/src/types/add-ons.type";
import { TProductCategory } from "@/src/types/category.type";
import { TProduct } from "@/src/types/product.type";
import { TTax } from "@/src/types/tax.type";
import { catchAsync } from "@/src/utils/catchAsync";
import { updateData } from "@/src/utils/requests";
import { translateObject } from "@/src/utils/translation/translationObject";
import { productValidation } from "@/src/validations/product/product.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ImageIcon,
  LayersIcon,
  PackageIcon,
  SaveIcon,
  StarIcon,
  TagIcon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import BasicInfoForm from "./BasicInfoForm";
import ImageAndDescriptionForm from "./Image&DescriptionForm";
import PricingForm from "./PricingForm";
import StockInformationForm from "./StockInformationForm";
import DeligoMetadata from "./DeligoMetadata";
import TitleHeader from "../../TitleHeader/TitleHeader";

type FormData = z.infer<typeof productValidation>;

interface IProps {
  prevData: TProduct;
  closeModal: () => void;
  businessTypeSlug: string;
}

interface IData<T> {
  data: T[];
  meta?: TMeta;
}

export function EditProductForm({
  prevData,
  closeModal,
  businessTypeSlug,
}: IProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const { lang } = useStore();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: t("basic_info"),
      icon: <PackageIcon className="h-5 w-5" />,
    },
    {
      name: t("images"),
      icon: <ImageIcon className="h-5 w-5" />,
    },
    {
      name: t("add_ons_and_variants"),
      icon: <LayersIcon className="h-5 w-5" />,
    },
    {
      name: t("pricing"),
      icon: <TagIcon className="h-5 w-5" />,
    },
    ...(businessTypeSlug !== "restaurant"
      ? [
        {
          name: t("stock"),
          icon: <PackageIcon className="h-5 w-5" />,
        },
      ]
      : []),
    {
      name: "DeliGo Metadata",
      icon: <StarIcon className="h-5 w-5" />,
    },
  ];

  const lastTabIndex = businessTypeSlug !== "restaurant" ? 5 : 4;
  const [addonGroupsData, setAddonsGroupsData] = useState<IData<TAddonGroup>>({
    data: [],
  });
  const [productCategoriesData, setProductCategoriesData] = useState<TProductCategory[]>([]);
  const [taxesData, setTaxesData] = useState<TTax[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(productValidation),
    defaultValues: {
      name: prevData?.name || "",
      // Seeded from whichever field the product actually carries, and with the
      // fallback picture filtered out: a product saved without an image gets
      // `DEFAULT_PRODUCT_IMAGE` on the server, and showing that back here
      // presented it as something the vendor had uploaded — deletable, and
      // occupying the one slot so "Replace image" was the only way past it. An
      // empty slot is the truth, and saving still re-applies the default.
      // A product saved under an earlier default (dl1) is treated the same way.
      images: [getProductImage(prevData)].filter(
        (url): url is string => Boolean(url) && !isDefaultProductImage(url),
      ),
      description: prevData?.description || "",
      category: prevData?.category?._id || "",
      price: prevData?.pricing?.price || 0,
      discountType: prevData?.pricing?.discountType ?? "",
      discount: prevData?.pricing?.discount ?? 0,
      taxId: String(prevData?.pricing?.taxId || ""),
      addonGroups: prevData?.addonGroups || [],
      variations: prevData?.variations || [],
      quantity: prevData?.stock?.quantity || 0,
      unit: prevData?.stock?.unit || "",
      availabilityStatus: prevData?.stock?.availabilityStatus || "",
      isFeatured: prevData?.meta?.isFeatured || false,
      isAvailableForPreOrder: prevData?.meta?.isAvailableForPreOrder || false,
      isActive: prevData?.meta?.status === "ACTIVE" ? true : false,
      businessTypeSlug,
      currentLang: lang
    },
  });

  const [tabError, setTabError] = useState(
    tabs.reduce(
      (err, t) => {
        err[t.name] = false;
        return err;
      },
      {} as Record<string, boolean>,
    ),
  );

  const [watchPrice, watchDiscount, watchDiscountType, watchTaxId, watchAddons, watchVariations] =
    useWatch({
      control: form.control,
      name: ["price", "discount", "discountType", "taxId", "addonGroups", "variations"],
    });

  // The name in the heading, same rule as the create form: the current
  // language's name, falling back to the other so the heading is never blank
  // for a product that only has one translation. Watched rather than read from
  // `prevData`, so renaming the item updates the heading as it is typed.
  const [nameEn, namePt] = useWatch({
    control: form.control,
    name: ["name.en", "name.pt"],
  });
  const productName = (lang === "pt" ? namePt || nameEn : nameEn || namePt)?.trim();
  const headerTitle = productName
    ? `${t("update_item")} - ${productName}`
    : t("update_item");

  const addAddon = (id: string) => {
    if (!form?.getValues("addonGroups")?.includes(id)) {
      const newAddonGroups = [...form?.getValues("addonGroups"), id];
      form.setValue("addonGroups", newAddonGroups);
    }
  };

  const removeAddon = (idToRemove: string) => {
    const newAddonGroups = form
      ?.getValues("addonGroups")
      ?.filter((id) => id !== idToRemove);
    form.setValue("addonGroups", newAddonGroups);
  };

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading("Updating product...");
    setIsSubmitting(true);

    const productData: Record<string, any> = {};

    // Helper to check if a value really changed
    const hasChanged = (current: any, original: any) => {
      // Handle arrays
      if (Array.isArray(current) || Array.isArray(original)) {
        return JSON.stringify(current || []) !== JSON.stringify(original || []);
      }
      // Handle primitive values (including boolean, number, string)
      return current !== original;
    };

    // name & description (with translation)
    const originalName = prevData?.name || "";
    const originalDescription = prevData?.description || "";

    if (hasChanged(data.name, originalName) || hasChanged(data.description, originalDescription)) {
      const translated = await translateObject(
        { name: data.name, description: data.description },
        lang
      );

      if (!translated) {
        toast.error("Translation failed!", { id: toastId });
        setIsSubmitting(false);
        return;
      }

      if (hasChanged(data.name, originalName)) {
        productData.name = translated.name;
      }
      if (hasChanged(data.description, originalDescription)) {
        productData.description = translated.description;
      }
    }

    // category
    if (hasChanged(data.category, prevData?.category?._id || "")) {
      productData.category = data.category;
    }

    // addonGroups
    if (hasChanged(data.addonGroups, prevData?.addonGroups || [])) {
      productData.addonGroups = data.addonGroups;
    }

    // image update
    //
    // Sent as a single `image` string, not `images: [url]`: the API's schema is
    // strict and rejects `images`, which is what made every update fail. Note
    // the asymmetry — `DELETE /products/:productId/images` still takes the
    // array, so `deleteProductImage` is correct as it stands.
    const originalImage = getProductImage(prevData);
    const currentImage = data.images?.[0];

    if (currentImage && currentImage !== originalImage) {
      productData.image = currentImage;
    } else if (!currentImage && originalImage) {
      // The vendor removed their only picture. Sending nothing would leave the
      // product with none at all, so the default takes the slot back — the same
      // rule the create form applies.
      productData.image = DEFAULT_PRODUCT_IMAGE;
    }

    // pricing update
    const originalPricing = prevData?.pricing || {};
    const pricingChanged =
      hasChanged(data.discount, originalPricing.discount ?? 0) ||
      hasChanged(data.discountType, originalPricing.discountType ?? "") ||
      hasChanged(data.taxId, String(originalPricing.taxId || ""));

    if (pricingChanged) {
      productData.pricing = {};
      if (hasChanged(data.discount, originalPricing.discount ?? 0)) {
        productData.pricing.discount = data.discount;
      }
      if (hasChanged(data.discountType, originalPricing.discountType ?? "")) {
        productData.pricing.discountType = data.discountType;
      }
      if (hasChanged(data.taxId, String(originalPricing.taxId || ""))) {
        productData.pricing.taxId = data.taxId;
      }
    }

    // meta update
    const originalMeta = prevData?.meta || {};
    const originalStatus = originalMeta.status === "ACTIVE" ? true : false;
    const metaChanged =
      hasChanged(data.isFeatured, originalMeta.isFeatured || false) ||
      hasChanged(data.isAvailableForPreOrder, originalMeta.isAvailableForPreOrder || false) ||
      hasChanged(data.isActive, originalStatus);

    if (metaChanged) {
      productData.meta = {};
      if (hasChanged(data.isFeatured, originalMeta.isFeatured || false)) {
        productData.meta.isFeatured = data.isFeatured;
      }
      if (hasChanged(data.isAvailableForPreOrder, originalMeta.isAvailableForPreOrder || false)) {
        productData.meta.isAvailableForPreOrder = data.isAvailableForPreOrder;
      }
      if (hasChanged(data.isActive, originalStatus)) {
        productData.meta.status = data.isActive === true ? "ACTIVE" : "INACTIVE";
      }
    }

    // stock
    if (businessTypeSlug !== "restaurant") {
      const originalUnit = prevData?.stock?.unit || "";
      if (hasChanged(data.unit, originalUnit)) {
        productData.stock = { unit: data.unit };
      }
    }

    // price check
    const priceChanged = hasChanged(data.price, prevData?.pricing?.price || 0);

    // final validation
    const hasAnyChange = Object.keys(productData).length > 0 || priceChanged;

    if (!hasAnyChange) {
      // The picture was deleted through the uploader, which already called the
      // image-delete endpoint itself — so there is nothing left for the save to
      // send, and "no changes" would be the wrong thing to say about it.
      const onlyTheImageWasDeleted = Boolean(originalImage) && !currentImage;

      if (onlyTheImageWasDeleted) {
        toast.success("Image removed successfully", { id: toastId });
      } else {
        toast.info("No changes detected", { id: toastId });
      }

      setActiveTab(0);
      setTabError({});
      router.refresh();
      closeModal();
      setIsSubmitting(false);
      return;
    }

    const result = await catchAsync<TProduct>(async () => {
      return (await updateData(
        `/products/${prevData?.productId}`,
        productData
      )) as unknown as TResponse<TProduct>;
    });

    if (result.success) {
      if (
        (result?.data?.variations?.length === 0 || !result?.data?.variations) &&
        priceChanged
      ) {
        const pricingResult = await catchAsync<unknown>(async () => {
          return (await updateData(
            `/products/update-inventory-and-pricing/${prevData?.productId}`,
            { newPrice: data.price }
          )) as unknown as TResponse<unknown>;
        });

        if (pricingResult.success) {
          toast.success("Product updated successfully!", { id: toastId });
          setActiveTab(0);
          setTabError({});
          router.refresh();
          closeModal();
          return;
        }
      }

      toast.success("Product updated successfully!", { id: toastId });
      setActiveTab(0);
      setTabError({});
      router.refresh();
      closeModal();
      return;
    }

    toast.error(result.message || "Product update failed", { id: toastId });
    setIsSubmitting(false);
  };

  const getAddonsGroups = async ({ limit = 10 }) => {
    const result = await catchAsync<TAddonGroup[]>(async () => {
      return (await getAddOnsGroupReq({ limit }, lang)) as unknown as TResponse<
        TAddonGroup[]
      >;
    });

    if (result.success) {
      setAddonsGroupsData({
        data: result.data,
        meta: result.meta,
      });
    }
  };

  const getProductCategories = async () => {
    const result = await catchAsync<TProductCategory[]>(async () => {
      return (await getAllProductCategoriesReq()) as unknown as TResponse<TProductCategory[]>;
    });

    if (result.success) {
      setProductCategoriesData(result.data);
    }
  };

  const getTaxes = async ({ limit = 10 }) => {
    const result = await catchAsync(async () => {
      return await getAllTaxesReq({ limit })
    });

    if (result.success) {
      setTaxesData(result.data);
    }
  };

  useEffect(() => {
    (() => getAddonsGroups({ limit: 10 }))();
    (() => getProductCategories())();
    (() => getTaxes({ limit: 10 }))();
  }, []);

  useEffect(() => {
    const errors = Object.entries(form.formState?.errors)?.filter(
      (er) => er?.[1]?.message,
    );
    if (errors.length > 0) {
      const newErrors = tabs.reduce(
        (err, t) => {
          err[t.name] = false;
          return err;
        },
        {} as Record<string, boolean>,
      );

      errors.forEach(([key]) => {
        switch (key) {
          case "name":
          case "brand":
          case "description":
          case "category":
          case "additionalCategories":
            newErrors[t("basic_info")] = true;
            return;
          case "price":
          case "discount":
          case "taxId":
            newErrors[t("pricing")] = true;
            return;
          case "quantity":
          case "unit":
          case "availabilityStatus":
            newErrors[t("stock")] = true;
            return;
        }
      });

      setTabError(newErrors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState?.errors]);

  return (
    <div className="">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="bg-white overflow-hidden"
      >
        <TitleHeader
          title={headerTitle}
          subtitle={t("update_product_details")}
          extraComponent={
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.98,
              }}
              type="submit"
              disabled={isSubmitting}
              onClick={() => form.handleSubmit(onSubmit)()}
              className="px-6 py-2 bg-[#DC3173] hover:bg-[#B02458] text-white rounded-lg flex items-center space-x-2 shadow-lg shadow-pink-200/50"
            >
              <SaveIcon className="h-5 w-5" />
              <span>{t("save_product")}</span>
            </motion.button>
          }
        />
        <div className="flex flex-col md:flex-row">
          {/* Tabs */}
          <div className="md:w-52 lg:w-64 bg-gray-50 p-4">
            <div className="space-y-1">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.name}
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    "w-full flex items-center space-x-2 px-4 py-3 rounded-lg text-left",
                    activeTab === index
                      ? "bg-[#DC3173] text-white"
                      : tabError[tab.name]
                        ? "bg-destructive/20 text-destructive"
                        : "hover:bg-gray-100 text-gray-700",
                  )}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
          {/* Form */}
          <div className="flex-1 p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Basic Info Tab */}
                {activeTab === 0 && (
                  <BasicInfoForm
                    form={form as any}
                    productCategories={productCategoriesData}
                    selectedLanguage={lang}
                  />
                )}
                {/* Images Tab */}
                {activeTab === 1 && (
                  <ImageAndDescriptionForm
                    form={form}
                    selectedLanguage={lang}
                    productId={prevData?.productId}
                  />
                )}
                {/* Add-Ons & Variants Tab */}
                {activeTab === 2 && (
                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-800">
                      {t("add_ons_and_variants")}
                    </h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("add_ons")}
                      </label>
                      {watchAddons?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-1">
                          {watchAddons?.map((id) => (
                            <motion.div
                              key={id}
                              initial={{
                                scale: 0,
                              }}
                              animate={{
                                scale: 1,
                              }}
                              className="flex items-center bg-[#DC3173] bg-opacity-10 text-white px-3 py-1 rounded-full"
                            >
                              <span>
                                {
                                  addonGroupsData?.data?.find(
                                    (group) => group._id === id,
                                  )?.title?.[lang]
                                }
                              </span>
                              <button
                                type="button"
                                onClick={() => removeAddon(id)}
                                className="ml-2 text-white hover:text-[#CCC]"
                              >
                                <XIcon className="h-4 w-4" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                      <FormField
                        control={form.control}
                        name="addonGroups"
                        render={({ fieldState }) => (
                          <FormItem className="gap-1">
                            <FormControl>
                              <Select onValueChange={(val) => addAddon(val)}>
                                <SelectTrigger
                                  className={cn(
                                    "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-0! foce focus:border-[#DC3173]! outline-none inset-0 h-10!",
                                    fieldState.invalid
                                      ? "border-destructive"
                                      : "border-gray-300",
                                  )}
                                >
                                  <SelectValue placeholder={t("choose_add_on")} />
                                </SelectTrigger>
                                <SelectContent>
                                  {addonGroupsData?.data?.map((group) => (
                                    <SelectItem
                                      key={group._id}
                                      value={group._id}
                                    >
                                      {group.title?.[lang]}
                                    </SelectItem>
                                  ))}
                                  {addonGroupsData?.data?.length === 0 && (
                                    <p className='italic text-sm text-gray-500 text-center'>{t("no_add_ons_found")}</p>
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2 ">
                      <label className="block mb-1">{t("variations")}</label>
                      <div>
                        {watchVariations?.length > 0 ? (
                          watchVariations?.map((variation, i) => (
                            <div
                              key={i}
                              className="relative p-4 border rounded-md bg-gray-50 mb-4"
                            >
                              <div>
                                {t("name")}: {variation.name?.[lang]}
                              </div>
                              <div className="flex flex-wrap gap-2 items-center">
                                {t("options")}:{" "}
                                {variation.options?.map((option, i2) => (
                                  <div
                                    key={i2}
                                    className="flex items-center bg-[#DC3173] bg-opacity-10 text-white px-3 py-1 rounded-full"
                                  >
                                    <span>{option.label?.[lang]}</span>
                                    <span className="ml-2">
                                      (€{option.price})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">
                            No variations added
                          </p>
                        )}
                      </div>
                      {(prevData?.variations || prevData?.variations?.length !== 0) && <div className="flex items-start gap-3 p-4 rounded-xl border border-[#DC3173] bg-[#DC3173]/20">
                        <div className="shrink-0 mt-0.5">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#DC3173] text-white text-xs font-bold select-none">
                            !
                          </span>
                        </div>

                        <p className="text-[#DC3173] text-sm font-medium italic leading-relaxed">
                          For updating variation prices,Please visit Variation Management page
                        </p>
                      </div>}
                    </div>
                  </motion.div>
                )}
                {/* Pricing Tab */}
                {activeTab === 3 && (
                  <PricingForm
                    form={form}
                    taxesData={taxesData}
                    watchDiscount={watchDiscount}
                    watchPrice={watchPrice}
                    watchVariations={watchVariations}
                    watchTaxId={watchTaxId}
                    watchDiscountType={watchDiscountType}
                  />
                )}
                {/* Stock Tab */}
                {businessTypeSlug !== "restaurant" && activeTab === 4 && (
                  <StockInformationForm
                    form={form}
                    watchVariations={watchVariations}
                  />
                )}
                {/* DeliGo Metadata Tab */}
                {activeTab === lastTabIndex && (
                  <DeligoMetadata
                    form={form}
                  />
                )}
                <div className="flex justify-between pt-6">
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    type="button"
                    onClick={() => activeTab > 0 && setActiveTab(activeTab - 1)}
                    disabled={activeTab === 0}
                    className={`px-6 py-2 rounded-lg flex items-center space-x-2 ${activeTab === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      }`}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                    <span>{t("previous")}</span>
                  </motion.button>
                  {/* {activeTab === lastTabIndex && (
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-[#DC3173] hover:bg-[#B02458] text-white rounded-lg flex items-center space-x-2 shadow-lg shadow-pink-200/50"
                    >
                      <SaveIcon className="h-5 w-5" />
                      <span>{t("save_product")}</span>
                    </motion.button>
                  )} */}
                  {activeTab < lastTabIndex && (
                    <motion.button
                      whileHover={{
                        scale: 1.02,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                      type="button"
                      onClick={() =>
                        activeTab < lastTabIndex && setActiveTab(activeTab + 1)
                      }
                      className="px-6 py-2 bg-[#DC3173] hover:bg-[#B02458] text-white rounded-lg flex items-center space-x-2"
                    >
                      <span>{t("next")}</span>
                      <ChevronRightIcon className="h-4 w-4" />
                    </motion.button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
