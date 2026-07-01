"use client";

import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { useTranslation } from "@/src/hooks/use-translation";
import { updateVendorReq } from "@/src/services/becomeVendor/become-vendor";
import { TBusinessCategory } from "@/src/types/category.type";
import { TCuisine } from "@/src/types/cuisine.type";
import { TVendor } from "@/src/types/vendor.type";
import { businessDetailsValidation } from "@/src/validations/become-vendor/business-details.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ArrowLeftCircle,
  BadgeInfo,
  Briefcase,
  Building2,
  CalendarX2,
  Clock,
  MapPin,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface IProps {
  businessCategories: TBusinessCategory[];
  cuisines: TCuisine[];
  vendor: TVendor;
}

type BusinessForm = z.infer<typeof businessDetailsValidation>;

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function BusinessDetailsForm({
  businessCategories,
  cuisines,
  vendor,
}: IProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [businessType, setBusinessType] = useState<string>();
  const form = useForm<BusinessForm>({
    resolver: zodResolver(businessDetailsValidation),
    defaultValues: {
      businessName: vendor?.businessDetails?.businessName || "",
      businessType: vendor?.businessDetails?.businessType || "",
      restaurantCuisineType: vendor?.businessDetails?.restaurantCuisineType || [],
      NIF: vendor?.businessDetails?.NIF || "",
      totalBranches: vendor?.businessDetails?.totalBranches?.toString() || "",
      openingHours: vendor?.businessDetails?.openingHours || "",
      closingHours: vendor?.businessDetails?.closingHours || "",
      closingDays: vendor?.businessDetails?.closingDays || [],
    },
  });

  const { formState: { isSubmitting } } = form;

  // const businessType = useWatch({
  //   control: form.control,
  //   name: "businessType",
  // });
  const type = "STORE";
  const onSubmit = async (data: BusinessForm) => {
    const toastId = toast.loading("Updating...");

    const { restaurantCuisineType, ...restOfData } = data;

    const processedData = type === "STORE"
      ? restOfData
      : { ...restOfData, restaurantCuisineType };

    const businessDetails = {
      businessDetails: {
        ...processedData,
        businessType : "STORE",
        NIF: data.NIF.toUpperCase(),
        totalBranches: Number(data.totalBranches),
      },
    };
    // console.log("businessDetails", businessDetails);
    const result = await updateVendorReq(vendor?.userId, businessDetails);

    if (result && result?.success) {
      toast.success("Business details updated successfully!", { id: toastId });
      router.push("/become-vendor/business-location");
      return;
    }

    toast.error(result?.message || "Business details update failed", { id: toastId });
    console.log(result);
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-linear-to-br from-pink-50 via-white to-pink-100 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Card className="w-full max-w-2xl p-6 shadow-2xl border-t-4 border-[#DC3173] bg-white rounded-2xl relative">
        <div className="absolute top-3 left-0">
          <Button
            onClick={() => router.push("/become-vendor/personal-details")}
            variant="link"
            className="inline-flex items-center px-4 text-sm gap-2 text-[#DC3173] p-0 h-4 cursor-pointer"
          >
            <ArrowLeftCircle /> {t("goBack")}
          </Button>
        </div>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-[#DC3173] mt-2">
            {t("businessDetails")}
          </CardTitle>
          <p className="text-center text-gray-500 mt-1 text-sm">
            {t("businessDetailsDesc")}
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* ========== Section 1: Basic Info ========== */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                  {t("basicInformation")}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Business Name */}
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-2 block text-sm font-medium text-gray-700">
                          {t("businessName")} <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3.5 text-[#DC3173]" />
                          <FormControl>
                            <Input
                              placeholder="Business Name"
                              className="pl-10 h-12 border-gray-300 focus-visible:ring-2 focus-visible:ring-[#DC3173]/60"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Business Type */}
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="mb-2 block text-sm font-medium text-gray-700">
                          {t("businessType")} <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-3.5 text-[#DC3173]/80" />
                          <FormControl>
                            <Select
                              {...field}
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                setBusinessType(value);
                              }}
                            >
                              <SelectTrigger
                                className={cn(
                                  "pl-11 pr-4 h-12 w-full bg-white/90 text-gray-700 shadow-sm focus-visible:ring-2 focus-visible:ring-[#DC3173]/70 hover:shadow-md transition-all cursor-pointer  ",
                                  fieldState.invalid
                                    ? "border-destructive focus-visible:ring-destructive/20"
                                    : "border-gray-300",
                                )}
                                style={{
                                  height: "3rem",
                                }}
                              >
                                <SelectValue placeholder="Select Business Type" />
                              </SelectTrigger>
                              <SelectContent>
                                {businessCategories.map((category) => (
                                  <SelectItem
                                    key={category?._id}
                                    value={category?.name}
                                    onClick={() => setBusinessType(category?.slug)}
                                    className="capitalize"
                                  >
                                    {category?.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* NIF */}
                  <FormField
                    control={form.control}
                    name="NIF"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-2 block text-sm font-medium text-gray-700">
                          {t("nif")} <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="relative">
                          <BadgeInfo className="absolute left-3 top-3.5 text-[#DC3173]" />
                          <FormControl>
                            <Input
                              placeholder="NIF"
                              type="number"
                              className="pl-10 h-12 border-gray-300 focus-visible:ring-2 focus-visible:ring-[#DC3173]/60 uppercase"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* if business type is restaurant */}
                {businessType === "RESTAURANT" && (
                  <FormField
                    control={form.control}
                    name="restaurantCuisineType"
                    render={({ field, fieldState }) => {
                      const selectedCuisines = Array.isArray(field.value) ? field.value : [];

                      // remove cuisine
                      const handleRemoveCuisine = (cuisineToRemove: string) => {
                        const updatedCuisines = selectedCuisines.filter(
                          (item) => item !== cuisineToRemove
                        );
                        field.onChange(updatedCuisines);
                      };

                      // add cuisine
                      const handleSelectCuisine = (cuisineToAdd: string) => {
                        if (!selectedCuisines.includes(cuisineToAdd)) {
                          field.onChange([...selectedCuisines, cuisineToAdd]);
                        }
                      };

                      return (
                        <FormItem>
                          <FormLabel className="mb-2 block text-sm font-medium text-gray-700 mt-5">
                            {t("restaurantCuisineType")} <span className="text-red-500">*</span>
                          </FormLabel>

                          {/* 4. Display Selected Badges ABOVE the Select Dropdown */}
                          {selectedCuisines.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3 p-2 border border-dashed rounded-lg bg-gray-50/50">
                              {selectedCuisines.map((cuisine) => (
                                <Badge
                                  key={cuisine}
                                  variant="secondary"
                                  className="flex items-center gap-1 bg-[#DC3173]/10 text-[#DC3173] hover:bg-[#DC3173]/20 transition-all capitalize px-3 py-1 text-sm font-medium"
                                >
                                  {cuisine}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveCuisine(cuisine)}
                                    className="rounded-full outline-none hover:bg-[#DC3173]/20 p-0.5"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="relative">
                            <Briefcase className="absolute left-3 top-3.5 text-[#DC3173]/80" />
                            <FormControl>
                              <Select
                                value=""
                                onValueChange={handleSelectCuisine}
                              >
                                <SelectTrigger
                                  className={cn(
                                    "pl-11 pr-4 h-12 w-full bg-white/90 text-gray-700 shadow-sm focus-visible:ring-2 focus-visible:ring-[#DC3173]/70 hover:shadow-md transition-all cursor-pointer",
                                    fieldState.invalid ? "border-destructive focus-visible:ring-destructive/20" : "border-gray-300"
                                  )}
                                  style={{ height: "3rem" }}
                                >
                                  <SelectValue placeholder="Select Multiple Cuisine" />
                                </SelectTrigger>

                                <SelectContent>
                                  {cuisines?.length < 1 ? (
                                    <div className="p-2 text-sm text-gray-500">
                                      {t("no_items_found")}
                                    </div>
                                  ) : (
                                    cuisines?.map((type, idx) => {
                                      const isAlreadySelected = selectedCuisines.includes(type?.name);
                                      return (
                                        <SelectItem
                                          key={idx}
                                          value={type?.name}
                                          className="capitalize"
                                          disabled={isAlreadySelected}
                                        >
                                          {type?.name} {isAlreadySelected && "✓"}
                                        </SelectItem>
                                      );
                                    })
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                )}
              </div>

              {/* ========== Section 2: Branch Info ========== */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                  {t("branchInformation")}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="totalBranches"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-2 block text-sm font-medium text-gray-700">
                          {t("no_of_branches")} <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3.5 text-[#DC3173]/80" />
                          <FormControl>
                            <Input
                              placeholder="No. of Branches"
                              type="number"
                              min="1"
                              className="pl-11 pr-4 h-12 rounded-xl border-gray-300 bg-white/90 shadow-sm focus-visible:ring-2 focus-visible:ring-[#DC3173]/70 hover:shadow-md"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* ========== Section 3: Working Hours ========== */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                  {t("workingHours")}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Opening Hours */}
                  <FormField
                    control={form.control}
                    name="openingHours"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <FormLabel className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#DC3173]" />
                            {t("openingTime")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              className="px-3 h-12 border-gray-300 focus-visible:ring-2 focus-visible:ring-[#DC3173]/60"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Closing Hours */}
                  <FormField
                    control={form.control}
                    name="closingHours"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <FormLabel className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#DC3173]" />
                            {t("closingTime")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              className="px-3 h-12 border-gray-300 focus-visible:ring-2 focus-visible:ring-[#DC3173]/60"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Closing Days */}
                <FormField
                  control={form.control}
                  name="closingDays"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mt-5">
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <CalendarX2 className="w-4 h-4 text-[#DC3173]" />
                          {t("closingDays")}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {daysOfWeek.map((day) => (
                            <motion.button
                              key={day}
                              type="button"
                              onClick={() => {
                                field.onChange(
                                  field.value?.includes(day)
                                    ? field.value.filter((d) => d !== day)
                                    : [...(field.value || []), day],
                                );
                              }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${field.value?.includes(day)
                                ? "bg-[#DC3173] text-white border-[#DC3173]"
                                : "bg-white text-gray-700 border-gray-300 hover:border-[#DC3173]/70"
                                }`}
                            >
                              {t(day.toLowerCase())}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full h-12 bg-[#DC3173] hover:bg-[#b12b61] text-white text-lg font-semibold shadow-md hover:shadow-lg transition-all ${isSubmitting ? "cursor-not-allowed opacity-70" : ""}`}
                >
                  {t("saveContinue")}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
