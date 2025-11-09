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
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { TResponse } from "@/src/types";
import { getCookie } from "@/src/utils/cookies";
import { updateData } from "@/src/utils/requests";
import { businessDetailsValidation } from "@/src/validations/become-vendor/business-details.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  BadgeInfo,
  Briefcase,
  Building2,
  CalendarX2,
  Clock,
  FileCheck2,
  MapPin,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

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

const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${minute}`;
});

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
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
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
    try {
      const result = (await updateData(
        "/vendors/" + id,
        {
          businessDetails: {
            ...data,
            noOfBranch: data.branches,
          },
        },
        {
          headers: { authorization: getCookie("accessToken") },
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      )) as unknown as TResponse<any>;

      if (result.success) {
        router.push("/become-vendor/business-location?id=" + id);
      }
    } catch (error) {
      console.log(error);
    }
    router.push("/become-vendor/business-location");
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Card className="w-full max-w-2xl p-6 shadow-2xl border-t-4 border-[#DC3173] bg-white rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-[#DC3173]">
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
                    render={({ field }) => (
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
                                className="pl-11 pr-4 h-12 w-full border-gray-300 bg-white/90 text-gray-700 shadow-sm focus-visible:ring-2 focus-visible:ring-[#DC3173]/70 hover:shadow-md transition-all cursor-pointer aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[]:"
                                style={{
                                  height: "3rem",
                                }}
                              >
                                <SelectValue placeholder="Select Business Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="store">Store</SelectItem>
                                <SelectItem value="restaurant">
                                  Restaurant
                                </SelectItem>
                                <SelectItem value="pharmacy">
                                  Pharmacy
                                </SelectItem>
                                <SelectItem value="service">
                                  Service Provider
                                </SelectItem>
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
                              className="pl-10 h-12 border-gray-300 focus-visible:ring-2 focus-visible:ring-[#DC3173]/60"
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
                              className="pl-10 h-12 border-gray-300 focus-visible:ring-2 focus-visible:ring-[#DC3173]/60"
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
                              inputMode="numeric"
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
                            <Select
                              {...field}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                className="pl-3 pr-4 h-12 w-full border border-gray-300 bg-white/90 text-gray-700 shadow-sm focus-visible:ring-2 focus-visible:ring-[#DC3173]/70 hover:shadow-md transition-all cursor-pointer"
                                style={{
                                  height: "3rem",
                                }}
                              >
                                <SelectValue placeholder="Select Opening Time" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((t) => (
                                  <SelectItem key={t} value={t}>
                                    {t}
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
                            <Select
                              {...field}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                className="pl-3 pr-4 h-12 w-full border border-gray-300 bg-white/90 text-gray-700 shadow-sm focus-visible:ring-2 focus-visible:ring-[#DC3173]/70 hover:shadow-md transition-all cursor-pointer"
                                style={{
                                  height: "3rem",
                                }}
                              >
                                <SelectValue placeholder="Select Closing Time" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((t) => (
                                  <SelectItem key={t} value={t}>
                                    {t}
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
