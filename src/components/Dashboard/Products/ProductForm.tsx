"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import DescriptionGeneratorDialog from "@/src/components/Dashboard/Products/DescriptionGeneratorDialog";
import { ImageUpload } from "@/src/components/Dashboard/Products/ProductImageUpload";
import { Input } from "@/src/components/ui/input";
import { useTranslation } from "@/src/hooks/use-translation";
import { TResponse } from "@/src/types";
import { TAddonGroup } from "@/src/types/add-ons.type";
import { TBusinessCategory } from "@/src/types/category.type";
import { TProduct } from "@/src/types/product.type";
import { TTax } from "@/src/types/tax.type";
import { catchAsync } from "@/src/utils/catchAsync";
import { postData } from "@/src/utils/requests";
import { productValidation } from "@/src/validations/product/product.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FileTextIcon,
  ImageIcon,
  LayersIcon,
  PackageIcon,
  SaveIcon,
  StarIcon,
  TagIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormData = z.infer<typeof productValidation>;

export function ProductForm({
  productCategories,
  addonGroupsData,
  taxesData,
  businessType,
}: {
  productCategories: TBusinessCategory[];
  addonGroupsData: TAddonGroup[];
  taxesData: TTax[];
  businessType: string;
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [lastTabIndex, setLastTabIndex] = useState(5);
  const [openDescriptionGenerator, setOpenDescriptionGenerator] =
    useState(false);
  const [options, setOptions] = useState<
    { label: string; price: number; stockQuantity?: number }[]
  >([]);

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
      name: t("description"),
      icon: <FileTextIcon className="h-5 w-5" />,
    },
    {
      name: t("add_ons_and_variants"),
      icon: <LayersIcon className="h-5 w-5" />,
    },
    {
      name: t("pricing"),
      icon: <TagIcon className="h-5 w-5" />,
    },
    {
      name: "DeliGo Metadata",
      icon: <StarIcon className="h-5 w-5" />,
    },
  ];

  if (businessType !== "RESTAURANT") {
    const lastTab = tabs[tabs.length - 1];
    tabs.push({
      name: t("stock"),
      icon: <PackageIcon className="h-5 w-5" />,
    });
    tabs.push(lastTab);
    setLastTabIndex(6);
  }

  const [option, setOption] = useState<{
    label: string;
    price: string;
    stockQuantity?: number;
  }>({
    label: "",
    price: "",
    ...(businessType !== "RESTAURANT" ? { stockQuantity: 0 } : {}),
  });
  const [variationName, setVariationName] = useState("");
  const form = useForm<FormData>({
    resolver: zodResolver(productValidation),
    defaultValues: {
      name: "",
      images: [],
      description: "",
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

  const addOption = () => {
    if (option.label && option.price) {
      if (!options.find((opt) => opt.label === option.label)) {
        setOptions((prev) => [
          ...prev,
          {
            label: option.label,
            price: Number(option.price),
            ...(businessType !== "RESTAURANT"
              ? { stockQuantity: option.stockQuantity }
              : ""),
          },
        ]);
        setOption({
          label: "",
          price: "",
          ...(businessType !== "RESTAURANT" ? { stockQuantity: 0 } : {}),
        });
      }
    } else {
      toast.error("Option label and price are required");
    }
  };

  const removeOption = (optionToRemove: string) => {
    setOptions(
      (prev) => prev.filter((opt) => opt.label !== optionToRemove) || [],
    );
  };

  const addVariation = () => {
    if (variationName && options.length > 0) {
      if (!form.getValues("variations").find((v) => v.name === variationName)) {
        form.setValue("variations", [
          ...form.getValues("variations"),
          { name: variationName, options: options },
        ]);
        setVariationName("");
        setOptions([]);
      }
    } else {
      toast.error("Variation name and options are required");
    }
  };

  const removeVariation = (nameToRemove: string) => {
    form.setValue(
      "variations",
      form.getValues("variations").filter((v) => v.name !== nameToRemove),
    );
  };

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading("Creating product...");

    const productData = {
      name: data.name,
      description: data.description,
      category: data.category,
      images: data.images,
      pricing: {
        price: data.price,
        discount: data.discount,
        taxId: data.taxId,
        currency: "€",
      },
      addonGroups: data.addonGroups,
      variations: data.variations,
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
      const formData = new FormData();
      formData.append("data", JSON.stringify(productData));

      // if (images.length > 0)
      //   images.map((image) => formData.append("files", image.file as Blob));

      return (await postData("/products/create-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })) as unknown as TResponse<TProduct>;
    });

    if (result.success) {
      toast.success(result.message || "Product created successfully!", {
        id: toastId,
      });
      form.reset();
      setTabError({});
      setActiveTab(0);
      setOptions([]);
      setOption({ label: "", price: "", stockQuantity: 0 });
      setVariationName("");
      return;
    }

    toast.error(result.message || "Product creation failed", { id: toastId });
    console.log(result);
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
            newErrors[t("description")] = true;
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
        <div className="px-6 py-8 bg-linear-to-r from-[#DC3173] to-[#FF6B98] text-white">
          <h1 className="text-3xl font-bold">{t("add_new_item")}</h1>
          <p className="mt-2 text-pink-100">
            {t("fill_the_details_to_add_new_food_item")}
          </p>
        </div>
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
                {/* Basic Info Tab */}
                {activeTab === 0 && (
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
                      {t("basic_information")}
                    </h2>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="gap-1">
                          <FormLabel
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            {t("product_name")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0! foce focus:border-[#DC3173]! outline-none inset-0 h-10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field, fieldState }) => (
                        <FormItem className="gap-1">
                          <FormLabel
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700"
                          >
                            {t("product_category")}
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                className={cn(
                                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-0! foce focus:border-[#DC3173]! outline-none inset-0 h-10!",
                                  fieldState.invalid
                                    ? "border-destructive"
                                    : "border-gray-300",
                                )}
                              >
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                {productCategories?.map((category) => (
                                  <SelectItem
                                    key={category?._id}
                                    value={category?._id}
                                  >
                                    {category?.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
                {/* Images Tab */}
                {activeTab === 1 && (
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
                    className="space-y-6 mb-0"
                  >
                    <h2 className="text-xl font-semibold text-gray-800">
                      {t("product_images")}
                    </h2>
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem className="gap-1">
                          <FormControl>
                            <ImageUpload
                              images={field.value}
                              onChange={(urls) => field.onChange(urls)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
                {/* Description Tab */}
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
                      {t("description")}
                    </h2>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="gap-1">
                          <FormLabel
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                          >
                            {t("description")}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0! foce focus:border-[#DC3173]! outline-none inset-0"
                            />
                          </FormControl>
                          <div>
                            <Button
                              type="button"
                              variant="link"
                              size="sm"
                              className="text-xs text-[#DC3173] hover:text-[#DC3173/80] p-0"
                              onClick={() => setOpenDescriptionGenerator(true)}
                            >
                              {t("generated_product_description")}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
                {/* Add-Ons & Variants Tab */}
                {activeTab === 3 && (
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
                                  addonGroupsData?.find(
                                    (group) => group._id === id,
                                  )?.title
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
                                  <SelectValue placeholder="Choose Add-On" />
                                </SelectTrigger>
                                <SelectContent>
                                  {addonGroupsData?.map((group) => (
                                    <SelectItem
                                      key={group._id}
                                      value={group._id}
                                    >
                                      {group.title}
                                    </SelectItem>
                                  ))}
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
                        {watchVariations?.length > 0 &&
                          watchVariations?.map((variation, i) => (
                            <div
                              key={i}
                              className="relative p-4 border rounded-md bg-gray-50 mb-4"
                            >
                              <div>
                                {t("name")}: {variation.name}
                              </div>
                              <div className="flex flex-wrap gap-2 items-center">
                                {t("options")}:{" "}
                                {variation.options?.map((option, i2) => (
                                  <div
                                    key={i2}
                                    className="flex items-center bg-[#DC3173] bg-opacity-10 text-white px-3 py-1 rounded-full"
                                  >
                                    <span>{option.label}</span>
                                    <span className="ml-2">
                                      (€{option.price})
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeVariation(variation.name)}
                                className="ml-2 hover:text-[#333] absolute top-1 right-1"
                              >
                                <XIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                      </div>
                      <div className="border rounded-md p-4 bg-gray-50 space-y-2">
                        <div>
                          <Label className="text-gray-700 mb-1">
                            {t("name")}
                          </Label>
                          <Input
                            type="text"
                            value={variationName}
                            onChange={(e) => setVariationName(e.target.value)}
                            placeholder="Add a variation name"
                          />
                        </div>
                        <Label className="text-gray-700">{t("options")}</Label>
                        {options?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-1">
                            {options?.map((option) => (
                              <div
                                key={option.label}
                                className="flex items-center bg-[#DC3173] bg-opacity-10 text-white px-3 py-1 rounded-full"
                              >
                                <span>{option.label}</span>
                                <span className="ml-2">(€{option.price})</span>
                                <button
                                  type="button"
                                  onClick={() => removeOption(option.label)}
                                  className="ml-2 text-white hover:text-[#CCC]"
                                >
                                  <XIcon className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="border border-dashed rounded-md p-4 bg-gray-100 space-y-2">
                          <div>
                            <Label className="text-gray-700 mb-1">
                              {t("label")}
                            </Label>
                            <Input
                              type="text"
                              value={option.label}
                              onChange={(e) =>
                                setOption({ ...option, label: e.target.value })
                              }
                              placeholder="Add an option label"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-700 mb-1">
                              {t("price")}
                            </Label>
                            <Input
                              type="number"
                              min={0}
                              value={option.price}
                              onChange={(e) =>
                                setOption({ ...option, price: e.target.value })
                              }
                              placeholder="Add an option price"
                              onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </div>
                          {businessType !== "RESTAURANT" && (
                            <div>
                              <Label className="text-gray-700 mb-1">
                                Stock Quantity
                              </Label>
                              <Input
                                type="number"
                                min={0}
                                value={option.stockQuantity}
                                onChange={(e) =>
                                  setOption({
                                    ...option,
                                    stockQuantity: Number(e.target.value),
                                  })
                                }
                                placeholder="Add stock quantity"
                                onKeyUp={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                  }
                                }}
                              />
                            </div>
                          )}
                          <div className="text-right">
                            <Button
                              onClick={addOption}
                              type="button"
                              size="sm"
                              className="bg-[#DC3173] hover:bg-[#DC3173]/90"
                            >
                              {t("add_option")}
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Button
                            onClick={addVariation}
                            type="button"
                            size="sm"
                            className="bg-[#DC3173] hover:bg-[#DC3173]/90"
                          >
                            {t("add_variation")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                {/* Pricing Tab */}
                {activeTab === 4 && (
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
                      {t("pricing_information")}
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                      {watchVariations.length === 0 && (
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem className="gap-1">
                              <FormLabel
                                htmlFor="price"
                                className="block text-sm font-medium text-gray-700"
                              >
                                {t("price_E")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min={0}
                                  value={String(field.value)}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0! foce focus:border-[#DC3173]! outline-none inset-0 h-10"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="discount"
                              className="block text-sm font-medium text-gray-700"
                            >
                              {t("discount_2")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min={0}
                                max={100}
                                value={String(field.value)}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0! foce focus:border-[#DC3173]! outline-none inset-0 h-10"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="taxId"
                        render={({ field }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="tax"
                              className="block text-sm font-medium text-gray-700"
                            >
                              {t("tax_2")}
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0! foce focus:border-[#DC3173]! outline-none inset-0 h-10">
                                  <SelectValue placeholder="Select tax" />
                                </SelectTrigger>
                                <SelectContent>
                                  {taxesData?.map((tax) => (
                                    <SelectItem key={tax._id} value={tax._id}>
                                      {tax.taxName}({}
                                      {tax.taxRate}%)
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {!!watchPrice && watchPrice > 0 && watchDiscount >= 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-gray-700">
                            {t("original_price")}:
                          </span>
                          <span className="font-medium">€ {watchPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">
                            {t("discount")} ({watchDiscount}%):
                          </span>
                          <span className="font-medium text-red-500">
                            - €{" "}
                            {((watchPrice * watchDiscount) / 100).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">
                            {t("tax")} (
                            {
                              taxesData?.find((tax) => tax._id === watchTaxId)
                                ?.taxRate
                            }
                            %):
                          </span>
                          <span className="font-medium">
                            + €{" "}
                            {(
                              (watchPrice *
                                (1 - watchDiscount / 100) *
                                (taxesData?.find(
                                  (tax) => tax._id === watchTaxId,
                                )?.taxRate || 0)) /
                              100
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="border-t mt-2 pt-2 flex justify-between">
                          <span className="font-semibold">
                            {t("final_price")}:
                          </span>
                          <span className="font-bold text-[#DC3173]">
                            €{" "}
                            {(
                              watchPrice *
                              (1 - watchDiscount / 100) *
                              (1 +
                                (taxesData?.find(
                                  (tax) => tax._id === watchTaxId,
                                )?.taxRate || 0) /
                                  100)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
                {/* Stock Tab */}
                {businessType !== "RESTAURANT" && activeTab === 5 && (
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
                      {t("stock_information")}
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {watchVariations.length === 0 && (
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem className="gap-1">
                              <FormLabel
                                htmlFor="quantity"
                                className="block text-sm font-medium text-gray-700"
                              >
                                {t("quantity")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min={0}
                                  value={String(field.value)}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0! foce focus:border-[#DC3173]! outline-none inset-0 h-10"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      <FormField
                        control={form.control}
                        name="unit"
                        render={({ field, fieldState }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="unit"
                              className="block text-sm font-medium text-gray-700"
                            >
                              {t("unit")}
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger
                                  className={cn(
                                    "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-0! foce focus:border-[#DC3173]! outline-none inset-0 h-10!",
                                    fieldState.invalid
                                      ? "border-destructive"
                                      : "border-gray-300",
                                  )}
                                >
                                  <SelectValue placeholder="Select a unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="kg">
                                    {t("kilogram")}
                                  </SelectItem>
                                  <SelectItem value="g">{t("gram")}</SelectItem>
                                  <SelectItem value="l">
                                    {t("liter")}
                                  </SelectItem>
                                  <SelectItem value="ml">
                                    {t("milliliter")}
                                  </SelectItem>
                                  <SelectItem value="pcs">
                                    {t("pieces")}
                                  </SelectItem>
                                  <SelectItem value="others">
                                    {t("others")}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="availabilityStatus"
                        render={({ field, fieldState }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="availabilityStatus"
                              className="block text-sm font-medium text-gray-700"
                            >
                              {t("availability_status")}
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger
                                  className={cn(
                                    "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-0! foce focus:border-[#DC3173]! outline-none inset-0 h-10!",
                                    fieldState.invalid
                                      ? "border-destructive"
                                      : "border-gray-300",
                                  )}
                                >
                                  <SelectValue placeholder="Select a unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="In Stock">
                                    {t("in_stock")}
                                  </SelectItem>
                                  <SelectItem value="Out of Stock">
                                    {t("out_of_stock")}
                                  </SelectItem>
                                  <SelectItem value="Limited">
                                    {t("limited")}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>
                )}
                {/* DeliGo Metadata Tab */}
                {activeTab === lastTabIndex && (
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
                      DeliGo Metadata Information
                    </h2>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                          <FormItem className="gap-1">
                            <FormControl>
                              <div className="">
                                <FormLabel
                                  htmlFor="isFeatured"
                                  className="text-sm text-gray-700 flex items-center"
                                >
                                  <Checkbox
                                    id="isFeatured"
                                    checked={!!field.value}
                                    onCheckedChange={(checked) =>
                                      field.onChange(checked)
                                    }
                                    className="h-4 w-4 text-[#DC3173] focus:ring-[#DC3173] border-gray-300 rounded data-[state=checked]:bg-[#DC3173] data-[state=checked]:border-[#DC3173]"
                                  />
                                  {t("featured_product")}
                                </FormLabel>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isAvailableForPreOrder"
                        render={({ field }) => (
                          <FormItem className="gap-1">
                            <FormControl>
                              <div className="">
                                <FormLabel
                                  htmlFor="isAvailableForPreOrder"
                                  className="text-sm text-gray-700 flex items-center"
                                >
                                  <Checkbox
                                    id="isAvailableForPreOrder"
                                    checked={!!field.value}
                                    onCheckedChange={(checked) =>
                                      field.onChange(checked)
                                    }
                                    className="h-4 w-4 text-[#DC3173] focus:ring-[#DC3173] border-gray-300 rounded data-[state=checked]:bg-[#DC3173] data-[state=checked]:border-[#DC3173]"
                                  />
                                  {t("available_for_pre_order")}
                                </FormLabel>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>
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
                    className={`px-6 py-2 rounded-lg flex items-center space-x-2 ${
                      activeTab === 0
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
                      className="px-6 py-2 bg-[#DC3173] hover:bg-[#B02458] text-white rounded-lg flex items-center space-x-2 shadow-lg shadow-pink-200/50"
                    >
                      <SaveIcon className="h-5 w-5" />
                      <span>{t("save_product")}</span>
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

        {/* AI Product Description Generator Dialog */}
        <DescriptionGeneratorDialog
          open={openDescriptionGenerator}
          onOpenChange={setOpenDescriptionGenerator}
          productCategories={productCategories || []}
          prevValues={{
            productName: form.getValues("name"),
            productCategory: form.getValues("category"),
            productImageUrl: form.getValues("images")?.[0],
          }}
          onGenerate={(description) => {
            form.setValue("description", description);
          }}
        />
      </motion.div>
    </div>
  );
}
