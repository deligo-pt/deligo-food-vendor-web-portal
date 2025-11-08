"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { CreditCard, User, FileText, Globe, Save } from "lucide-react";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/src/components/ui/input";

type FormValues = {
  bankName: string;
  accountHolderName: string;
  iban: string;
  swiftCode: string;
};

export default function BankDetailsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      bankName: "",
      accountHolderName: "",
      iban: "",
      swiftCode: "",
    },
  });
 const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    console.log("bank details ->", data);
    await new Promise((r) => setTimeout(r, 700));
    router.push("/become-vendor/document-image-details");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <Card className="rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-[#DC3173] to-pink-600 text-white p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/25 p-3 shadow-md">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold tracking-wide">
                Bank Details
              </CardTitle>
            </div>
            <p className="mt-3 text-sm text-white/90 max-w-xl leading-relaxed">
              Add your bank details so we can pay you. Your data is encrypted and stored securely.
            </p>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 bg-white">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <CreditCard className="w-4 h-4 text-[#DC3173]" /> Bank Name
                  </Label>
                  <Input
                    placeholder="e.g. Santander Bank"
                    {...register("bankName", { required: "Bank name is required" })}
                    aria-invalid={!!errors.bankName}
                    className={cn("mt-2 w-full", errors.bankName && "border-red-500")}
                  />
                  {errors.bankName && <p className="mt-1 text-xs text-red-600">{errors.bankName.message}</p>}
                </div>

                <div className="col-span-1">
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4 text-[#DC3173]" /> Account Holder
                  </Label>
                  <Input
                    placeholder="Full name as on account"
                    {...register("accountHolderName", { required: "Account holder name is required" })}
                    aria-invalid={!!errors.accountHolderName}
                    className={cn("mt-2 w-full", errors.accountHolderName && "border-red-500")}
                  />
                  {errors.accountHolderName && <p className="mt-1 text-xs text-red-600">{errors.accountHolderName.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4 text-[#DC3173]" /> IBAN
                  </Label>
                  <Input
                    placeholder="e.g. GB29NWBK60161331926819"
                    {...register("iban", { required: "IBAN is required" })}
                    aria-invalid={!!errors.iban}
                    className={cn("mt-2 w-full uppercase", errors.iban && "border-red-500")}
                    onChange={(e) => setValue("iban", e.target.value.toUpperCase())}
                  />
                  {errors.iban && <p className="mt-1 text-xs text-red-600">{errors.iban.message}</p>}
                </div>

                <div className="col-span-1">
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Globe className="w-4 h-4 text-[#DC3173]" /> SWIFT / BIC
                  </Label>
                  <Input
                    placeholder="e.g. NWBKGB2L"
                    {...register("swiftCode", { required: "SWIFT code is required" })}
                    aria-invalid={!!errors.swiftCode}
                    className={cn("mt-2 w-full uppercase", errors.swiftCode && "border-red-500")}
                    onChange={(e) => setValue("swiftCode", e.target.value.toUpperCase())}
                  />
                  {errors.swiftCode && <p className="mt-1 text-xs text-red-600">{errors.swiftCode.message}</p>}
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center gap-3 justify-center px-8 py-3 bg-[#DC3173] hover:bg-[#b72a63] text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
                >
                  <Save className="w-5 h-5" />
                  <span className="font-semibold tracking-wide">Save & Continue</span>
                </motion.button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
