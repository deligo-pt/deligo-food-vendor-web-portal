import { z } from "zod";

export const businessDetailsValidation = (isSubVendor = false) =>
  z
    .object({
      businessName: z
        .string()
        .min(2, "Business name must be at least 2 characters long")
        .max(50, "Business name must be at most 50 characters long")
        .nonempty("Business name is required"),

      companyLegalName: z
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

      totalBranches: z
        .string()
        .nonempty("Number of branches is required")
        .refine(
          (val) => !isNaN(parseInt(val)),
          "Number of branches must be a number",
        ),

      openingHours: z.string().nonempty("Opening hours is required"),

      closingHours: z.string().nonempty("Closing hours is required"),

      closingDays: z
        .array(z.string())
        .max(7, "Closing days must be at most 7")
        .optional(),
    })
    .refine(
      (data) => {
        const [openH, openM] = data.openingHours.split(":").map(Number);
        const [closeH, closeM] = data.closingHours.split(":").map(Number);

        const openTotal = openH * 60 + openM;
        const closeTotal = closeH * 60 + closeM;

        let diff = (closeTotal - openTotal) / 60;
        if (diff < 0) diff += 24;

        return diff >= 6;
      },
      {
        message: "Business must be open at least 6 hours",
        path: ["closingHours"],
      },
    )
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