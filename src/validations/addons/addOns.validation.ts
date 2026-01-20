import z from "zod";

export const createAddonOptionValidationSchema = z.object({
  name: z.string().nonempty("Option name is required"),
  price: z.number("Price must be a number").min(0, "Price cannot be negative"),
  tax: z.string().nonempty("Tax is required"),
});

export const createAddonGroupValidationSchema = z
  .object({
    title: z
      .string("Group title is required (e.g., Extra Cheese)")
      .min(2, "Group title must be at least 2 character")
      .max(50, "Group title must be at most 50 characters")
      .nonempty("Group title is required"),
    minSelectable: z
      .number("Minimum selection must be a number")
      .min(0, "Minimum selection cannot be negative"),
    maxSelectable: z
      .number("Maximum selection must be a number")
      .min(1, "Maximum selection must be at least 1"),
    options: z
      .array(
        z.object({
          name: z.string(),
          price: z
            .number("Price must be a number")
            .min(0, "Price cannot be negative"),
          tax: z.string(),
        }),
      )
      .min(1, "At least one option must be provided in the group"),
    optionName: z.string().optional(),
    optionPrice: z.number().min(0).optional(),
    optionTax: z.string().optional(),
  })
  .refine((data) => data.options.length >= 1, {
    message: "At least one option must be provided in the group",
    path: ["optionTax"],
  });
