import z from "zod";

export const changePasswordValidation = z
  .object({
    oldPassword: z.string().nonempty("Old password is required"),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long")
      .refine(
        (val) => /[A-Z]/.test(val),
        "New password must contain at least one uppercase letter"
      )
      .refine(
        (val) => /[a-z]/.test(val),
        "New password must contain at least one lowercase letter"
      )
      .refine(
        (val) => /[0-9]/.test(val),
        "New password must contain at least one number"
      )
      .refine(
        (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
        "New password must contain at least one special character"
      ),

    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters long")
      .refine(
        (val) => /[A-Z]/.test(val),
        "Confirm password must contain at least one uppercase letter"
      )
      .refine(
        (val) => /[a-z]/.test(val),
        "Confirm password must contain at least one lowercase letter"
      )
      .refine(
        (val) => /[0-9]/.test(val),
        "Confirm password must contain at least one number"
      )
      .refine(
        (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
        "Confirm password must contain at least one special character"
      ),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
