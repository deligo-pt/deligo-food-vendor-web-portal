import { TMeta } from "./index";

export type TAgreementStatus = "PARTY_SIGNED" | "SIGNED" | "PENDING" | "REJECTED";
export type TPartySignatureMethod = "UPLOADED" | "DRAWN";
export type TPartySignatoryType = "AUTHORIZED_REPRESENTATIVE" | "SELF";
export type TPosPaymentOption = "MONTHLY_RENTAL" | "THREE_INSTALLMENTS";

export interface IAgreementUserRef {
    _id: string;
    id: string;
    email: string;
    name: {
        firstName: string;
        lastName: string;
    };
}

export interface IAgreement {
    _id: string;
    partyId: string;
    partyModel: string;
    agreementType: string;
    partyLegalName: string;
    email: string;
    contactNumber: string;
    nif: string;
    commercialName: string;
    headOfficeAddress: string;
    zipCode: string;
    country: string;
    partyRepresentativeName: string;
    partyRepresentativeRole: string;
    partyIban: string;
    deligoRepresentativeName: string | null;
    deligoRepresentativeRole: string | null;
    draftPdfPath: string;
    deligoSignaturePath: string | null;
    partySignaturePath: string | null;
    partyStampPath: string | null;
    partySignatureMethod: TPartySignatureMethod;
    partySignatoryType: TPartySignatoryType;
    signedPdfPath: string;
    status: TAgreementStatus;
    posPaymentOption: TPosPaymentOption;
    signedAt: string;
    deligoSignedAt: string | null;
    emailedAt: string | null;
    createdBy: IAgreementUserRef;
    createdByModel: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface IAgreementsResponse {
    success: boolean;
    message: string;
    meta: TMeta;
    data: IAgreement[];
}