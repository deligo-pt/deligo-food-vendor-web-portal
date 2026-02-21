import { TOrder } from "@/src/types/order.type";

export type TPayoutStatus = "COMPLETED" | "PROCESSING" | "FAILED";

export type TPayout = {
  _id: string;
  payoutId: string;

  amount: string;
  method: string;
  iban: string;
  accountHolder: string;
  bankName: string;

  status: TPayoutStatus;

  initiatedAt?: string;
  processedAt?: string;
  settledAt?: string;

  reference?: string;

  orders?: {
    orderId: string;
    amount: string;
    date: string;
    status: TOrder["orderStatus"];
  }[];

  grossEarnings?: string;
  platformFee?: string;
  netPayout?: string;

  createdAt: string;
  updatedAt: string;
};
