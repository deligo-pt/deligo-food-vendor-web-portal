import { validateLocalizedField } from "@/src/consts/validation.const";
import { z } from "zod";

const localizedTextSchema = z.object({
  en: z.string().optional(),
  pt: z.string().optional(),
});

const rewardOptionSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  variationSku: z.string().optional(),
});

const buyAndRewardBuySchema = z.object({
  scope: z.enum(["SPECIFIC_PRODUCTS"]).default("SPECIFIC_PRODUCTS"),
  productIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  quantity: z.number().min(1, "Buy quantity must be at least 1"),
});

const buyAndRewardRewardSchema = z.object({
  type: z.enum(["SAME_PRODUCT", "FIXED_PRODUCT", "CUSTOMER_CHOICE"]),
  quantity: z.number().min(1, "Reward quantity must be at least 1"),
  productId: z.string().optional(),
  variationSku: z.string().optional(),
  options: z.array(rewardOptionSchema).optional(),
});

export const offerValidation = z.object({
  title: localizedTextSchema,
  description: localizedTextSchema,

  offerType: z.enum(["PERCENT", "FLAT", "BUY_AND_REWARD"], {
    error: "Offer type is required",
  }),

  discountValue: z.number().min(0).max(100).optional(),
  maxDiscountAmount: z.number().min(0).max(1000).optional(),

  scopeType: z.enum(["ALL_PRODUCTS", "SPECIFIC_PRODUCTS"]).optional(),
  scopeCategories: z.array(z.string()).optional(),
  scopeProducts: z.array(z.string()).optional(),

  buyAndReward: z
    .object({
      buy: buyAndRewardBuySchema,
      reward: buyAndRewardRewardSchema,
    })
    .optional(),

  validFrom: z.date({ error: "Start date is required" }),
  expiresAt: z.date({ error: "End date is required" }),
  minOrderAmount: z.number().min(0).optional(),
  code: z.string().optional(),
  isAutoApply: z.boolean().optional(),
  userUsageLimit: z.string().optional(),
  isActive: z.boolean().default(true),

  currentLang: z.enum(["en", "pt"]),
})
  .superRefine((data, ctx) => {
    validateLocalizedField(
      data.title,
      data.currentLang,
      ctx,
      ["title"],
      "Title is required",
    );
    validateLocalizedField(
      data.description,
      data.currentLang,
      ctx,
      ["description"],
      "Description is required",
    );
  })
  .refine((data) => data.validFrom < data.expiresAt, {
    message: "End date must be after start date",
    path: ["expiresAt"],
  })
  .refine(
    (data) => {
      if (data.offerType === "PERCENT" || data.offerType === "FLAT") {
        return data.discountValue !== undefined && data.discountValue !== null;
      }
      return true;
    },
    { message: "Discount value is required", path: ["discountValue"] },
  )
  .refine(
    (data) => {
      if (
        (data.offerType === "PERCENT" || data.offerType === "FLAT") &&
        data.scopeType === "SPECIFIC_PRODUCTS"
      ) {
        return !!data.scopeProducts && data.scopeProducts.length > 0;
      }
      return true;
    },
    { message: "At least one product is required", path: ["scopeProducts"] },
  )
  .refine(
    (data) => {
      if (data.offerType === "PERCENT" || data.offerType === "FLAT") {
        if (!data.isAutoApply) {
          return !!data.code && data.code.trim() !== "";
        }
      }
      return true;
    },
    {
      message: "Promo code is required when auto-apply is disabled",
      path: ["code"],
    },
  )
  .refine(
    (data) => {
      if (data.offerType === "BUY_AND_REWARD") {
        return !!data.buyAndReward;
      }
      return true;
    },
    {
      message: "Buy & Reward configuration is required",
      path: ["buyAndReward"],
    },
  )
  .refine(
    (data) => {
      if (data.offerType === "BUY_AND_REWARD" && data.buyAndReward) {
        return (
          !!data.buyAndReward.buy.quantity &&
          data.buyAndReward.buy.quantity >= 1
        );
      }
      return true;
    },
    {
      message: "Buy quantity must be at least 1",
      path: ["buyAndReward", "buy", "quantity"],
    },
  )
  .refine(
    (data) => {
      if (data.offerType === "BUY_AND_REWARD" && data.buyAndReward) {
        return (
          !!data.buyAndReward.buy.productIds &&
          data.buyAndReward.buy.productIds.length > 0
        );
      }
      return true;
    },
    {
      message: "At least one product is required for buy condition",
      path: ["buyAndReward", "buy", "productIds"],
    },
  )
  .refine(
    (data) => {
      if (data.offerType === "BUY_AND_REWARD" && data.buyAndReward) {
        return (
          !!data.buyAndReward.reward.quantity &&
          data.buyAndReward.reward.quantity >= 1
        );
      }
      return true;
    },
    {
      message: "Reward quantity must be at least 1",
      path: ["buyAndReward", "reward", "quantity"],
    },
  )
  .refine(
    (data) => {
      if (
        data.offerType === "BUY_AND_REWARD" &&
        data.buyAndReward?.reward.type === "FIXED_PRODUCT"
      ) {
        return !!data.buyAndReward.reward.productId;
      }
      return true;
    },
    {
      message: "Fixed reward product is required",
      path: ["buyAndReward", "reward", "productId"],
    },
  )
  .refine(
    (data) => {
      if (
        data.offerType === "BUY_AND_REWARD" &&
        data.buyAndReward?.reward.type === "CUSTOMER_CHOICE"
      ) {
        const opts = data.buyAndReward.reward.options;
        return (
          !!opts && opts.length > 0 && opts.every((o) => !!o.productId)
        );
      }
      return true;
    },
    {
      message: "At least one reward option is required",
      path: ["buyAndReward", "reward", "options"],
    },
  )
  .refine(
    (data) => {
      if (data.userUsageLimit && data.userUsageLimit.trim() !== "") {
        const num = Number(data.userUsageLimit);
        return !isNaN(num) && num >= 1;
      }
      return true;
    },
    {
      message: "User usage limit must be a number ≥ 1",
      path: ["userUsageLimit"],
    },
  );

export type TOfferForm = z.infer<typeof offerValidation>;

/** Helper – true if product has selectable variation SKUs */
export function productHasVariations(product: {
  stock?: { hasVariations?: boolean };
  variations?: { options?: { sku?: string }[] }[];
}): boolean {
  if (product.stock?.hasVariations) return true;
  return !!(
    product.variations?.length &&
    product.variations.some((v) => v.options?.some((o) => !!o.sku))
  );
}

/** Flatten all SKU options from a product for a Select */
export function getProductSkuOptions(
  product: {
    variations?: {
      name?: { en?: string; pt?: string } | string;
      options?: {
        label?: { en?: string; pt?: string } | string;
        sku?: string;
        price?: number;
      }[];
    }[];
  },
  lang: string = "en",
): { sku: string; label: string }[] {
  const result: { sku: string; label: string }[] = [];
  if (!product.variations?.length) return result;

  product.variations.forEach((v) => {
    v.options?.forEach((opt) => {
      if (!opt.sku) return;
      const labelObj = opt.label as Record<string, unknown>;
      const label =
        (typeof labelObj === "object"
          ? labelObj?.[lang] || labelObj?.en
          : labelObj) || opt.sku;
      result.push({ sku: opt.sku, label: `${label} (${opt.sku})` });
    });
  });
  return result;
}
