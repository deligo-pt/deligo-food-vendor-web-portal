import { SOS_ISSUE_TAGS } from "@/src/consts/sos.const";
import z from "zod";

export const createSosValidationSchema = z.object({
  userNote: z
    .string()
    .max(200, "User note must be at most 200 characters")
    .optional(),
  issueTags: z
    .array(
      z.enum(
        SOS_ISSUE_TAGS,
        "Issue tags must be one of the following: Accident, Medical Emergency, Fire, Crime, Natural Disaster, Other",
      ),
    )
    .optional(),
});
