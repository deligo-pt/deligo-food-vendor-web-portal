// import { isValidPhoneNumber } from "libphonenumber-js";
import { phone } from "phone";
import { z } from "zod";

export const personalDetailsValidation = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters long")
      .max(30, "First name must be at most 30 characters long")
      .nonempty("First name is required"),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters long")
      .max(30, "Last name must be at most 30 characters long")
      .nonempty("Last name is required"),

    email: z.email("Invalid email address").nonempty("Email is required"),

    prefixPhoneNumber: z.string(),

    phoneNumber: z
      .string()
      .nonempty("Phone number is required")
      .nonempty("Phone number is required"),
  })
  .refine(
    (data) => {
      const full = data.prefixPhoneNumber + data.phoneNumber;
      const result = phone(full, { country: "" });
      return result.isValid === true;
    },
    {
      message: "Invalid phone number for the selected country",
      path: ["phoneNumber"],
    }
  )
  .transform((data) => {
    return {
      ...data,
      phoneNumber: data.prefixPhoneNumber + data.phoneNumber,
    };
  });
