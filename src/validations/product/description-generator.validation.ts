import { z } from "zod";

export const descriptionGeneratorValidation = z.object({
  productName: z
    .string()
    .min(2, "Name must be at least 2 character")
    .max(50, "Name must be at most 50 characters")
    .nonempty("Name is required"),

  productCategory: z
    .string()
    .min(2, "Category must be at least 2 characters")
    .max(50, "Category must be at most 50 characters")
    .nonempty("Category is required"),

  language: z.enum(
    ["English", "Portuguese"],
    "Language must be either English or Portuguese",
  ),

  productImageUrl: z.url("Image is required"),
});
