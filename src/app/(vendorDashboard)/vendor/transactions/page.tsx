import { serverRequest } from "@/lib/serverFetch";
import Transactions from "@/src/components/Dashboard/Payments/Transactions/Transactions";
import { TMeta } from "@/src/types";
import { TTransaction } from "@/src/types/transaction.type";
import { catchAsync } from "@/src/utils/catchAsync";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function TransactionsPage({ searchParams }: IProps) {
  const queries = (await searchParams) || {};
  const limit = Number(queries?.limit || 10);
  const page = Number(queries.page || 1);
  const searchTerm = queries.searchTerm || "";
  const sortBy = queries.sortBy || "-createdAt";

  const query = {
    limit,
    page,
    sortBy,
    ...(searchTerm ? { searchTerm } : {}),
  };

  const initialData: { data: TTransaction[]; meta?: TMeta } = { data: [] };

  const result = await catchAsync<TTransaction[]>(async () => {
    return await serverRequest.get("/transactions", {
      params: query,
    });
  });

  if (result?.success) {
    initialData.data = result.data;
    initialData.meta = result.meta;
  }

  return <Transactions transactionsResult={initialData} />;
}
