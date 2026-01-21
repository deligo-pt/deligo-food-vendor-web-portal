export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import OngoingDeliveries from "@/src/components/Dashboard/Orders/OngoingDeliveries/OngoingDeliveries";
import { TMeta, TResponse } from "@/src/types";
import { TOrder } from "@/src/types/order.type";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function OngoingDeliveriesPage({ searchParams }: IProps) {
  const queries = (await searchParams) || {};
  const limit = Number(queries?.limit || 10);
  const page = Number(queries.page || 1);
  const searchTerm = queries.searchTerm || "";
  const sortBy = queries.sortBy || "-createdAt";

  const query = {
    limit,
    page,
    sortBy,
    ...(searchTerm ? { searchTerm: searchTerm } : {}),
  };

  const initialData: { data: TOrder[]; meta?: TMeta } = { data: [] };

  try {
    const result = (await serverRequest.get("/orders", {
      params: {
        ...query,
        isPaid: true,
        orderStatus: "ON_THE_WAY",
      },
    })) as unknown as TResponse<TOrder[]>;

    if (result?.success) {
      initialData.data = result.data || [];
      initialData.meta = result.meta;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  return <OngoingDeliveries ordersResult={initialData} />;
}
