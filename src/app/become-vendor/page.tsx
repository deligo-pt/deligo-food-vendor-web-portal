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
import { useForm, useWatch } from "react-hook-form";

import StepperFlow from "@/src/components/Stepper/Stepper";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { TResponse } from "@/src/types";
import { postData } from "@/src/utils/requests";
import { becomeVendorValidation } from "@/src/validations/become-vendor/become-vendor.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type FormValues = {
  email: string;
  password: string;
  terms: boolean;
};

export default function BecomeVendorPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(becomeVendorValidation),
    defaultValues: {
      email: "",
      password: "",
      terms: false,
    },
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: FormValues) => {
    const toastId = toast.loading("Registering...");
    try {
      const result = (await postData(
        "/auth/register/create-vendor",
        data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      )) as unknown as TResponse<any>;

      if (result.success) {
        toast.success("Registration successful!", { id: toastId });
        router.push(`/become-vendor/verify-otp?email=${data.email}`);
        return;
      }
      toast.error(result.message, { id: toastId });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed", {
        id: toastId,
      });
      console.log(error);
    }
  };

  const [watchEmail, watchPassword, watchTerms] = useWatch({
    control: form.control,
    name: ["email", "password", "terms"],
  });
  const isFormFilled = !!watchEmail && !!watchPassword && watchTerms;

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 flex flex-col justify-center items-center px-4 py-10">
      {/* 🪜 Stepper Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-3xl mb-10"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#DC3173]">
            Vendor Registration Steps
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Follow these simple steps to become a verified vendor
          </p>
        </div>
        <StepperFlow />
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <FormLabel className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                          <Mail className="text-gray-400 w-5 h-5" />
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            className="pl-12 py-3 text-base focus-visible:ring-2 focus-visible:ring-[#DC3173] focus:border-[#DC3173] transition-all duration-300 rounded-xl"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <FormLabel className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                          <Lock className="text-gray-400 w-5 h-5" />
                        </FormLabel>
                        <FormControl>
                          <div>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="pl-12 pr-12 py-3 text-base focus-visible:ring-2 focus-visible:ring-[#DC3173] focus:border-[#DC3173] rounded-xl transition-all duration-300"
                              {...field}
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
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Terms */}
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-2 justify-center text-sm text-gray-600 select-none flex-wrap text-center">
                          <Checkbox
                            id="terms"
                            className="w-4 h-4 rounded-xs data-[state=checked]:bg-[#DC3173] data-[state=checked]:border-[#DC3173] border-[#DC3173] cursor-pointer"
                            {...field}
                            value={field.value ? "true" : "false"}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                            }}
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        ? "bg-linear-to-r from-[#DC3173] to-[#a72b5c] text-white hover:shadow-pink-200 hover:brightness-110"
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
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
