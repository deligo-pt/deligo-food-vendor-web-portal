export type TPayout = {
  _id: string;
  payoutId: string;

  amount: number;

  bankDetails: {
    iban: string;
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    swiftCode: string;
  };

  status: "PENDING" | "PROCESSING" | "PAID" | "FAILED";
  paymentMethod: "BANK_TRANSFER" | "MOBILE_BANKING" | "CASH";

  userId: {
    name: { firstName: string; lastName: string };
  };

  bankReferenceId: string;

  payoutCategory: string;
  remarks: string;

  payoutProof: string;

  createdAt: string;
  updatedAt: string;
};
