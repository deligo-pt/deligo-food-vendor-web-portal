import { z } from "zod";

export const descriptionGeneratorValidation = z.object({
  productName: z
    .string()
    .min(2, "Name must be at least 2 character")
    .max(50, "Name must be at most 50 characters")
    .nonempty("Name is required"),

  // An id from the list; see `product.validation.ts`.
  productCategory: z.string().trim().min(1, "product_err_category_required"),

  language: z.enum(
    ["English", "Portuguese"],
    "Language must be either English or Portuguese",
  ),

  productImageUrl: z.url("Image is required"),
});
