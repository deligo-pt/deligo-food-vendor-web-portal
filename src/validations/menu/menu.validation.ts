import { validateLocalizedField } from "@/src/consts/validation.const";
import z from "zod";

const localizedTextSchema = z.object({
    en: z.string().optional(),
    pt: z.string().optional(),
});

const dayEnum = z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]);

export const createMenuSchema = (lang: "en" | "pt") => z.object({

    name: localizedTextSchema,

    description: localizedTextSchema.optional(),

    availability: z
        .object({
            daysOfWeek: z
                .array(dayEnum)
                .optional(),
            startTime: z
                .string()
                .optional(),
            endTime: z
                .string()
                .optional(),
        })
        .optional(),

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