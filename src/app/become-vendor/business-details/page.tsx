"use client";

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
import { TResponse } from "@/src/types";
import { TBusinessCategory } from "@/src/types/category.type";
import { getCookie } from "@/src/utils/cookies";
import { fetchData, updateData } from "@/src/utils/requests";
import { businessDetailsValidation } from "@/src/validations/become-vendor/business-details.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import {
  ArrowLeftCircle,
  BadgeInfo,
  Briefcase,
  Building2,
  CalendarX2,
  Clock,
  FileCheck2,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type BusinessForm = {
  businessName: string;
  businessType: string;
  businessLicenseNumber: string;
  NIF: string;
  branches: string;
  openingHours: string;
  closingHours: string;
  closingDays: string[];
};

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function BusinessDetailsPage() {
  const [businessCategories, setBusinessCategories] = useState<
    TBusinessCategory[]
  >([]);
  const form = useForm<BusinessForm>({
    resolver: zodResolver(businessDetailsValidation),
    defaultValues: {
      businessName: "",
      businessType: "",
      businessLicenseNumber: "",
      NIF: "",
      branches: "",
      openingHours: "",
      closingHours: "",
      closingDays: [],
    },
  });
  const router = useRouter();

  const onSubmit = async (data: BusinessForm) => {
    const toastId = toast.loading("Updating...");
    try {
      const accessToken = getCookie("accessToken");
      const decoded = jwtDecode(accessToken || "") as { id: string };

      const result = (await updateData(
        "/vendors/" + decoded?.id,
        {
          businessDetails: {
            ...data,
            NIF: data.NIF.toUpperCase(),
            businessLicenseNumber: data.businessLicenseNumber.toUpperCase(),
            noOfBranch: Number(data.branches),
          },
        },
        {
          headers: { authorization: accessToken },
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      )) as unknown as TResponse<any>;

      if (result.success) {
        toast.success("Business details updated successfully!", {
          id: toastId,
        });

        router.push("/become-vendor/business-location");
        return;
      }
      toast.error(result.message, { id: toastId });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Business details update failed",
        { id: toastId }
      );
      console.log(error);
    }
  };

  const getBusinessCategories = async () => {
    const accessToken = getCookie("accessToken");
    try {
      const result = (await fetchData("/categories/businessCategory", {
        headers: {
          authorization: accessToken,
        },
      })) as unknown as TResponse<{ data: TBusinessCategory[] }>;

      if (result.success) {
        setBusinessCategories(result?.data?.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (() => getBusinessCategories())();
  }, []);

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      const decoded = jwtDecode(accessToken || "") as {
        email: string;
        id: string;
      };
      if (decoded?.email) {
        const fetchUserData = async (id: string, token: string) => {
          try {
            const result = (await fetchData(`/vendors/${id}`, {
              headers: {
                authorization: token,
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            })) as unknown as TResponse<any>;

            if (result.success) {
              const data = result.data;

              form.setValue(
                "businessName",
                data.businessDetails.businessName || ""
              );
              form.setValue(
                "businessType",
                data.businessDetails.businessType || ""
              );
              form.setValue(
                "businessLicenseNumber",
                data.businessDetails.businessLicenseNumber || ""
              );
              form.setValue("NIF", data.businessDetails.NIF || "");
              form.setValue(
                "branches",
                String(data.businessDetails.noOfBranch || "")
              );
              form.setValue(
                "openingHours",
                data.businessDetails.openingHours || ""
              );
              form.setValue(
                "closingHours",
                data.businessDetails.closingHours || ""
              );
              form.setValue(
                "closingDays",
                data.businessDetails.closingDays || ""
              );
            }
          } catch (error) {
            console.log(error);
          }
        };
        fetchUserData(decoded.id, accessToken);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <ArrowLeftCircle /> Go Back
          </Button>
        </div>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-[#DC3173] mt-2">
            Business Details
          </CardTitle>
          <p className="text-center text-gray-500 mt-1 text-sm">
            Fill in your business information to complete registration
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* ========== Section 1: Basic Info ========== */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                  🏢 Basic Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Business Name */}
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
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
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-3.5 text-[#DC3173]/80" />
                          <FormControl>
                            <Select
                              {...field}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                className={cn(
                                  "pl-11 pr-4 h-12 w-full bg-white/90 text-gray-700 shadow-sm focus-visible:ring-2 focus-visible:ring-[#DC3173]/70 hover:shadow-md transition-all cursor-pointer  ",
                                  fieldState.invalid
                                    ? "border-destructive focus-visible:ring-destructive/20"
                                    : "border-gray-300"
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
                                    value={category?._id}
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

                  {/* License */}
                  <FormField
                    control={form.control}
                    name="businessLicenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <FileCheck2 className="absolute left-3 top-3.5 text-[#DC3173]" />
                          <FormControl>
                            <Input
                              placeholder="License Number"
                              className="pl-10 h-12 border-gray-300 focus-visible:ring-2 focus-visible:ring-[#DC3173]/60 uppercase"
                              {...field}
                            />
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
                        <div className="relative">
                          <BadgeInfo className="absolute left-3 top-3.5 text-[#DC3173]" />
                          <FormControl>
                            <Input
                              placeholder="NIF"
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
              </div>

              {/* ========== Section 2: Branch Info ========== */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                  📍 Branch Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="branches"
                    render={({ field }) => (
                      <FormItem>
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
                  ⏰ Working Hours
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
                            Opening Time
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
                            Closing Time
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
                          Closing Days
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {daysOfWeek.map((day) => (
                            <motion.button
                              key={day}
                              type="button"
                              onClick={() => {
                                field.onChange(
                                  field.value.includes(day)
                                    ? field.value.filter((d) => d !== day)
                                    : [...field.value, day]
                                );
                              }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                                field.value.includes(day)
                                  ? "bg-[#DC3173] text-white border-[#DC3173]"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-[#DC3173]/70"
                              }`}
                            >
                              {day}
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
                  className="w-full h-12 bg-[#DC3173] hover:bg-[#b12b61] text-white text-lg font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Save & Continue
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
