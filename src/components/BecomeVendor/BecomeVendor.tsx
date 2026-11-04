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
import { useTranslation } from "@/src/hooks/use-translation";
import { registerVendorReq } from "@/src/services/becomeVendor/become-vendor";
import { setLocalOtpExpiry } from "@/src/utils/localOtpExpiry";
import { becomeVendorValidation } from "@/src/validations/become-vendor/become-vendor.validation";
import { errorKeyOf, fieldErrorsOf, loyaltyErrorCopyKey } from "@/src/utils/loyalty";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Gift, Lock, Mail, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type FormValues = {
  email: string;
  password: string;
  terms: boolean;
  referralCode?: string;
};

/** Referral errors the server can answer on register (guide §3.5). */
const REFERRAL_ERROR_KEYS = ["INVALID_REFERRAL_CODE", "SELF_REFERRAL_NOT_ALLOWED", "ALREADY_REFERRED"];

export default function BecomeVendor({ initialReferralCode = "" }: { initialReferralCode?: string }) {
  const { t } = useTranslation();
  const form = useForm<FormValues>({
    resolver: zodResolver(becomeVendorValidation),
    defaultValues: {
      email: "",
      password: "",
      terms: false,
      referralCode: initialReferralCode,
    },
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { formState: { isSubmitting } } = form;

  const onSubmit = async (data: FormValues) => {
    const toastId = toast.loading("Registering...");

    // Sent only when filled: an empty key adds nothing, and an older server
    // rejected the key outright.
    const referralCode = data.referralCode?.trim().toUpperCase();
    const result = await registerVendorReq({
      email: data.email,
      role: "VENDOR",
      password: data.password,
      ...(referralCode ? { referralCode } : {}),
    });

    if (result.success) {
      toast.success(result.message || "Registration successful!", {
        id: toastId,
      });
      setLocalOtpExpiry();
      router.push(`/become-vendor/verify-otp?email=${data.email}`);
      return;
    }

    // A bad referral code belongs on its field, not in a toast the vendor
    // might read as "registration is broken".
    const referralFieldError = fieldErrorsOf(result).referralCode;
    if (REFERRAL_ERROR_KEYS.includes(errorKeyOf(result) ?? "") || referralFieldError) {
      toast.dismiss(toastId);
      form.setError("referralCode", {
        message: referralFieldError && !errorKeyOf(result) ? t("loyalty_error_invalid_referral_code") : t(loyaltyErrorCopyKey(result)),
      });
      form.setFocus("referralCode");
      return;
    }

    toast.error(result.message || "Registration failed", { id: toastId });
    console.log(result);
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
        className="w-full max-w-5xl mb-10"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#DC3173]">
            {t("vendorRegistration")}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {t("vendorRegistrationDesc")}
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
              {t("becomeVendor")}
            </CardTitle>
            <p className="text-gray-600 text-sm font-medium">
              {t("joinPartnerNetwork")}
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
                        <FormLabel className="flex items-center pointer-events-none mb-2 mx-1">
                          <Mail className="text-[#DC3173] w-5 h-5" />
                          <span>{t("email")}</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            className="py-3 text-base focus-visible:ring-2 focus-visible:ring-[#DC3173] focus:border-[#DC3173] transition-all duration-300 rounded-xl"
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
                        <FormLabel className="flex items-center pointer-events-none mb-2 mx-1]">
                          <Lock className="text-[#DC3173] w-5 h-5" />
                          <span>{t("password")}</span>
                        </FormLabel>
                        <FormControl>
                          <div>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="pr-12 py-3 text-base focus-visible:ring-2 focus-visible:ring-[#DC3173] focus:border-[#DC3173] rounded-xl transition-all duration-300"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-4 top-7 flex items-center text-gray-400 hover:text-[#DC3173] transition"
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

                {/* Referral code (optional) */}
                <FormField
                  control={form.control}
                  name="referralCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center pointer-events-none mb-2 mx-1">
                        <Gift className="text-[#DC3173] w-5 h-5" />
                        <span>{t("loyalty_referral_code_label")}</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          autoComplete="off"
                          autoCapitalize="characters"
                          spellCheck={false}
                          maxLength={32}
                          placeholder={t("loyalty_referral_code_placeholder")}
                          className="py-3 text-base uppercase placeholder:normal-case focus-visible:ring-2 focus-visible:ring-[#DC3173] focus:border-[#DC3173] transition-all duration-300 rounded-xl"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500 mx-1">{t("loyalty_referral_code_hint")}</p>
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
                            {t("iAcceptThe")}{" "}
                            <Link
                              href="/terms"
                              className="text-[#DC3173] font-semibold hover:underline"
                            >
                              {t("termCondition")}
                            </Link>{" "}
                            {t("and")}{" "}
                            <Link
                              href="/privacy"
                              className="text-[#DC3173] font-semibold hover:underline"
                            >
                              {t("privacyPolicy")}
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
                    disabled={!isFormFilled || isSubmitting}
                    className={`w-full font-semibold py-3 rounded-xl shadow-xl transition-all duration-300 ${isFormFilled || isSubmitting
                      ? "bg-linear-to-r from-[#DC3173] to-[#a72b5c] text-white hover:shadow-pink-200 hover:brightness-110"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    {isSubmitting ? "Registering in..." : t("confirmAndContinue")}
                  </Button>
                </motion.div>

                {/* Already Vendor */}
                <div className="text-center text-sm text-gray-600">
                  {t("alreadyVendor")}{" "}
                  <Link
                    href="/login"
                    className="text-[#DC3173] font-semibold hover:underline hover:text-[#a72b5c]"
                  >
                    {t("login")}
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
