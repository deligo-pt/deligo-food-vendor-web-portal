import { validateLocalizedField } from "@/src/consts/validation.const";
import { z } from "zod";

const localizedTextSchema = z.object({
  en: z.string().optional(),
  pt: z.string().optional(),
});

export const productValidation = z.object({
  name: localizedTextSchema,

  description: localizedTextSchema,

  // The category's id, picked from the list, so only "was one picked" is
  // checked. The old min-length check ran first and told a vendor who had
  // picked nothing that the category must be at least 2 characters. Messages
  // are translation keys; `FormMessage` translates them.
  category: z.string().trim().min(1, "product_err_category_required"),

  additionalCategories: z.array(z.string().optional()).optional(),

  images: z
    .array(
      z
        .url("Each image must be a valid URL")
        .nonempty("Image URL is required"),
    )
    // No minimum: leaving this empty is allowed, and the form fills the slot
    // with `DEFAULT_PRODUCT_IMAGE` on save. A minimum here would block the
    // vendor at validation before that could ever happen.
    .max(1, "Only one image is allowed"),

  // `null` is an emptied price box (see PricingForm); the refine below turns
  // it into "Price is required".
  price: z.number().nullable().optional(),

  discountType: z.enum(["PERCENTAGE", "FLAT"]),

  taxId: z.string().nonempty("product_err_tax_required"),

  // Optional: an emptied box means no discount (saved as 0). The upper limit
  // depends on the type and is checked below — `.max(100)` capped a FLAT
  // discount at €100 and let it exceed the price, which priced Test Burgers 20
  // at −€1 and made it impossible to check out.
  discount: z.number().min(0, "Discount cannot be negative").optional(),

  quantity: z.number().optional(),

  unit: z.string().optional(),

  availabilityStatus: z.string().optional(),

  addonGroups: z.array(z.string()),

  variations: z.array(
    z.object({
      name: localizedTextSchema,
      options: z.array(
        z.object({
          label: localizedTextSchema,
          // 0 is a valid option price (a free size); the API takes it.
          price: z.number("Price is required").min(0, "Price cannot be negative"),
          stockQuantity: z.number().optional(),
        }),
      ),
    }),
  ),

  isFeatured: z.boolean().optional(),

  /** SDR container deposit — sent as `sdr: { applicable }`. */
  sdrApplicable: z.boolean().optional(),

  isAvailableForPreOrder: z.boolean().optional(),

  isActive: z.boolean().optional(),

  businessTypeSlug: z.string(),
  currentLang: z.enum(["en", "pt"]),
})
  .superRefine((data, ctx) => {
    validateLocalizedField(
      data.name,
      data.currentLang,
      ctx,
      ["name"],
      "Name is required"
    );

    // validateLocalizedField(
    //   data.description,
    //   data.currentLang,
    //   ctx,
    //   ["description"],
    //   "Description is required"
    // );

    // Discount limits, per type. A FLAT discount is in euros and must not
    // exceed the price it comes off — with variations, the cheapest option,
    // since the discount applies to every option.
    const discount = data.discount ?? 0;
    if (data.discountType === "PERCENTAGE" && discount > 100) {
      ctx.addIssue({
        code: "custom",
        path: ["discount"],
        message: "Percentage discount cannot exceed 100%.",
      });
    }
    if (data.discountType === "FLAT" && discount > 0) {
      const optionPrices = data.variations.flatMap((v) => v.options.map((o) => o.price));
      const ceiling = optionPrices.length > 0 ? Math.min(...optionPrices) : data.price;
      if (ceiling != null && discount > ceiling) {
        ctx.addIssue({
          code: "custom",
          path: ["discount"],
          message: "Flat discount cannot exceed the product price.",
        });
      }
    }
  })
  .refine(
    (data) => {
      // Only an empty price is missing: 0 is a real one (17 Oct 2026). A bare
      // `!data.price` refused it as "required". Negative cannot be typed —
      // `PriceInput` takes digits and one separator only.
      if (data.variations.length === 0 && data.price == null) {
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
      if (
        data.businessTypeSlug !== "restaurant" &&
        data.variations.length === 0 &&
        !data.quantity
      ) {
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
      if (
        data.businessTypeSlug !== "restaurant" &&
        data.variations.length === 0 &&
        data.quantity &&
        data.quantity < 0
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Quantity cannot be negative",
      path: ["quantity"],
    },
  );

export const variationOptionValidation = z.object({
  label: localizedTextSchema,
  price: z.number("Price is required").gt(0, "Price must be greater than 0"),
  stockQuantity: z.number().min(0, "Stock quantity must be at least 0"),
});

export const variationValidation = z.object({
  name: localizedTextSchema,
  options: z
    .array(variationOptionValidation)
    .min(1, "At least one option is required"),

  currentLang: z.enum(["en", "pt"]),

}).superRefine((data, ctx) => {
  validateLocalizedField(
    data.name,
    data.currentLang,
    ctx,
    ["name"],
    "Name is required"
  );
})
