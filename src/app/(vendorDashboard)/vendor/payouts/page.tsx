import { serverRequest } from "@/lib/serverFetch";
import Payouts from "@/src/components/Dashboard/Payments/Payouts/Payouts";
import { TMeta, TResponse } from "@/src/types";
import { TPayout } from "@/src/types/payout.type";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function PayoutsPage({ searchParams }: IProps) {
  const queries = (await searchParams) || {};
  const limit = Number(queries?.limit || 10);
  const page = Number(queries.page || 1);
  const searchTerm = queries.searchTerm || "";
  const sortBy = queries.sortBy || "-createdAt";
  const orderStatus = queries.orderStatus || "";

  const query = {
    limit,
    page,
    sortBy,
    ...(searchTerm ? { searchTerm } : {}),
    ...(orderStatus ? { orderStatus } : {}),
  };

  const initialData: { data: TPayout[]; meta?: TMeta } = { data: [] };

  try {
    const result = (await serverRequest.get("/payouts", {
      params: query,
    })) as TResponse<TPayout[]>;

    if (result?.success) {
      initialData.data = result.data;
      initialData.meta = result.meta;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  return <Payouts payoutsResult={initialData} />;
}
