"use client";

import {
  Form,
  FormControl,
  FormDescription,
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
import { cn } from "@/lib/utils";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { useTranslation } from "@/src/hooks/use-translation";
import { updateVendorReq } from "@/src/services/becomeVendor/become-vendor";
import { TBusinessCategory } from "@/src/types/category.type";
import { TCuisine } from "@/src/types/cuisine.type";
import { TVendor } from "@/src/types/vendor.type";
import { businessDetailsValidation } from "@/src/validations/become-vendor/business-details.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ArrowLeftCircle,
  BadgeInfo,
  Briefcase,
  Building2,
  CalendarX2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import WeeklyScheduleEditor from "@/src/components/Schedule/WeeklyScheduleEditor";
import type { TWeeklyDaySchedule } from "@/src/types/vendor.type";
import { readScheduleFailure } from "@/src/utils/scheduleErrors";
import {
  initialWeek,
  MAX_CLOSED_DAYS,
  normalizeWeek,
  scheduleErrorMap,
} from "@/src/utils/weeklySchedule";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { ClosingDaysInfo } from "./ClosingDaysInfo";
import { CuisineMultiSelect } from "./CuisineMultiSelect";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

interface IProps {
  onNext?: () => void;
  businessCategories: TBusinessCategory[];
  cuisines: TCuisine[];
  vendor: TVendor;
}

type BusinessForm = z.infer<ReturnType<typeof businessDetailsValidation>>;

/**
 * At most two closed days (7 Oct 2026): vendors were closing many without
 * knowing what a closing day is. Closing a third day opens a pop-up instead;
 * the schedule rules hold the same limit for anything already saved.
 */
const closedDays = (week: TWeeklyDaySchedule[]) =>
  week.filter((d) => d.periods.length === 0).length;

export default function BusinessDetailsForm({
  onNext,
  businessCategories,
  cuisines,
  vendor,
}: IProps) {
  const { t } = useTranslation();
  const [showDaysLimit, setShowDaysLimit] = useState(false);
  // Schedule errors from the last save, keyed by editor path; cleared on edit.
  const [scheduleServerErrors, setScheduleServerErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const isSubVendor = vendor?.role === "SUB_VENDOR";
  const form = useForm<BusinessForm>({
    resolver: zodResolver(businessDetailsValidation(isSubVendor)),
    defaultValues: {
      businessName: vendor?.businessDetails?.businessName || "",
      companyLegalName: vendor?.businessDetails?.companyLegalName || "",
      businessType: vendor?.businessDetails?.businessTypeSlug || "",
      restaurantCuisineType: vendor?.businessDetails?.restaurantCuisineType || [],
      NIF: vendor?.businessDetails?.NIF || "",
      branchName: vendor?.businessDetails?.branchName || "",
      // The saved week, else prefilled from the legacy hours (guide §7). A
      // store that has never set hours starts open 00:00–24:00 every day.
      weeklySchedule: initialWeek(vendor?.businessDetails),
    },
  });

  const { formState: { isSubmitting } } = form;

  const businessType = useWatch({
    control: form.control,
    name: "businessType",
  });

  const week = useWatch({ control: form.control, name: "weeklySchedule" });
  // Live rule errors, shown on the shift they belong to; the server's on top
  // until the next edit.
  const scheduleErrors = useMemo(
    () => ({ ...scheduleServerErrors, ...scheduleErrorMap(week ?? []) }),
    [week, scheduleServerErrors],
  );

  const onSubmit = async (data: BusinessForm) => {
    const toastId = toast.loading("Updating...");

    // ALWAYS convert names → slugs before sending
    const cuisineSlugs =
      data.businessType === "restaurant" && Array.isArray(data.restaurantCuisineType)
        ? data.restaurantCuisineType
          .map((item) => {
            const found = cuisines?.find(
              (c) =>
                c.slug === item ||
                c.name.toLowerCase() === item.toLowerCase()
            );
            return found?.slug;
          })
          .filter(Boolean) as string[]
        : [];

    // remove possible duplicates
    const uniqueCuisineSlugs = [...new Set(cuisineSlugs)];

    let businessDetailsPayload: Record<string, unknown>;

    if (isSubVendor) {
      businessDetailsPayload = {
        businessDetails: {
          branchName: data?.branchName,
          // Only the weekly schedule, never the legacy hours with it (guide §5:
          // mixing is a 400; legacy changes on a scheduled store are a 409).
          weeklySchedule: normalizeWeek(data.weeklySchedule),
          // A branch serves what it serves. The cuisine is cloned from the
          // parent when the branch is created, but a branch can differ from it,
          // so this is editable here and has to be sent — it used to be
          // computed above and then dropped, which left the multi-select
          // accepting changes that were silently discarded on save.
          //
          // Only for a restaurant: a store has no cuisine, and sending an empty
          // array for one would be a write that means nothing. `PATCH
          // /vendors/:subVendorId` accepts the field either way.
          ...(data.businessType === "restaurant"
            ? { restaurantCuisineType: uniqueCuisineSlugs }
            : {}),
        },
      };
    } else {
      const { restaurantCuisineType, ...restOfData } = data;

      const processedData =
        data.businessType === "store"
          ? restOfData
          : { ...restOfData, restaurantCuisineType: uniqueCuisineSlugs };

      businessDetailsPayload = {
        businessDetails: {
          ...processedData,
          weeklySchedule: normalizeWeek(data.weeklySchedule),
          businessType: data.businessType,
          NIF: data.NIF.toUpperCase(),
        },
      };
    }

    const result = await updateVendorReq(vendor?.userId, businessDetailsPayload);

    if (result && result?.success) {
      toast.success(result?.message || "Business details updated successfully!", { id: toastId });

      if (isSubVendor) {
        onNext?.();
        return;
      } else {
        router.push("/become-vendor/business-location");
        return;
      }
    }

    // Schedule field errors go on their shift; a schedule errorKey (locked
    // profile, 409) gets our translated copy.
    const scheduleFailure = readScheduleFailure(result, t);
    if (Object.keys(scheduleFailure.fieldErrors).length) {
      setScheduleServerErrors(scheduleFailure.fieldErrors);
    }
    if (scheduleFailure.errorKey && (scheduleFailure.locked || scheduleFailure.reload)) {
      toast.error(scheduleFailure.summary ?? t("schedule_err_generic"), { id: toastId });
      return;
    }

    if (result?.data?.errorSources) {
      result?.data?.errorSources?.map((err: { path: string, message: string }) => (
        toast.error(err?.message, { id: toastId })
      ));
      return;
    } else {
      toast.error(result.message || "Business details update failed", {
        id: toastId,
      });
    }
    console.log(result);
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-linear-to-br from-pink-50 via-white to-pink-100 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Card className="w-full max-w-2xl p-6 shadow-2xl border-t-4 border-[#DC3173] bg-white rounded-2xl relative">
        {!isSubVendor && <div className="absolute top-3 left-0">
          <Button
            onClick={() => router.push("/become-vendor/personal-details")}
            variant="link"
            className="inline-flex items-center px-4 text-sm gap-2 text-[#DC3173] p-0 h-4 cursor-pointer"
          >
            <ArrowLeftCircle /> {t("goBack")}
          </Button>
        </div>}

        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-[#DC3173] mt-2">
            {t("businessDetails")}
          </CardTitle>
          <p className="text-center text-gray-500 mt-1 text-sm">
            {t("businessDetailsDesc")}
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* ========== Section 1: Basic Info ========== */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                  {t("basicInformation")}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {/* Business Name */}
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-2 block text-sm font-medium text-gray-700">
                          {t("businessName")}{" "} <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3.5 text-[#DC3173]" />
                          <FormControl>
                            <Input
                              placeholder="Business Name"
                              className="pl-10 h-12 border-gray-300 focus-visible:ring-2 focus-visible:ring-[#DC3173]/60"
                              disabled={!!isSubVendor}
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Business Name */}
                  <FormField
                    control={form.control}
                    name="companyLegalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-2 block text-sm font-medium text-gray-700">
                          {t("company_legal_name")}{" "} {!isSubVendor && <span className="text-red-500">*</span>}
                        </FormLabel>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3.5 text-[#DC3173]" />
                          <FormControl>
                            <Input
                              placeholder={t("company_legal_name")}
                              className="pl-10 h-12 border-gray-300 focus-visible:ring-2 focus-visible:ring-[#DC3173]/60"
                              disabled={!!isSubVendor}
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormDescription>
                          {t("company_legal_name_description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Business Type – uses slug */}
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="mb-2 block text-sm font-medium text-gray-700">
                          {t("businessType")}{" "} <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-3.5 text-[#DC3173]/80" />
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={!!isSubVendor}
                            >
                              <SelectTrigger
                                className={cn(
                                  "pl-11 pr-4 h-12 w-full bg-white/90 text-gray-700 shadow-sm focus-visible:ring-2 focus-visible:ring-[#DC3173]/70 hover:shadow-md transition-all cursor-pointer",
                                  fieldState.invalid
                                    ? "border-destructive focus-visible:ring-destructive/20"
                                    : "border-gray-300"
                                )}
                                style={{ height: "3rem" }}
                              >
                                <SelectValue placeholder={t("select_business_type")} />
                              </SelectTrigger>
                              <SelectContent>
                                {businessCategories.map((category) => (
                                  <SelectItem
                                    key={category?._id}
                                    value={category?.slug}
                                    className="capitalize"
                                  >
                                    {category?.name}
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

                  {/* NIF – changed to type="text" */}
                  <FormField
                    control={form.control}
                    name="NIF"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-2 block text-sm font-medium text-gray-700">
                          {t("nif")} <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="relative">
                          <BadgeInfo className="absolute left-3 top-3.5 text-[#DC3173]" />
                          <FormControl>
                            <Input
                              placeholder="NIF"
                              type="text"
                              className="pl-10 h-12 border-gray-300 focus-visible:ring-2 focus-visible:ring-[#DC3173]/60 uppercase"
                              {...field}
                              disabled={!!isSubVendor}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isSubVendor && <FormField
                    control={form.control}
                    name="branchName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-2 block text-sm font-medium text-gray-700">
                          {t("branch_name")}{" "} <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3.5 text-[#DC3173]" />
                          <FormControl>
                            <Input
                              placeholder={t("branch_name")}
                              className="pl-10 h-12 border-gray-300 focus-visible:ring-2 focus-visible:ring-[#DC3173]/60"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />}
                </div>

                {/* Cuisine – only for restaurant */}
                {businessType === "restaurant" && (
                  <FormField
                    control={form.control}
                    name="restaurantCuisineType"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="mb-2 block text-sm font-medium text-gray-700 mt-5">
                          {t("restaurantCuisineType")}{" "} <span className="text-red-500">*</span>
                        </FormLabel>

                        <FormControl>
                          <CuisineMultiSelect
                            value={Array.isArray(field.value) ? field.value : []}
                            onChange={field.onChange}
                            cuisines={cuisines || []}
                            invalid={fieldState.invalid}
                            placeholder={t("select_multiple_cuisine")}
                            t={t}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* ========== Section 2: Working Hours ========== */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                  {t("workingHours")}
                </h3>

                <p className="-mt-1 mb-4 flex items-center gap-2 text-sm text-gray-500">
                  {t("schedule_page_subtitle")}
                  <ClosingDaysInfo />
                </p>

                <FormField
                  control={form.control}
                  name="weeklySchedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <WeeklyScheduleEditor
                          value={field.value ?? []}
                          onChange={(next) => {
                            // A third closed day: say why, instead of an error.
                            if (
                              closedDays(next) > MAX_CLOSED_DAYS &&
                              closedDays(next) > closedDays(field.value ?? [])
                            ) {
                              setShowDaysLimit(true);
                              return;
                            }
                            setScheduleServerErrors({});
                            field.onChange(next);
                          }}
                          errors={scheduleErrors}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full h-12 bg-[#DC3173] hover:bg-[#b12b61] text-white text-lg font-semibold shadow-md hover:shadow-lg transition-all ${isSubmitting ? "cursor-not-allowed opacity-70" : ""
                    }`}
                >
                  {t("saveContinue")}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* A third closing day: say why it can't be added. */}
      <Dialog open={showDaysLimit} onOpenChange={setShowDaysLimit}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-md gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl"
        >
          <div className="h-1.5 bg-linear-to-r from-[#DC3173] to-[#FF6CAB]" />
          <div className="flex flex-col items-center px-6 pt-7 pb-6 text-center sm:px-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DC3173]/10 ring-8 ring-[#DC3173]/5">
              <CalendarX2 className="h-7 w-7 text-[#DC3173]" />
            </div>
            <DialogTitle className="mt-5 text-lg font-bold text-slate-900">
              {t("closing_days_limit_title")}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-relaxed text-slate-600">
              {t("closing_days_limit_body")}
            </DialogDescription>
          </div>
          <DialogFooter className="border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:justify-center sm:px-8">
            <Button
              type="button"
              onClick={() => setShowDaysLimit(false)}
              className="h-11 w-full bg-[#DC3173] font-semibold text-white shadow-md shadow-[#DC3173]/25 hover:bg-[#c22b65] sm:w-auto sm:min-w-40"
            >
              {t("closing_days_limit_ok")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}