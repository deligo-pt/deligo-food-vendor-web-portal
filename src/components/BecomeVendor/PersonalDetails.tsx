"use client";

import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { useTranslation } from "@/src/hooks/use-translation";
import {} from "@/src/services/auth/auth";
import { updateVendorReq } from "@/src/services/becomeVendor/become-vendor";
import { TVendor } from "@/src/types/vendor.type";
import { personalDetailsValidation } from "@/src/validations/become-vendor/personal-details.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import parsePhoneNumberFromString from "libphonenumber-js";
import { ArrowLeftCircle, Mail, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { toast } from "sonner";

type PersonalForm = {
  firstName: string;
  lastName: string;
  email: string;
  prefixPhoneNumber: string;
  phoneNumber: string;
};

export default function PersonalDetails({ vendor }: { vendor: TVendor }) {
  const phone = parsePhoneNumberFromString(vendor.contactNumber || "");

  const { t } = useTranslation();
  const form = useForm<PersonalForm>({
    resolver: zodResolver(personalDetailsValidation),
    defaultValues: {
      firstName: vendor?.name?.firstName || "",
      lastName: vendor?.name?.lastName || "",
      email: vendor?.email || "",
      prefixPhoneNumber: phone?.countryCallingCode
        ? `+${phone?.countryCallingCode}`
        : "+351",
      phoneNumber: phone?.nationalNumber || "",
    },
  });
  const router = useRouter();

  const onSubmit = async (data: PersonalForm) => {
    const toastId = toast.loading("Updating...");

    const personalDetails = {
      name: { firstName: data.firstName, lastName: data.lastName },
      contactNumber: data.phoneNumber,
    };

    const result = await updateVendorReq(vendor.userId, personalDetails);

    if (result.success) {
      toast.success("Personal details updated successfully!", {
        id: toastId,
      });

      router.push("/become-vendor/business-details");
      return;
    }

    toast.error(result.message || "Personal details update failed", {
      id: toastId,
    });
    console.log(result);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-xl border border-white/60 backdrop-blur-xl bg-white/80 rounded-2xl p-6 relative">
          <div className="absolute top-3 left-0">
            <Button
              onClick={() => router.push("/")}
              variant="link"
              className="inline-flex items-center px-4 text-sm gap-2 text-[#DC3173] p-0 h-4 cursor-pointer"
            >
              <ArrowLeftCircle /> {t("goHome")}
            </Button>
          </div>
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
              {t("personalDetails")}
            </CardTitle>
            <p className="text-gray-500 text-sm">{t("personalDetailsDesc")}</p>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* First Name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <FormLabel className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <User className="text-gray-400 w-5 h-5" />
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="First Name"
                            className="pl-10 py-3 text-base focus-visible:ring-2 focus-visible:ring-[#DC3173] focus:border-[#DC3173] transition-all duration-300 rounded-xl"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Name */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <FormLabel className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <User className="text-gray-400 w-5 h-5" />
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Last Name"
                            className="pl-10 py-3 text-base focus-visible:ring-2 focus-visible:ring-[#DC3173] focus:border-[#DC3173] transition-all duration-300 rounded-xl"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <FormLabel className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <Mail className="text-gray-400 w-5 h-5" />
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Email Address"
                            className="pl-10 py-3 text-base focus-visible:ring-2 focus-visible:ring-[#DC3173] focus:border-[#DC3173] transition-all duration-300 rounded-xl"
                            {...field}
                            disabled
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 top-0 flex items-center pointer-events-none h-9">
                    <Phone className="text-gray-400 w-5 h-5" />
                  </div>
                  <FormField
                    control={form.control}
                    name="prefixPhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="absolute left-9 z-10">
                            <PhoneInput
                              {...field}
                              defaultCountry="pt"
                              countrySelectorStyleProps={{
                                buttonStyle: {
                                  border: "none",
                                  height: "36px",
                                  backgroundColor: "transparent",
                                },
                              }}
                              inputStyle={{
                                marginTop: "1px",
                                border: "none",
                                height: "34px",
                                width: "48px",
                                borderRadius: "0px",
                                backgroundColor: "#ccc",
                                zIndex: "-99",
                                position: "relative",
                              }}
                              inputProps={{
                                placeholder: "Phone Number",
                                disabled: true,
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="tel"
                            className="pl-32 py-3 text-base focus-visible:ring-2 focus-visible:ring-[#DC3173] focus:border-[#DC3173] transition-all duration-300 rounded-xl w-full"
                            {...field}
                            onChange={(e) => {
                              const onlyDigits = e.target.value.replace(
                                /\D/g,
                                ""
                              );
                              field.onChange(onlyDigits);
                            }}
                          />
                        </FormControl>
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
                    className="w-full font-semibold py-3 rounded-xl bg-linear-to-r from-[#DC3173] to-[#a72b5c] text-white shadow-lg shadow-pink-200 hover:brightness-110 transition-all duration-300"
                  >
                    {t("saveContinue")}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
