import { z } from "zod";

export const productValidation = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 character")
      .max(50, "Name must be at most 50 characters")
      .nonempty("Name is required"),

    description: z
      .string()
      .min(1, "Description is required")
      .max(500, "Description must be at most 500 characters")
      .nonempty("Description is required"),

    category: z
      .string()
      .min(2, "Category must be at least 2 characters")
      .max(50, "Category must be at most 50 characters")
      .nonempty("Category is required"),

    brand: z
      .string()
      .min(2, "Brand must be at least 2 character")
      .max(50, "Brand must be at most 50 characters")
      .nonempty("Brand is required"),

    price: z.number().optional(),

    taxId: z.string().nonempty("Tax is required"),

    discount: z.number().min(0).max(100),

    quantity: z.number().optional(),

    unit: z.string().min(1, "Unit must be at least 1 character"),

    availabilityStatus: z
      .string()
      .min(2, "Availability status must be at least 2 characters")
      .max(50, "Availability status must be at most 50 characters")
      .nonempty("Availability status is required"),

    tags: z.array(z.string()),

    addonGroups: z.array(z.string()),

    variations: z.array(
      z.object({
        name: z.string(),
        options: z.array(
          z.object({
            label: z.string(),
            price: z.number().min(0),
            stockQuantity: z.number().min(0),
          }),
        ),
      }),
    ),

    organic: z.boolean().optional(),

    weight: z.number().min(0, "Weight must be at least 0").optional(),

    packagingType: z
      .string()
      .min(2, "Packaging type must be at least 2 characters")
      .max(50, "Packaging type must be at most 50 characters")
      .optional(),

    storageTemperature: z
      .string()
      .min(2, "Storage temperature must be at least 2 characters")
      .max(50, "Storage temperature must be at most 50 characters")
      .optional(),

    isFeatured: z.boolean().optional(),

    isAvailableForPreOrder: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.variations.length === 0 && !data.price) {
        return false;
      }
      return true;
    },
    {
      message: "Price is required",
      path: ["price"],
    },
  )
  .refine(
    (data) => {
      if (data.variations.length === 0 && data.price && data.price < 0) {
        return false;
      }
      return true;
    },
    {
      message: "Price cannot be negative",
      path: ["price"],
    },
  )
  .refine(
    (data) => {
      if (data.variations.length === 0 && !data.quantity) {
        return false;
      }
      return true;
    },
    {
      message: "Quantity is required",
      path: ["quantity"],
    },
  )
  .refine(
    (data) => {
      if (data.variations.length === 0 && data.quantity && data.quantity < 0) {
        return false;
      }
      return true;
    },
    {
      message: "Quantity cannot be negative",
      path: ["quantity"],
    },
  );
