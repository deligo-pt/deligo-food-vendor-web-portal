import Payouts from "@/src/components/Dashboard/Payments/Payouts/Payouts";
import { TPayout } from "@/src/types/payout.type";

const payouts: TPayout[] = [
  {
    _id: "1",
    payoutId: "PAYOUT12345",
    amount: "84.50",
    method: "Bank Transfer (SEPA)",
    iban: "PT50 0002 0123 5678 9011 22",
    accountHolder: "Ana Silva",
    bankName: "União de Bancos Portugueses",
    status: "COMPLETED",
    createdAt: "2025-11-08",
    updatedAt: "2025-11-08",
  },
  {
    _id: "2",
    payoutId: "PAYOUT12346",
    amount: "42.80",
    method: "Bank Transfer (SEPA)",
    iban: "PT50 0002 0123 5678 9011 22",
    accountHolder: "John Doe",
    bankName: "Banco de Portugal",
    status: "PROCESSING",
    createdAt: "2025-11-05",
    updatedAt: "2025-11-05",
  },
  {
    _id: "3",
    payoutId: "PAYOUT12347",
    amount: "128.10",
    method: "Bank Transfer (SEPA)",
    iban: "PT50 0002 0123 5678 9011 22",
    accountHolder: "Rafael Costa",
    bankName: "Dastejo Bank",
    status: "PROCESSING",
    createdAt: "2025-10-30",
    updatedAt: "2025-10-30",
  },
];

export default function PayoutsPage() {
  return (
    <Payouts
      payoutsResult={{
        data: payouts,
        meta: {
          total: 3,
          page: 1,
          limit: 10,
          totalPage: 1,
        },
      }}
    />
  );
}
