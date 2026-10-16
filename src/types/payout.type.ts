export type TPayout = {
  _id: string;
  payoutId: string;

  amount: number;
  /**
   * The split of `amount`: what the vendor earned on orders, and the SDR
   * container deposit paid out with it. `totalPayout` = `earnings` +
   * `sdrAmount`. All three can be missing on older payouts.
   */
  earnings?: number;
  sdrAmount?: number;
  totalPayout?: number;

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
