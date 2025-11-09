import { z } from "zod";

export const bankDetailsValidation = z.object({
  bankName: z
    .string()
    .min(2, "Bank name must be at least 2 characters")
    .max(50, "Bank name must be at most 50 characters")
    .nonempty("Bank name is required"),

  accountHolderName: z
    .string()
    .min(2, "Account holder name must be at least 2 characters")
    .max(100, "Account holder name must be at most 100 characters")
    .nonempty("Account holder name is required"),

  iban: z
    .string()
    .min(15, "IBAN must be at least 15 characters")
    .max(34, "IBAN must be at most 34 characters"),

  swiftCode: z
    .string()
    .min(8, "SWIFT code must be at least 8 characters")
    .max(11, "SWIFT code must be at most 11 characters"),
});
