import { z } from "zod";

export const businessDetailsValidation = z
  .object({
    businessName: z
      .string()
      .min(2, "Business name must be at least 2 characters long")
      .max(50, "Business name must be at most 50 characters long")
      .nonempty("Business name is required"),

    businessType: z
      .string()
      .min(2, "Business type must be at least 2 characters long")
      .max(50, "Business type must be at most 50 characters long")
      .nonempty("Business type is required"),

    businessLicenseNumber: z
      .string()
      .min(2, "Business license number must be at least 2 characters long")
      .max(50, "Business license number must be at most 50 characters long")
      .nonempty("Business license number is required"),

    NIF: z
      .string()
      .min(2, "NIF must be at least 2 characters long")
      .max(50, "NIF must be at most 50 characters long")
      .nonempty("NIF is required"),

    branches: z
      .string()
      .nonempty("Number of branches is required")
      .refine(
        (val) => !isNaN(parseInt(val)),
        "Number of branches must be a number"
      ),

    openingHours: z.string().nonempty("Opening hours is required"),

    closingHours: z.string().nonempty("Closing hours is required"),

    closingDays: z
      .array(z.string())
      .min(1, "At least one closing day is required")
      .max(7, "Closing days must be at most 7")
      .nonempty("Closing days is required"),
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
    }
  );
