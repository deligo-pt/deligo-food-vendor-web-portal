/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Form,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/src/hooks/use-translation";
import { TAddonGroup } from "@/src/types/add-ons.type";
import { TProductCategoryResponse } from "@/src/types/category.type";
import { TTax } from "@/src/types/tax.type";
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
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import TitleHeader from "../../TitleHeader/TitleHeader";
import BasicInfoForm from "./BasicInfoForm";
import ImageAndDescriptionForm from "./Image&DescriptionForm";
import AddOnsAndVariants from "./AddOns&Variants";
import PricingForm from "./PricingForm";
import StockInformationForm from "./StockInformationForm";
import DeligoMetadata from "./DeligoMetadata";
import { catchAsync } from "@/src/utils/catchAsync";
import { postData } from "@/src/utils/requests";
import { TProduct } from "@/src/types/product.type";
import { TResponse } from "@/src/types";
import { useStore } from "@/src/store/store";
import { translateObject } from "@/src/utils/translation/translationObject";

type FormData = z.infer<typeof productValidation>;

export function ProductForm({
  productCategories,
  addonGroupsData,
  taxesData,
  businessType,
}: {
  productCategories: TProductCategoryResponse[];
  addonGroupsData: TAddonGroup[];
  taxesData: TTax[];
  businessType: string;
}) {
  const { lang } = useStore();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = useMemo(() => {
    const baseTabs = [
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
    ];

    if (businessType !== "RESTAURANT") {
      baseTabs.push({
        name: t("stock"),
        icon: <PackageIcon className="h-5 w-5" />,
      });
    }

    baseTabs.push({
      name: t("deligo_metadata"),
      icon: <StarIcon className="h-5 w-5" />,
    });

    return baseTabs;
  }, [businessType, t]);

  const lastTabIndex = tabs.length - 1;

  const form = useForm<FormData>({
    resolver: zodResolver(productValidation),
    values: {
      name: {
        en: "",
        pt: ""
      },
      images: [],
      description: {
        en: "",
        pt: ""
      },
      category: "",
      price: 0,
      discount: 0,
      taxId: "",
      quantity: 0,
      unit: "",
      availabilityStatus: "",
      addonGroups: [],
      variations: [],
      isFeatured: false,
      isAvailableForPreOrder: false,
      businessType,
    },
  });
  const { formState: { isSubmitting } } = form;

  const [tabError, setTabError] = useState(
    tabs.reduce(
      (err, t) => {
        err[t.name] = false;
        return err;
      },
      {} as Record<string, boolean>,
    ),
  );

  const [watchPrice, watchDiscount, watchTaxId, watchAddons, watchVariations] =
    useWatch({
      control: form.control,
      name: ["price", "discount", "taxId", "addonGroups", "variations"],
    });

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading("Translating and Creating product...");

    try {
      const translated = await translateObject(data, lang);

      if (!translated) {
        toast.error("Translation failed!", { id: toastId });
        return;
      }

      const productData = {
        name: translated.name,
        description: translated.description,
        category: data.category,
        images: data.images,
        pricing: {
          price: data.price,
          discount: data.discount,
          taxId: data.taxId,
          currency: "€",
        },
        addonGroups: data.addonGroups,
        variations: translated.variations,
        meta: {
          isFeatured: data.isFeatured,
          isAvailableForPreOrder: data.isAvailableForPreOrder,
        },
        ...(businessType !== "RESTAURANT"
          ? {
            stock: {
              quantity: data.quantity,
              unit: data.unit,
              availabilityStatus: data.availabilityStatus,
            },
          }
          : {}),
      };

      const result = await catchAsync<TProduct>(async () => {
        return (await postData(
          "/products/create-product",
          productData,
        )) as unknown as TResponse<TProduct>;
      });

      if (result.success) {
        toast.success(result.message || "Product created successfully!", {
          id: toastId,
        });

        form.reset();
        setTabError({});
        setActiveTab(0);

        return;
      }

      toast.error(result.message || "Product creation failed", {
        id: toastId,
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", {
        id: toastId,
      });
    }
  };

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
          case "category":
            newErrors[t("basic_info")] = true;
            return;
          case "description":
            newErrors[t("images")] = true;
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
    <div>
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
        className="bg-white shadow-xl rounded-2xl overflow-hidden"
      >
        <TitleHeader
          title={t("add_new_item")}
          subtitle={t("fill_the_details_to_add_new_food_item")}
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
                  <div className="w-5 h-5">{tab.icon}</div>
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
                {activeTab === 0 && (
                  <BasicInfoForm
                    form={form as any}
                    productCategories={productCategories}
                    selectedLanguage={lang}
                  />
                )}
                {activeTab === 1 && (
                  <ImageAndDescriptionForm
                    form={form}
                    selectedLanguage={lang}
                  />
                )}
                {activeTab === 2 && (
                  <AddOnsAndVariants
                    form={form}
                    addonGroupsData={addonGroupsData}
                    businessType={businessType}
                    watchAddons={watchAddons}
                    watchVariations={watchVariations}
                    selectedLanguage={lang}
                  />
                )}
                {activeTab === 3 && (
                  <PricingForm
                    form={form}
                    taxesData={taxesData}
                    watchDiscount={watchDiscount}
                    watchPrice={watchPrice}
                    watchVariations={watchVariations}
                    watchTaxId={watchTaxId}
                  />
                )}
                {businessType !== "RESTAURANT" && activeTab === 4 && (
                  <StockInformationForm
                    form={form}
                    watchVariations={watchVariations}
                  />
                )}
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
                  {activeTab === lastTabIndex && (
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
                      {
                        lang === "en" ? <span>Translate to PT and Save Product</span> :
                          <span>{t("translate_en")}</span>
                      }
                    </motion.button>
                  )}
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
