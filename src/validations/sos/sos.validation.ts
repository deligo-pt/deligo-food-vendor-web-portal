import { SOS_ISSUE_TAGS } from "@/src/consts/sos.const";
import z from "zod";

export const createSosValidationSchema = z.object({
  userNote: z
    .string()
    .min(1, { message: "User note is required" })
    .max(200, "User note must be at most 200 characters"),
  issueTags: z
    .array(
      z.enum(SOS_ISSUE_TAGS, {
        message:
          "Issue tags must be one of the following",
      }),
    ).min(1, { message: "Please select at least one issue tag" }),
});
