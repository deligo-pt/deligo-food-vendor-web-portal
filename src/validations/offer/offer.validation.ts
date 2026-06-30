import { validateLocalizedField } from "@/src/consts/validation.const";
import { z } from "zod";

const localizedTextSchema = z.object({
  en: z.string().optional(),
  pt: z.string().optional(),
});


export const offerValidation = z.object({
  title: localizedTextSchema,

  description: localizedTextSchema,

  offerType: z.enum(
    ["PERCENT", "FLAT", "BOGO"],
    "Offer type must be one of the following: PERCENT, FLAT, BOGO",
  ),

  discountValue: z
    .number()
    .min(0, "Discount value must be at least 0")
    .max(100, "Discount value must be at most 100")
    .optional(),

  maxDiscountAmount: z
    .number("Max discount amount must be a number")
    .min(0, "Max discount amount must be at least 0")
    .max(1000, "Max discount amount must be at most 1000")
    .optional(),

  buyQty: z.number("Buy quantity must be a number").optional(),

  getQty: z.number("Get quantity must be a number").optional(),

  productId: z.string().optional(),

  validFrom: z.date("Start date must be a valid date"),
  expiresAt: z.date("End date must be a valid date"),

  minOrderAmount: z
    .number()
    .min(0, "Minimum order amount must be at least 0")
    .optional(),

  code: z.string().optional(),
  isAutoApply: z.boolean("Auto apply must be a boolean"),

  maxUsageCount: z.string().optional(),

  userUsageLimit: z.string().optional(),

  applicableProducts: z.array(z.string("Product is required")).optional(),
  currentLang: z.enum(["en", "pt"]),
})
  .superRefine((data, ctx) => {
    validateLocalizedField(
      data.title,
      data.currentLang,
      ctx,
      ["title"],
      "Title is required"
    );

    validateLocalizedField(
      data.description,
      data.currentLang,
      ctx,
      ["description"],
      "Description is required"
    );
  })
  .refine(
    (data) => {
      if (data.validFrom >= data.expiresAt) {
        return false;
      }
      return true;
    },
    { message: "End date must be after start date", path: ["expiresAt"] },
  )
  .refine(
    (data) => {
      if (!data.isAutoApply && (!data.code || data.code === "")) {
        return false;
      }
      return true;
    },
    { message: "Code is required", path: ["code"] },
  )
  .refine(
    (data) => {
      if (data.offerType === "BOGO" && !data.productId) {
        return false;
      }
      return true;
    },
    {
      message: "Item id is required",
      path: ["productId"],
    },
  )
  .refine(
    (data) => {
      if (data.offerType === "BOGO" && (!data.buyQty || data.buyQty <= 0)) {
        return false;
      }
      return true;
    },
    {
      message: "Buy quantity are required for BOGO offers",
      path: ["buyQty"],
    },
  )
  .refine(
    (data) => {
      if (data.offerType === "BOGO" && (!data.getQty || data.getQty <= 0)) {
        return false;
      }
      return true;
    },
    {
      message: "Get quantity are required for BOGO offers",
      path: ["getQty"],
    },
  )
  .refine(
    (data) => {
      if (data.maxUsageCount) {
        if (isNaN(Number(data.maxUsageCount))) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Max usage count must be a number",
      path: ["maxUsageCount"],
    },
  )
  .refine(
    (data) => {
      if (
        data.maxUsageCount &&
        data.maxUsageCount.length > 0 &&
        Number(data.maxUsageCount) < 1
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Max usage count must be at least 1",
      path: ["maxUsageCount"],
    },
  )
  .refine(
    (data) => {
      if (data.userUsageLimit) {
        if (isNaN(Number(data.userUsageLimit))) {
          return false;
        }
      }
      return true;
    },
    {
      message: "User usage limit must be a number",
      path: ["userUsageLimit"],
    },
  )
  .refine(
    (data) => {
      if (
        data.userUsageLimit &&
        data.userUsageLimit.length > 0 &&
        Number(data.userUsageLimit) < 1
      ) {
        return false;
      }
      return true;
    },
    {
      message: "User usage limit must be at least 1",
      path: ["userUsageLimit"],
    },
  );
