// VendorLoginPage.tsx
"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { useTranslation } from "@/src/hooks/use-translation";
import { loginReq } from "@/src/services/auth/auth";
import { setCookie } from "@/src/utils/cookies";
import { getAndSaveFcmToken } from "@/src/utils/fcmToken";
import { loginValidation } from "@/src/validations/auth/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormData = {
  email: string;
  password: string;
};

export default function LoginForm({ redirect }: { redirect?: string }) {
  const { t } = useTranslation();

  const form = useForm<FormData>({
    resolver: zodResolver(loginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading("Logging in...");

    const result = await loginReq(data);

    if (result?.success) {
      const decoded = jwtDecode(result.data.accessToken) as {
        role: string;
        status: string;
      };
      if (decoded.role === "VENDOR") {
        setCookie("accessToken", result.data.accessToken, 7);
        setCookie("refreshToken", result.data.refreshToken, 365);
        toast.success(result?.message || "Login successful!", {
          id: toastId,
        });

        // get and save fcm token
        setTimeout(() => {
          getAndSaveFcmToken(result.data.accessToken);
        }, 1000);

        switch (decoded.status) {
          case "PENDING":
          case "SUBMITTED":
          case "REJECTED":
            router.push("/become-vendor/registration-status");
            return;
          case "APPROVED":
            if (redirect) {
              router.push(redirect);
              return;
            }
            router.push("/vendor/dashboard");
            return;
        }
        return;
      }
      toast.error("You are not a vendor", { id: toastId });
      return;
    }

    toast.error(result.message || "Login failed", { id: toastId });
    console.log(result);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#FF7EB3]/20 to-[#DC3173]/20 p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-10"
      >
        <h1 className="text-4xl font-extrabold text-white text-center mb-8">
          {t("loginTitle")}
        </h1>
        <p className="text-gray-300 text-center mb-8">{t("loginDesc")}</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 font-medium mb-1 block">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="yourname@deligo.pt"
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-transparent text-white placeholder:text-gray-400 placeholder:text-base focus:border-[#DC3173]! focus:ring-0 focus:ring-transparent! focus:outline-none transition h-12"
                      {...field}
                    />
                  </FormControl>
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
                  <FormLabel className="text-gray-300 font-medium mb-1 block">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-transparent text-white placeholder:text-gray-400 placeholder:text-base focus:border-[#DC3173]! focus:ring-0 focus:ring-[#DC3173]/10! focus:outline-none transition h-12 pr-12"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 flex items-center justify-center h-full text-gray-400 hover:text-pink-400 transition"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-linear-to-r from-[#FF7EB3] to-[#DC3173] text-white font-bold text-lg hover:scale-105 hover:shadow-lg transition"
            >
              {t("loginCTA")}
            </button>
          </form>
        </Form>

        {/* Forgot Password */}
        <p className="text-gray-400 text-center mt-4">
          {t("loginForgotTitle")}{" "}
          <Link
            href="/forgot-password"
            className="text-pink-400 font-medium hover:underline"
          >
            {t("loginResetHere")}
          </Link>
        </p>

        {/* Signup CTA */}
        <p className="text-gray-400 text-center mt-6">
          {t("loginNewToDeligo")}{" "}
          <Link
            href="/become-vendor"
            className="text-pink-400 font-medium hover:underline"
          >
            {t("loginCreateAcc")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
