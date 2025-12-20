"use client";

import { motion } from "framer-motion";
import {
  ArrowLeftCircle,
  CreditCard,
  FileText,
  Globe,
  Save,
  User,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { TResponse } from "@/src/types";
import { getCookie } from "@/src/utils/cookies";
import { fetchData, updateData } from "@/src/utils/requests";
import { bankDetailsValidation } from "@/src/validations/become-vendor/bank-details.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

type FormValues = {
  bankName: string;
  accountHolderName: string;
  iban: string;
  swiftCode: string;
};

export default function BankDetailsPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(bankDetailsValidation),
    defaultValues: {
      bankName: "",
      accountHolderName: "",
      iban: "",
      swiftCode: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    const toastId = toast.loading("Updating...");
    try {
      const accessToken = getCookie("accessToken");
      const decoded = jwtDecode(accessToken || "") as { id: string };

      const bankDetails = {
        bankDetails: data,
      };

      const result = (await updateData(
        "/vendors/" + decoded?.id,
        bankDetails,
        {
          headers: { authorization: accessToken },
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      )) as unknown as TResponse<any>;

      if (result.success) {
        toast.success("Bank details updated successfully!", {
          id: toastId,
        });
        router.push("/become-vendor/document-image-details");
        return;
      }
      toast.error(result.message, { id: toastId });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Bank details update failed",
        { id: toastId }
      );
      console.log(error);
    }
    await new Promise((r) => setTimeout(r, 700));
  };

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

              form.setValue("bankName", data.bankDetails.bankName || "");
              form.setValue(
                "accountHolderName",
                data.bankDetails.accountHolderName || ""
              );
              form.setValue("iban", data.bankDetails.iban || "");
              form.setValue("swiftCode", data.bankDetails.swiftCode || "");
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="min-h-screen bg-linear-to-b from-white via-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <Card className="rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="relative p-0">
            <Button
              onClick={() => router.push("/become-vendor/business-location")}
              variant="link"
              className="inline-flex items-center px-4 text-sm gap-2 text-[#DC3173] p-0 h-4 absolute -top-2 z-10 cursor-pointer"
            >
              <ArrowLeftCircle /> Go Back
            </Button>
          </div>
          <CardHeader className="bg-linear-to-r from-[#DC3173] to-pink-600 text-white p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/25 p-3 shadow-md">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold tracking-wide">
                Bank Details
              </CardTitle>
            </div>
            <p className="mt-3 text-sm text-white/90 max-w-xl leading-relaxed">
              Add your bank details so we can pay you. Your data is encrypted
              and stored securely.
            </p>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 bg-white">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <div className="relative">
                            <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <CreditCard className="w-4 h-4 text-[#DC3173]" />{" "}
                              Bank Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Santander Bank"
                                className="mt-2 w-full"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="accountHolderName"
                      render={({ field }) => (
                        <FormItem>
                          <div className="relative">
                            <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <User className="w-4 h-4 text-[#DC3173]" />{" "}
                              Account Holder
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Full name as on account"
                                className="mt-2 w-full"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="iban"
                      render={({ field }) => (
                        <FormItem>
                          <div className="relative">
                            <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <FileText className="w-4 h-4 text-[#DC3173]" />{" "}
                              IBAN
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. GB29NWBK60161331926819"
                                className="mt-2 w-full uppercase"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="swiftCode"
                      render={({ field }) => (
                        <FormItem>
                          <div className="relative">
                            <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <Globe className="w-4 h-4 text-[#DC3173]" /> SWIFT
                              / BIC
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. NWBKGB2L"
                                className="mt-2 w-full uppercase"
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

                <div className="pt-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={form.formState.isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center gap-3 justify-center px-8 py-3 bg-[#DC3173] hover:bg-[#b72a63] text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
                  >
                    <Save className="w-5 h-5" />
                    <span className="font-semibold tracking-wide">
                      Save & Continue
                    </span>
                  </motion.button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
