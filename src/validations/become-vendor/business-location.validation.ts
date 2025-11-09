import { z } from "zod";

export const businessLocationValidation = z.object({
  streetAddress: z
    .string()
    .nonempty("Street Address is required")
    .min(5, "Street Address must be at least 5 characters")
    .max(100, "Street Address must be at most 100 characters"),

  streetNumber: z
    .string()
    .nonempty("Street Number is required")
    .min(1, "Street Number must be at least 1 character")
    .max(10, "Street Number must be at most 10 characters"),

  city: z
    .string()
    .nonempty("City is required")
    .min(2, "City must be at least 2 characters")
    .max(50, "City must be at most 50 characters"),

  postalCode: z
    .string()
    .nonempty("Postal Code is required")
    .min(4, "Postal Code must be at least 4 characters")
    .max(10, "Postal Code must be at most 10 characters"),
});
