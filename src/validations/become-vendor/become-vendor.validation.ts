import { z } from "zod";

export const becomeVendorValidation = z.object({
  email: z.email("Invalid email address").nonempty("Email is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine(
      (val) => /[A-Z]/.test(val),
      "Password must contain at least one uppercase letter"
    )
    .refine(
      (val) => /[a-z]/.test(val),
      "Password must contain at least one lowercase letter"
    )
    .refine(
      (val) => /[0-9]/.test(val),
      "Password must contain at least one number"
    )
    .refine(
      (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
      "Password must contain at least one special character"
    ),

  terms: z.boolean(),

  // Optional: a code from another restaurant or store (plan.md Phase 5).
  // Only length is checked here; whether it exists is the server's call.
  referralCode: z.string().trim().max(32, "loyalty_referral_code_too_long").optional(),
});
