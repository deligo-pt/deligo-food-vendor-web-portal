import { validateLocalizedField } from "@/src/consts/validation.const";
import { z } from "zod";

// Messages are translation keys: `FormMessage` passes them through `t()`, so a
// Portuguese vendor reads Portuguese errors. See `offer_err_*` in the translations.

const localizedTextSchema = z.object({
  en: z.string().optional(),
  pt: z.string().optional(),
});

const rewardOptionSchema = z.object({
  productId: z.string().min(1, "offer_err_product_required"),
  variationSku: z.string().optional(),
});

const buyAndRewardBuySchema = z.object({
  scope: z.enum(["SPECIFIC_PRODUCTS"]).default("SPECIFIC_PRODUCTS"),
  productIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  quantity: z.number().min(1, "offer_err_buy_qty_min"),
});

const buyAndRewardRewardSchema = z.object({
  type: z.enum(["SAME_PRODUCT", "FIXED_PRODUCT", "CUSTOMER_CHOICE"]),
  quantity: z.number().min(1, "offer_err_reward_qty_min"),
  productId: z.string().optional(),
  variationSku: z.string().optional(),
  options: z.array(rewardOptionSchema).optional(),
});

export const offerValidation = z.object({
  title: localizedTextSchema,
  description: localizedTextSchema,

  offerType: z.enum(["PERCENT", "FLAT", "BUY_AND_REWARD"], {
    error: "offer_err_type_required",
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

  validFrom: z.date({ error: "offer_err_start_date_required" }),
  expiresAt: z.date({ error: "offer_err_end_date_required" }),
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
      "offer_err_title_required",
    );
    validateLocalizedField(
      data.description,
      data.currentLang,
      ctx,
      ["description"],
      "offer_err_description_required",
    );
  })
  .refine((data) => data.validFrom < data.expiresAt, {
    message: "offer_err_end_after_start",
    path: ["expiresAt"],
  })
  .refine(
    (data) => {
      if (data.offerType === "PERCENT" || data.offerType === "FLAT") {
        return data.discountValue !== undefined && data.discountValue !== null;
      }
      return true;
    },
    { message: "offer_err_discount_required", path: ["discountValue"] },
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
    { message: "offer_err_one_product", path: ["scopeProducts"] },
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
      message: "offer_err_promo_code",
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
      message: "offer_err_buy_reward_required",
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
      message: "offer_err_buy_qty_min",
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
      message: "offer_err_buy_product",
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
      message: "offer_err_reward_qty_min",
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
      message: "offer_err_fixed_reward",
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
      message: "offer_err_reward_option",
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
      message: "offer_err_usage_limit",
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
