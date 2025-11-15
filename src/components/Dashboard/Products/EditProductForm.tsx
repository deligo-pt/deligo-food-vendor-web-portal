"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/src/components/Dashboard/Products/ProductImageUpload";
import { Input } from "@/src/components/ui/input";
import { TResponse } from "@/src/types";
import { TProduct } from "@/src/types/product.type";
import { getCookie } from "@/src/utils/cookies";
import { updateData } from "@/src/utils/requests";
import { productValidation } from "@/src/validations/product/product.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ImageIcon,
  InfoIcon,
  PackageIcon,
  PlusIcon,
  SaveIcon,
  StarIcon,
  TagIcon,
  TruckIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const tabs = [
  {
    name: "Basic Info",
    icon: <PackageIcon className="h-5 w-5" />,
  },
  {
    name: "Images",
    icon: <ImageIcon className="h-5 w-5" />,
  },
  {
    name: "Pricing",
    icon: <TagIcon className="h-5 w-5" />,
  },
  {
    name: "Stock",
    icon: <PackageIcon className="h-5 w-5" />,
  },
  {
    name: "Delivery",
    icon: <TruckIcon className="h-5 w-5" />,
  },
  {
    name: "Attributes",
    icon: <InfoIcon className="h-5 w-5" />,
  },
  {
    name: "Meta",
    icon: <StarIcon className="h-5 w-5" />,
  },
];

type FormData = z.infer<typeof productValidation>;

interface IProps {
  prevData: TProduct;
  refetch: () => void;
  closeModal: () => void;
}

