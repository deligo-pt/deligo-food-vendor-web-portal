import { validateLocalizedField } from "@/src/consts/validation.const";
import z from "zod";

const localizedTextSchema = z.object({
    en: z.string().optional(),
    pt: z.string().optional(),
});


export const createMenuSectionSchema = (lang: "en" | "pt") => z.object({

    name: localizedTextSchema,

    description: localizedTextSchema.optional(),

    sortOrder: z.number().int().min(0),

    isActive: z.boolean(),
})
    .superRefine((data, ctx) => {
        validateLocalizedField(
            data.name,
            lang,
            ctx,
            ["name"],
            "Name is required"
        );
    });

export const itemAddSchema = z.object({
    productId: z.string({ error: "Please select a product" }).min(1, "Please select a product"),
    sortOrder: z.number().min(0, "Sort order must be 0 or greater"),
    isAvailable: z.boolean(),
});