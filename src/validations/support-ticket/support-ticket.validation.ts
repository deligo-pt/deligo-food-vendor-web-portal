import { z } from "zod";
// "ORDER_ISSUE" | "PAYMENT" | "IVA_INVOICE" | "TECHNICAL" | "GENERAL"
export const ticketValidation = z
  .object({
    category: z.enum(
      ["GENERAL", "ORDER_ISSUE", "PAYMENT", "IVA_INVOICE", "TECHNICAL"],
      "Category must be one of the following: GENERAL, ORDER_ISSUE, PAYMENT, IVA_INVOICE, TECHNICAL",
    ),
    message: z
      .string()
      .min(1, "Message should be at least 1 character long")
      .max(1000, "Message should be at most 1000 characters long")
      .nonempty("Message is required"),
    referenceOrderId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.category === "ORDER_ISSUE" && !data.referenceOrderId) {
        return false;
      }
      return true;
    },
    {
      message: "Order ID is required for order issues",
      path: ["referenceOrderId"],
    },
  );
