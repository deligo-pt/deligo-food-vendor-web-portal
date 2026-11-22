/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Form,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/src/hooks/use-translation";
import { TAddonGroup } from "@/src/types/add-ons.type";
import { TProductCategory } from "@/src/types/category.type";
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
import { useEffect, useMemo, useRef, useState } from "react";
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
import { createTwoForOneReq } from "@/src/services/dashboard/offers/offers";
import { getCategoryProductsPage } from "@/src/services/dashboard/products/products";
import { KIND_SETTINGS, kindFromProducts, taxIdForRate, type TProductKind } from "@/src/utils/productKind";
import { bulkCreateProductsReq } from "@/src/services/dashboard/products/product-bulk.service";
import type { TBulkProductItem } from "@/src/types/product-bulk.type";
import { bulkErrorText, bulkRequestErrorText } from "@/src/utils/bulkErrors";
import {
  productFieldForCode,
  productFieldForPath,
  productTabKeyForField,
  type TProductFormField,
} from "@/src/utils/productFormErrors";
import { useStore } from "@/src/store/store";
import { translateObject } from "@/src/utils/translation/translationObject";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof productValidation>;

export function ProductForm({
  productCategories,
  addonGroupsData,
  taxesData,
  businessTypeSlug,
  // menus,
}: {
  productCategories: TProductCategory[];
  addonGroupsData: TAddonGroup[];
  taxesData: TTax[];
  businessTypeSlug: string;
  // menus: IMenu[];
}) {
  const { lang } = useStore();
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  // const [selectedSectionId, setSelectedSectionId] = useState("");

  // Highest rate first in the Tax dropdown: 23%, 13%, 6%, 0% (6 Oct 2026).
  // Add Item only; `/taxes` lists them lowest first.
  const taxesByRate = useMemo(
    () => [...(taxesData ?? [])].sort((a, b) => Number(b.taxRate) - Number(a.taxRate)),
    [taxesData],
  );

  const tabs = useMemo(() => {
    const baseTabs = [
      {
        name: t("basic_info"),
        icon: <PackageIcon className="h-5 w-5" />,
      },
      // {
      //   name: t("select_target_menu"),
      //   icon: <Menu className="h-5 w-5" />,
      // },
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

    if (businessTypeSlug !== "restaurant") {
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
  }, [businessTypeSlug, t]);

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
      additionalCategories: [],
      // The price starts at a real 0 (17 Oct 2026, the owner's call): a free
      // item is allowed, so 0 is a valid price and the natural default. An
      // empty discount is no discount (saved as 0).
      price: 0,
      discountType: "PERCENTAGE",
      discount: undefined,
      // No rate pre-selected (6 Oct 2026): the vendor picks one, helped by the
      // ⓘ beside the field. Saving without one is refused by the schema
      // ("VAT is a required field"), and the placeholder no longer names a rate.
      taxId: "",
      quantity: 0,
      unit: "",
      availabilityStatus: "",
      addonGroups: [],
      variations: [],
      isFeatured: false,
      sdrApplicable: false,
      isAvailableForPreOrder: false,
      isTwoForOne: false,
      isActive: true,
      businessTypeSlug,
      currentLang: lang
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

  const [watchPrice, watchDiscount, watchDiscountType, watchTaxId, watchAddons, watchVariations] =
    useWatch({
      control: form.control,
      name: ["price", "discount", "discountType", "taxId", "addonGroups", "variations"],
    });

  // The header carries the product's name from the moment it is typed, so the
  // later steps — Images, Add-Ons, Pricing — still say which product is being
  // filled in. Watched rather than read once: clearing the field takes the
  // name back out of the heading.
  const [nameEn, namePt] = useWatch({
    control: form.control,
    name: ["name.en", "name.pt"],
  });
  const productName = (lang === "pt" ? namePt || nameEn : nameEn || namePt)?.trim();
  const headerTitle = productName
    ? `${t("add_new_item")} - ${productName}`
    : t("add_new_item");

  /**
   * A refused save: each problem goes on its field and the form opens the
   * step holding the first one; what has no field is shown in the toast.
   */
  const showServerErrors = (
    result: Awaited<ReturnType<typeof bulkCreateProductsReq>>,
    toastId: string | number,
  ) => {
    const failed = result.data?.failed?.[0];

    // The request itself was refused (429, 403, network…): nothing per item.
    if (!failed && !result.errorSources.some((e) => productFieldForPath(e.path))) {
      toast.error(bulkRequestErrorText(t, result), { id: toastId });
      return;
    }

    const problems = failed
      ? failed.errors?.length
        ? failed.errors
        : [{ path: "", message: failed.message }]
      : result.errorSources;

    const leftovers: string[] = [];
    let firstField: TProductFormField | null = null;
    const placed = new Set<string>();

    for (const problem of problems) {
      const field =
        productFieldForPath(problem.path) ??
        (problem.path ? null : productFieldForCode(failed?.code));
      const text = problem.path
        ? problem.message
        : bulkErrorText(t, failed?.code, problem.message);

      if (field && !placed.has(field)) {
        placed.add(field);
        form.setError(field as never, { type: "server", message: text });
        firstField ??= field;
      } else if (!leftovers.includes(text)) {
        leftovers.push(text);
      }
    }

    if (firstField) {
      const tabIndex = tabs.findIndex((tab) => tab.name === t(productTabKeyForField(firstField!)));
      if (tabIndex >= 0) setActiveTab(tabIndex);
    }

    toast.error(
      leftovers[0] ?? bulkErrorText(t, failed?.code ?? result.errorKey, failed?.message ?? result.message),
      { id: toastId },
    );
  };

  /* ----- Food | Drinks pre-selected from the category (§10.3) ----- */

  const [watchCategory, watchSdr] = useWatch({ control: form.control, name: ["category", "sdrApplicable"] });
  /** Each category's kind, once looked up while the form is open. */
  const kindByCategory = useRef(new Map<string, TProductKind | null>());
  /** What the last pre-selection wrote: only that may be replaced, never a vendor's own choice. */
  const autoKind = useRef<{ taxId: string; sdr: boolean }>({ taxId: "", sdr: false });
  const [kindFromCategory, setKindFromCategory] = useState(false);

  useEffect(() => {
    if (!watchCategory) return;
    let stale = false;
    const apply = (kind: TProductKind | null) => {
      if (stale || !kind) return;
      const taxId = form.getValues("taxId") || "";
      const sdr = form.getValues("sdrApplicable") === true;
      // The vendor set VAT or SDR by hand: leave them.
      if (taxId !== autoKind.current.taxId || sdr !== autoKind.current.sdr) return;
      const id = taxIdForRate(taxesData, KIND_SETTINGS[kind].rate);
      if (!id) return;
      form.setValue("taxId", id, { shouldValidate: !!taxId });
      form.setValue("sdrApplicable", KIND_SETTINGS[kind].sdr);
      autoKind.current = { taxId: id, sdr: KIND_SETTINGS[kind].sdr };
      setKindFromCategory(true);
    };
    if (kindByCategory.current.has(watchCategory)) {
      apply(kindByCategory.current.get(watchCategory) ?? null);
    } else {
      getCategoryProductsPage(watchCategory, 1, { lang }).then((res) => {
        const kind = res.success ? kindFromProducts(res.data) : null;
        if (res.success) kindByCategory.current.set(watchCategory, kind);
        apply(kind);
      });
    }
    return () => {
      stale = true;
    };
    // A new category only; taxes and the form are stable for the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchCategory]);

  // "Chosen from the category" only while VAT and SDR are still what it chose.
  const kindStillAuto =
    kindFromCategory && watchTaxId === autoKind.current.taxId && (watchSdr === true) === autoKind.current.sdr;

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading(t("translating_and_creating_product"));
    // if (!selectedSectionId) {
    //   toast.error("Please select a menu", { id: toastId });
    //   return;
    // };

    const status = data.isActive === true ? "ACTIVE" : "INACTIVE";

    try {
      const translated = await translateObject(data, lang);

      if (!translated) {
        // Cancelled in the translation dialog: back to the form, nothing saved.
        toast.dismiss(toastId);
        return;
      }

      const hasOptions = (translated.variations ?? []).some(
        (v: { options?: unknown[] }) => (v.options?.length ?? 0) > 0,
      );

      const productData: TBulkProductItem = {
        // Both languages are filled by the translation step above.
        name: translated.name as TBulkProductItem["name"],
        description: translated.description as TBulkProductItem["description"],
        category: data.category,
        ...(data.additionalCategories && {
          additionalCategories: data.additionalCategories.filter((id): id is string => !!id),
        }),
        // A single `image` string, not the `images: [url]` array this used to
        // send: the API's product schema is strict and rejects `images`
        // outright ("Unrecognized key(s) in object: 'images'"), which is what
        // made every save fail. The form still tracks an array internally
        // because the uploader and the image-delete endpoint both use one — the
        // narrowing to one URL happens here, at the boundary.
        //
        // The vendor may skip the step entirely. Then `image` is left out and
        // the API applies the admin's default picture (`isDefaultImage: true`).
        // It must be left out, not sent empty: the API rejects `""` and `null`.
        ...(data.images?.[0] && { image: data.images[0] }),
        pricing: {
          // With options the product's price is the cheapest option (the API
          // sets it), so no price is sent.
          ...(!hasOptions && { price: data.price ?? undefined }),
          discountType: data.discountType as "PERCENTAGE" | "FLAT",
          // An emptied discount box is no discount.
          discount: data.discount ?? 0,
          taxId: data.taxId,
          // "€", as every existing product has it: the cards print the stored
          // text as-is, so "EUR" would show as "4,00 EUR" (D4, 19 Nov 2026).
          currency: "€",
        },
        addonGroups: data.addonGroups,
        // Left out, not `[]`, when there are none (the bulk API's rule).
        ...(translated.variations?.length && {
          variations: translated.variations.map((v: any) => ({
            name: v.name,
            options: v.options.map((o: any) => ({
              label: o.label,
              price: o.price,
              // Restaurants don't track stock, per option either.
              ...(businessTypeSlug !== "restaurant" &&
                o.stockQuantity != null && { stockQuantity: o.stockQuantity }),
            })),
          })),
        }),
        // SDR: only the flag — the amount is the admin's (`sdr` is strict and
        // rejects any other key).
        sdr: { applicable: data.sdrApplicable === true },
        meta: {
          isFeatured: data.isFeatured,
          isAvailableForPreOrder: data.isAvailableForPreOrder,
          status,
        },
        ...(businessTypeSlug !== "restaurant"
          ? {
            stock: {
              quantity: data.quantity ?? 0,
              unit: data.unit,
              availabilityStatus: data.availabilityStatus as NonNullable<TBulkProductItem["stock"]>["availabilityStatus"],
            },
          }
          : {}),
      };

      // One item through the unified create (`create-product` is deprecated).
      const result = await bulkCreateProductsReq([productData]);

      if (result.ok && result.data?.created.length) {
        toast.success(result.message || t("product_created_successfully"), {
          id: toastId,
        });
        // 2×1 (§10.2): an offer for the new product, made once it exists.
        // The product stays saved whatever happens here.
        if (data.isTwoForOne) {
          const offer = await createTwoForOneReq(
            result.data.created[0]._id,
            translated.name as { en: string; pt: string },
          );
          if (offer.success) toast.success(t("two_for_one_created"));
          else toast.warning(t("two_for_one_create_failed").replace("{reason}", offer.message || ""), { duration: 10000 });
        }
        form.reset();
        setTabError({});
        setActiveTab(0);
        router.push('/vendor/all-items')
        return;
      }

      showServerErrors(result, toastId);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    const errors = Object.entries(form.formState?.errors ?? {});
    const newErrors = tabs.reduce(
      (err, t) => {
        err[t.name] = false;
        return err;
      },
      {} as Record<string, boolean>,
    );

    if (errors.length > 0) {
      errors.forEach(([key, value]) => {
        // helper: treat nested objects (like description.en / description.pt) as errors too
        const hasMessage =
          !!value?.message ||
          (typeof value === "object" &&
            Object.values(value as any).some((v: any) => v?.message));

        if (!hasMessage) return;

        switch (key) {
          case "name":
          case "brand":
          case "category":
          case "additionalCategories":
            newErrors[t("basic_info")] = true;
            return;
          case "description":
          case "images":
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
          case "addonGroups":
          case "variations":
            newErrors[t("add_ons_and_variants")] = true;
            return;
          case "sdrApplicable":
          case "isFeatured":
          case "isAvailableForPreOrder":
            newErrors[t("deligo_metadata")] = true;
            return;
        }
      });
    }

    setTabError(newErrors);
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
          title={headerTitle}
          subtitle={t("fill_the_details_to_add_new_food_item")}
          extraComponent={
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.98,
              }}
              type="button"
              disabled={isSubmitting}
              onClick={() => form.handleSubmit(onSubmit)()}
              className="px-6 py-2 bg-[#DC3173] hover:bg-[#B02458] text-white rounded-lg flex items-center space-x-2 shadow-lg shadow-pink-200/50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <SaveIcon className="h-5 w-5" />
              {lang === "en" ? (
                <span>Translate to PT and Save Product</span>
              ) : (
                <span>{t("translate_en")}</span>
              )}
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
                {/* {activeTab === 1 && (
                  <TargetProductMenu
                    menus={menus}
                    selectedSectionId={selectedSectionId}
                    setSelectedSectionId={setSelectedSectionId}
                  />
                )} */}
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
                    businessTypeSlug={businessTypeSlug}
                    watchAddons={watchAddons}
                    watchVariations={watchVariations}
                    selectedLanguage={lang}
                  />
                )}
                {activeTab === 3 && (
                  <PricingForm
                    form={form}
                    taxesData={taxesByRate}
                    watchDiscount={watchDiscount}
                    watchPrice={watchPrice}
                    watchVariations={watchVariations}
                    watchTaxId={watchTaxId}
                    watchDiscountType={watchDiscountType}
                    showVatInfo
                    kindFromCategory={kindStillAuto}
                  />
                )}
                {businessTypeSlug !== "restaurant" && activeTab === 4 && (
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
                      {
                        lang === "en" ? <span>Translate to PT and Save Product</span> :
                          <span>{t("translate_en")}</span>
                      }
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
