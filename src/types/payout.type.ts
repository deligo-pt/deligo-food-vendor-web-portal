export type TPayout = {
  _id: string;
  payoutId: string;

  amount: string;

  bankDetails: {
    iban: string;
    accountHolder: string;
    bankName: string;
    swiftCode: string;
  };

  status: "PENDING" | "PROCESSING" | "PAID" | "FAILED";
  paymentMethod: "BANK_TRANSFER" | "MOBILE_BANKING" | "CASH";

  bankReferenceId: string;

  payoutCategory: string;
  remarks: string;

  payoutProof: string;

  createdAt: string;
  updatedAt: string;
};
