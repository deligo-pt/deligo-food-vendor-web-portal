import { z } from "zod";
import { weeklyScheduleSchema } from "@/src/validations/schedule/weekly-schedule.validation";

export const businessDetailsValidation = (isSubVendor = false) =>
  z
    .object({
      businessName: z
        .string()
        .min(2, "Business name must be at least 2 characters long")
        .max(50, "Business name must be at most 50 characters long")
        .nonempty("Business name is required"),

      companyLegalName: isSubVendor ? z.string().optional() :
        z
          .string()
          .min(2, "Company legal name must be at least 2 characters long")
          .max(50, "Company legal name must be at most 50 characters long")
          .nonempty("Company legal name is required"),

      businessType: z
        .string()
        .min(2, "Business type must be at least 2 characters long")
        .max(50, "Business type must be at most 50 characters long")
        .nonempty("Business type is required"),

      restaurantCuisineType: z.array(z.string()).optional(),

      NIF: z
        .string()
        .min(2, "NIF must be at least 2 characters long")
        .max(50, "NIF must be at most 50 characters long")
        .nonempty("NIF is required"),

      // branchName is required only for SUB_VENDOR
      branchName: isSubVendor
        ? z
          .string()
          .min(2, "Branch name must be at least 2 characters long")
          .max(50, "Branch name must be at most 50 characters long")
          .nonempty("Branch name is required")
        : z.string().optional(),

      // The week, Monday first, as the editor holds it
      // (FRONTEND_VENDOR_SCHEDULE_GUIDE). Replaces openingHours / closingHours
      // / closingDays: those are a read-only summary once a schedule exists,
      // and changing them answers 409. The schema carries every rule — the
      // backend's, plus the panel's at-least-6-hours-a-day and at-most-2-closed-
      // days (agreed 10 Nov 2026) — with translation keys as messages.
      weeklySchedule: weeklyScheduleSchema,
    })
    .superRefine((data, ctx) => {
      // Use slug instead of localized name
      if (data.businessType === "restaurant") {
        if (
          !data.restaurantCuisineType ||
          !Array.isArray(data.restaurantCuisineType) ||
          data.restaurantCuisineType.length === 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["restaurantCuisineType"],
            message: "Restaurant cuisine type is required",
          });
        }
      }
    });