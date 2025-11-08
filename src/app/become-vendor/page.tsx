"use client";

import { useForm } from "react-hook-form";


import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import StepperFlow from "@/src/components/Stepper/Stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";


type FormValues = {
  email: string;
  password: string;
  terms: boolean;
};

export default function BecomeVendorPage() {
  const { register, handleSubmit, watch } = useForm<FormValues>();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: FormValues) => {
    console.log("Submitted:", data);
    router.push("/become-vendor/verify-otp");
  };

  const isFormFilled =
    watch("email") && watch("password") && watch("terms") === true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col justify-center items-center px-4 py-10">
      
      {/* 🪜 Stepper Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-3xl mb-10"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#DC3173]">Vendor Registration Steps</h2>
          <p className="text-gray-500 text-sm mt-1">
            Follow these simple steps to become a verified vendor
          </p>
        </div>
        <StepperFlow/>
      </motion.div>

      {/* 🧾 Form Section */}
     <motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
  className="w-full max-w-md"
>
  <Card className="shadow-2xl border border-white/40 backdrop-blur-2xl bg-white/70 rounded-2xl">
    <CardHeader className="text-center space-y-3">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="bg-[#DC3173]/10 p-5 rounded-full border border-[#DC3173]/20 shadow-md">
          <UserPlus className="w-8 h-8 text-[#DC3173]" />
        </div>
      </motion.div>
      <CardTitle className="text-3xl font-bold text-[#DC3173] tracking-wide">
        Become a Vendor
      </CardTitle>
      <p className="text-gray-600 text-sm font-medium">
        Join our partner network and grow with us
      </p>
    </CardHeader>

    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Mail className="text-gray-400 w-5 h-5" />
          </div>
          <Input
            {...register("email")}
            type="email"
            placeholder="Enter your email"
            className="pl-12 py-3 text-base focus-visible:ring-2 focus-visible:ring-[#DC3173] focus:border-[#DC3173] rounded-xl transition-all duration-300"
            required
          />
        </div>

        {/* Password */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Lock className="text-gray-400 w-5 h-5" />
          </div>
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="pl-12 pr-12 py-3 text-base focus-visible:ring-2 focus-visible:ring-[#DC3173] focus:border-[#DC3173] rounded-xl transition-all duration-300"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-[#DC3173] transition"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Terms */}
        <div className="flex items-center gap-2 justify-center text-sm text-gray-600 select-none flex-wrap text-center">
          <input
            type="checkbox"
            {...register("terms")}
            id="terms"
            className="w-4 h-4 accent-[#DC3173] cursor-pointer"
          />
          <label
            htmlFor="terms"
            className="cursor-pointer leading-tight text-gray-700"
          >
            I accept the{" "}
            <Link
              href="/terms"
              className="text-[#DC3173] font-semibold hover:underline"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-[#DC3173] font-semibold hover:underline"
            >
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* Submit */}
        <motion.div
          whileHover={{ scale: isFormFilled ? 1.03 : 1 }}
          whileTap={{ scale: isFormFilled ? 0.97 : 1 }}
        >
          <Button
            type="submit"
            disabled={!isFormFilled}
            className={`w-full font-semibold py-3 rounded-xl shadow-xl transition-all duration-300 ${
              isFormFilled
                ? "bg-gradient-to-r from-[#DC3173] to-[#a72b5c] text-white hover:shadow-pink-200 hover:brightness-110"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Confirm & Continue
          </Button>
        </motion.div>

        {/* Already Vendor */}
        <div className="text-center text-sm text-gray-600">
          Already a Vendor?{" "}
          <Link
            href="/login"
            className="text-[#DC3173] font-semibold hover:underline hover:text-[#a72b5c]"
          >
            Login
          </Link>
        </div>
      </form>
    </CardContent>
  </Card>
</motion.div>


    </div>
  );
}
