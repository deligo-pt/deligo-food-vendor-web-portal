"use client";

import { useForm } from "react-hook-form";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

type PersonalForm = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
};

export default function PersonalDetailsPage() {
  const { register, handleSubmit } = useForm<PersonalForm>();
  const router = useRouter();

  const onSubmit = (data: PersonalForm) => {
    console.log("Personal details:", data);
    router.push("/become-vendor/business-details");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-xl border border-white/60 backdrop-blur-xl bg-white/80 rounded-2xl p-6">
          <CardHeader className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex justify-center"
            >
              <div className="bg-[#DC3173]/10 p-4 rounded-full border border-[#DC3173]/20">
                <User className="w-8 h-8 text-[#DC3173]" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-[#DC3173] tracking-wide">
              Personal Details
            </CardTitle>
            <p className="text-gray-500 text-sm">
              Let’s start with your basic information
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* First Name */}
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <User className="text-gray-400 w-5 h-5" />
                </div>
                <Input
                  {...register("firstName")}
                  placeholder="First Name"
                  className="pl-10 py-3 text-base focus-visible:ring-2 focus-visible:ring-[#DC3173] focus:border-[#DC3173] transition-all duration-300 rounded-xl"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <User className="text-gray-400 w-5 h-5" />
                </div>
                <Input
                  {...register("lastName")}
                  placeholder="Last Name"
                  className="pl-10 py-3 text-base focus-visible:ring-2 focus-visible:ring-[#DC3173] focus:border-[#DC3173] transition-all duration-300 rounded-xl"
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Mail className="text-gray-400 w-5 h-5" />
                </div>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Email Address"
                  className="pl-10 py-3 text-base focus-visible:ring-2 focus-visible:ring-[#DC3173] focus:border-[#DC3173] transition-all duration-300 rounded-xl"
                  required
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Phone className="text-gray-400 w-5 h-5" />
                </div>
                <Input
                  {...register("phoneNumber")}
                  type="tel"
                  placeholder="Phone Number"
                  className="pl-10 py-3 text-base focus-visible:ring-2 focus-visible:ring-[#DC3173] focus:border-[#DC3173] transition-all duration-300 rounded-xl"
                  required
                />
              </div>

              {/* Submit Button */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  type="submit"
                  className="w-full font-semibold py-3 rounded-xl bg-gradient-to-r from-[#DC3173] to-[#a72b5c] text-white shadow-lg shadow-pink-200 hover:brightness-110 transition-all duration-300"
                >
                  Save & Continue
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
