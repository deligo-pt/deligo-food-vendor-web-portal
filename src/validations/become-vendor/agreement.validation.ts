import z from "zod";

export const vendorAgreementSchema = z.object({
    signatoryType: z.enum(["SELF", "AUTHORIZED_REPRESENTATIVE"] as const, {
        message: "Signatory type is required",
    }),
    partyRepresentativeName: z.string().optional(),
    partyRepresentativeRole: z.string().optional(),
})
    .refine(
        (data) => {
            if (data.signatoryType === "AUTHORIZED_REPRESENTATIVE") {
                return !!data.partyRepresentativeName && data.partyRepresentativeName.trim().length > 0;
            }
            return true;
        },
        {
            message: "Representative name is required for authorized representatives",
            path: ["partyRepresentativeName"],
        }
    )
    .refine(
        (data) => {
            if (data.signatoryType === "AUTHORIZED_REPRESENTATIVE") {
                return !!data.partyRepresentativeRole && data.partyRepresentativeRole.trim().length > 0;
            }
            return true;
        },
        {
            message: "Representative role is required for authorized representatives",
            path: ["partyRepresentativeRole"],
        }
    );

export type TVendorAgreementForm = z.infer<typeof vendorAgreementSchema>;