export function EditProductForm({ prevData, refetch, closeModal }: IProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [images, setImages] = useState<{ file: File | null; url: string }[]>(
    prevData?.images?.map((img) => ({ file: null, url: img })) || []
  );
  const [tag, setTag] = useState("");
  const form = useForm<FormData>({
    resolver: zodResolver(productValidation),
    defaultValues: {
      name: prevData?.name || "",
      description: prevData?.description || "",
      category: prevData?.category || "",
      subCategory: prevData?.subCategory || "",
      brand: prevData?.brand || "",
      price: prevData?.pricing?.price || 0,
      discount: prevData?.pricing?.discount || 0,
      tax: prevData?.pricing?.tax || 0,
      quantity: prevData?.stock?.quantity || 0,
      unit: prevData?.stock?.unit || "",
      availabilityStatus: prevData?.stock?.availabilityStatus || "",
      tags: prevData?.tags || [],
      deliveryType: prevData?.deliveryInfo?.deliveryType || "",
      estimatedTime: prevData?.deliveryInfo?.estimatedTime || "",
      deliveryCharge: prevData?.deliveryInfo?.deliveryCharge || 0,
      freeDeliveryAbove: prevData?.deliveryInfo?.freeDeliveryAbove || 0,
      organic: (prevData?.attributes?.organic as boolean) || true,
      weight: (prevData?.attributes?.weight as number) || 0,
      packagingType: (prevData?.attributes?.packagingType as string) || "",
      storageTemperature:
        (prevData?.attributes?.storageTemperature as string) || "",
      isFeatured: prevData?.meta?.isFeatured || false,
      isAvailableForPreOrder: prevData?.meta?.isAvailableForPreOrder || false,
      status: prevData?.meta?.status || "",
      origin: prevData?.meta?.origin || "",
    },
  });

  const [watchPrice, watchDiscount, watchTax, watchTags] = useWatch({
    control: form.control,
    name: ["price", "discount", "tax", "tags"],
  });

  const addTag = () => {
    if (tag && !form?.getValues("tags")?.includes(tag)) {
      const newTags = [...form?.getValues("tags"), tag];
      form.setValue("tags", newTags);
    }
    setTag("");
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = form?.getValues("tags")?.filter((t) => t !== tagToRemove);
    form.setValue("tags", newTags);
  };

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading("Updating product...");

    try {
      const productData = {
        name: data.name,
        description: data.description,
        category: data.category,
        subCategory: data.subCategory,
        brand: data.brand,
        pricing: {
          price: data.price,
          discount: data.discount,
          tax: data.tax,
        },
        stock: {
          quantity: data.quantity,
          unit: data.unit,
          availabilityStatus: data.availabilityStatus,
        },
        tags: data.tags,
        deliveryInfo: {
          deliveryType: data.deliveryType,
          estimatedTime: data.estimatedTime,
          deliveryCharge: data.deliveryCharge,
          freeDeliveryAbove: data.freeDeliveryAbove,
        },
        attributes: {
          organic: data.organic,
          weight: data.weight,
          packagingType: data.packagingType,
          storageTemperature: data.storageTemperature,
        },
        meta: {
          isFeatured: data.isFeatured,
          isAvailableForPreOrder: data.isAvailableForPreOrder,
          status: data.status,
          origin: data.origin,
        },
        images: images,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(productData));
      const filteredImages = images.filter((image) => !!image.file);

      if (filteredImages?.length > 0) {
        filteredImages?.map((image) =>
          formData.append("files", image.file as Blob)
        );
      }
      console.log(filteredImages);

      const result = (await updateData(
        `/products/${prevData?.productId}`,
        formData,
        {
          headers: {
            authorization: getCookie("accessToken"),
            "Content-Type": "multipart/form-data",
          },
        }
      )) as unknown as TResponse<TProduct>;

      if (result.success) {
        toast.success("Product updated successfully!", { id: toastId });
        form.reset();
        setActiveTab(0);
        refetch();
        closeModal();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Updating product failed", {
        id: toastId,
      });
    }
  };

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
        className="bg-white shadow-xl rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-8 bg-linear-to-r from-[#DC3173] to-[#FF6B98] text-white">
          <h1 className="text-3xl font-bold">Update Item</h1>
          <p className="mt-2 text-pink-100">
            Fill in the details to update the food product of your menu.
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
                  className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg text-left ${
                    activeTab === index
                      ? "bg-[#DC3173] text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
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
                      Basic Information
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Product Name
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
                        name="brand"
                        render={({ field }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="brand"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Brand
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
                    </div>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="gap-1">
                          <FormLabel
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0! foce focus:border-[#DC3173]! outline-none inset-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field, fieldState }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="category"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Category
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
                                      : "border-gray-300"
                                  )}
                                >
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="grocery">
                                    Grocery
                                  </SelectItem>
                                  <SelectItem value="beverages">
                                    Beverages
                                  </SelectItem>
                                  <SelectItem value="snacks">Snacks</SelectItem>
                                  <SelectItem value="dairy">Dairy</SelectItem>
                                  <SelectItem value="bakery">Bakery</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subCategory"
                        render={({ field, fieldState }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="subCategory"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Subcategory
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
                                      : "border-gray-300"
                                  )}
                                >
                                  <SelectValue placeholder="Select a subcategory" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="organic">
                                    Organic
                                  </SelectItem>
                                  <SelectItem value="vegan">Vegan</SelectItem>
                                  <SelectItem value="gluten-free">
                                    Gluten Free
                                  </SelectItem>
                                  <SelectItem value="keto">Keto</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags
                      </label>
                      {watchTags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-1">
                          {watchTags?.map((tag) => (
                            <motion.div
                              key={tag}
                              initial={{
                                scale: 0,
                              }}
                              animate={{
                                scale: 1,
                              }}
                              className="flex items-center bg-[#DC3173] bg-opacity-10 text-white px-3 py-1 rounded-full"
                            >
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
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
                        name="tags"
                        render={() => (
                          <FormItem className="gap-1">
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="text"
                                  value={tag}
                                  onChange={(e) => setTag(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0! foce focus:border-[#DC3173]! outline-none inset-0 h-10"
                                  placeholder="Add a tag"
                                  onKeyUp={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addTag();
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={addTag}
                                  className="bg-[#DC3173] text-white px-4 py-2 rounded-r-md hover:bg-[#B02458] transition-colors absolute top-0 right-0 h-full"
                                >
                                  <PlusIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="origin"
                      render={({ field }) => (
                        <FormItem className="gap-1">
                          <FormLabel
                            htmlFor="origin"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Origin
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
                      Product Images
                    </h2>
                    <ImageUpload images={images} setImages={setImages} />
                  </motion.div>
                )}
                {/* Pricing Tab */}
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
                      Pricing Information
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="price"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Price ($)
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
                      <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="discount"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Discount (%)
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
                        name="tax"
                        render={({ field }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="tax"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Tax (%)
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
                    </div>
                    {watchPrice > 0 && watchDiscount >= 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Original Price:</span>
                          <span className="font-medium">${watchPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">
                            Discount ({watchDiscount}%):
                          </span>
                          <span className="font-medium text-red-500">
                            -$
                            {((watchPrice * watchDiscount) / 100).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">
                            Tax ({watchTax}%):
                          </span>
                          <span className="font-medium">
                            +$
                            {(
                              (watchPrice *
                                (1 - watchDiscount / 100) *
                                watchTax) /
                              100
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="border-t mt-2 pt-2 flex justify-between">
                          <span className="font-semibold">Final Price:</span>
                          <span className="font-bold text-[#DC3173]">
                            $
                            {(
                              watchPrice *
                              (1 - watchDiscount / 100) *
                              (1 + watchTax / 100)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
                {/* Stock Tab */}
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
                      Stock Information
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="quantity"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Quantity
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
                      <FormField
                        control={form.control}
                        name="unit"
                        render={({ field, fieldState }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="unit"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Unit
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
                                      : "border-gray-300"
                                  )}
                                >
                                  <SelectValue placeholder="Select a unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="kg">
                                    Kilogram (kg)
                                  </SelectItem>
                                  <SelectItem value="g">Gram (g)</SelectItem>
                                  <SelectItem value="l">Liter (l)</SelectItem>
                                  <SelectItem value="ml">
                                    Milliliter (ml)
                                  </SelectItem>
                                  <SelectItem value="pcs">
                                    Pieces (pcs)
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
                              Availability Status
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
                                      : "border-gray-300"
                                  )}
                                >
                                  <SelectValue placeholder="Select a unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="In Stock">
                                    In Stock
                                  </SelectItem>
                                  <SelectItem value="Out of Stock">
                                    Out of Stock
                                  </SelectItem>
                                  <SelectItem value="Limited">
                                    Limited Stock
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
                {/* Delivery Tab */}
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
                      Delivery Information
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="deliveryType"
                        render={({ field, fieldState }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="deliveryType"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Delivery Type
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
                                      : "border-gray-300"
                                  )}
                                >
                                  <SelectValue placeholder="Select a selivery type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Instant">
                                    Instant
                                  </SelectItem>
                                  <SelectItem value="Scheduled">
                                    Scheduled
                                  </SelectItem>
                                  <SelectItem value="Pickup">Pickup</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="estimatedTime"
                        render={({ field }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="estimatedTime"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Estimated Delivery Time
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
                        name="deliveryCharge"
                        render={({ field }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="deliveryCharge"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Delivery Charge ($)
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
                      <FormField
                        control={form.control}
                        name="freeDeliveryAbove"
                        render={({ field }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="freeDeliveryAbove"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Free Delivery Above ($)
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
                    </div>
                  </motion.div>
                )}
                {/* Attributes Tab */}
                {activeTab === 5 && (
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
                      Product Attributes
                    </h2>
                    <FormField
                      control={form.control}
                      name="organic"
                      render={({ field }) => (
                        <FormItem className="gap-1">
                          <FormControl>
                            <div className="">
                              <FormLabel
                                htmlFor="organic"
                                className="text-sm text-gray-700 flex items-center"
                              >
                                <Checkbox
                                  id="organic"
                                  checked={!!field.value}
                                  onCheckedChange={(checked) =>
                                    field.onChange(checked)
                                  }
                                  className="h-4 w-4 text-[#DC3173] focus:ring-[#DC3173] border-gray-300 rounded data-[state=checked]:bg-[#DC3173] data-[state=checked]:border-[#DC3173]"
                                />
                                Organic
                              </FormLabel>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="weight"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Weight
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
                      <FormField
                        control={form.control}
                        name="packagingType"
                        render={({ field, fieldState }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="packagingType"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Packaging Type
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
                                      : "border-gray-300"
                                  )}
                                >
                                  <SelectValue placeholder="Select a packaging type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Plastic Bag">
                                    Plastic Bag
                                  </SelectItem>
                                  <SelectItem value="Paper Bag">
                                    Paper Bag
                                  </SelectItem>
                                  <SelectItem value="Box">Box</SelectItem>
                                  <SelectItem value="Tin">Tin</SelectItem>
                                  <SelectItem value="Bottle">Bottle</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="storageTemperature"
                        render={({ field, fieldState }) => (
                          <FormItem className="gap-1">
                            <FormLabel
                              htmlFor="storageTemperature"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Storage Temperature
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
                                      : "border-gray-300"
                                  )}
                                >
                                  <SelectValue placeholder="Select room temperature" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Room temperature">
                                    Room temperature
                                  </SelectItem>
                                  <SelectItem value="Refrigerated">
                                    Refrigerated
                                  </SelectItem>
                                  <SelectItem value="Frozen">Frozen</SelectItem>
                                  <SelectItem value="Cool and dry">
                                    Cool and dry
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
                {/* Meta Tab */}
                {activeTab === 6 && (
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
                      Meta Information
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
                                  Featured Product
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
                                  Available for Pre-Order
                                </FormLabel>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field, fieldState }) => (
                        <FormItem className="gap-1">
                          <FormLabel
                            htmlFor="status"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Status
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
                                    : "border-gray-300"
                                )}
                              >
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">
                                  Inactive
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Previous</span>
                  </motion.button>
                  {activeTab === tabs.length - 1 ? (
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
                      <span>Save Product</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{
                        scale: 1.02,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                      type="button"
                      onClick={() =>
                        activeTab < tabs.length - 1 &&
                        setActiveTab(activeTab + 1)
                      }
                      className="px-6 py-2 bg-[#DC3173] hover:bg-[#B02458] text-white rounded-lg flex items-center space-x-2"
                    >
                      <span>Next</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
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
