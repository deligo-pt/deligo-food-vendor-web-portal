"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Building2,
  Briefcase,
  FileCheck2,
  BadgeInfo,
  MapPin,
  Clock,
  CalendarX2,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

type BusinessForm = {
  businessName: string;
  businessType: string;
  businessLicenseNumber: string;
  NIF: string;
  branches: number;
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
  const { register, handleSubmit, setValue } = useForm<BusinessForm>();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const router = useRouter();

  const toggleDay = (day: string) => {
    const updated = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(updated);
    setValue("closingDays", updated);
  };

  const onSubmit = (data: BusinessForm) => {
    console.log("✅ Business details:", data);
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* ========== Section 1: Basic Info ========== */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                🏢 Basic Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Business Name */}
                <div className="relative">
                  <Building2 className="absolute left-3 top-3.5 text-[#DC3173]" />
                  <Input
                    {...register("businessName")}
                    placeholder="Business Name"
                    required
                    className="pl-10 h-12 border-gray-300 focus-visible:ring-2 focus-visible:ring-[#DC3173]/60"
                  />
                </div>

                {/* Business Type */}
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3.5 text-[#DC3173]/80" />
                  <select
                    {...register("businessType")}
                    required
                    className="pl-11 pr-4 h-12 w-full rounded-xl border border-gray-300 bg-white/90 text-gray-700 shadow-sm focus-visible:ring-2 focus-visible:ring-[#DC3173]/70 hover:shadow-md transition-all cursor-pointer"
                  >
                    <option value="">Select Business Type</option>
                    <option value="store">Store</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="service">Service Provider</option>
                  </select>
                </div>

                {/* License */}
                <div className="relative">
                  <FileCheck2 className="absolute left-3 top-3.5 text-[#DC3173]" />
                  <Input
                    {...register("businessLicenseNumber")}
                    placeholder="License Number"
                    required
                    className="pl-10 h-12 border-gray-300 focus-visible:ring-2 focus-visible:ring-[#DC3173]/60"
                  />
                </div>

                {/* NIF */}
                <div className="relative">
                  <BadgeInfo className="absolute left-3 top-3.5 text-[#DC3173]" />
                  <Input
                    {...register("NIF")}
                    placeholder="NIF"
                    required
                    className="pl-10 h-12 border-gray-300 focus-visible:ring-2 focus-visible:ring-[#DC3173]/60"
                  />
                </div>
              </div>
            </div>

            {/* ========== Section 2: Branch Info ========== */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                📍 Branch Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-[#DC3173]/80" />
                  <Input
                    {...register("branches")}
                    placeholder="No. of Branches"
                    required
                    type="number"
                    className="pl-11 pr-4 h-12 rounded-xl border-gray-300 bg-white/90 shadow-sm focus-visible:ring-2 focus-visible:ring-[#DC3173]/70 hover:shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* ========== Section 3: Working Hours ========== */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                ⏰ Working Hours
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Opening Hours */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#DC3173]" />
                    Opening Time
                  </label>
                  <select
                    {...register("openingHours")}
                    required
                    className="pl-3 pr-4 h-12 w-full rounded-xl border border-gray-300 bg-white/90 shadow-sm text-gray-700 focus-visible:ring-2 focus-visible:ring-[#DC3173]/70 hover:shadow-md cursor-pointer"
                  >
                    <option value="">Select Opening Time</option>
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Closing Hours */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#DC3173]" />
                    Closing Time
                  </label>
                  <select
                    {...register("closingHours")}
                    required
                    className="pl-3 pr-4 h-12 w-full rounded-xl border border-gray-300 bg-white/90 shadow-sm text-gray-700 focus-visible:ring-2 focus-visible:ring-[#DC3173]/70 hover:shadow-md cursor-pointer"
                  >
                    <option value="">Select Closing Time</option>
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Closing Days */}
              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <CalendarX2 className="w-4 h-4 text-[#DC3173]" />
                  Closing Days
                </label>

                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <motion.button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                        selectedDays.includes(day)
                          ? "bg-[#DC3173] text-white border-[#DC3173]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-[#DC3173]/70"
                      }`}
                    >
                      {day}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                className="w-full h-12 bg-[#DC3173] hover:bg-[#b12b61] text-white text-lg font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Save & Continue
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
