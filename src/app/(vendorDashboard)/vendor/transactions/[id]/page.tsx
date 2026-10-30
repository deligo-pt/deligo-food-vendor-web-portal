import { serverRequest } from "@/lib/serverFetch";
import TransactionDetails from "@/src/components/Dashboard/Payments/Transactions/TransactionDetails";
import { TTransaction } from "@/src/types/transaction.type";
import { catchAsync } from "@/src/utils/catchAsync";

/**
 * `GET /transactions/:id` answers vendors "Access denied" (26 Oct 2026), so the
 * transaction is found by searching its id — which returns exactly that one —
 * and its siblings by searching the order id.
 */
async function searchTransactions(searchTerm: string, limit: number) {
  const result = await catchAsync<TTransaction[]>(async () => {
    return await serverRequest.get("/transactions", {
      params: { searchTerm, limit, sortBy: "-createdAt" },
    });
  });
  return result?.success && Array.isArray(result.data) ? result.data : [];
}

export default async function TransactionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = decodeURIComponent((await params).id);

  const transaction =
    (await searchTransactions(id, 10)).find((tx) => tx.transactionId === id) ?? null;

  const orderId = transaction?.orderId || transaction?.order?.orderId;
  const related = orderId
    ? (await searchTransactions(orderId, 50)).filter(
        (tx) => tx.transactionId !== id && (tx.orderId || tx.order?.orderId) === orderId,
      )
    : [];

  return <TransactionDetails transaction={transaction} related={related} />;
}
