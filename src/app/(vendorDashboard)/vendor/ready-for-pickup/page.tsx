export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import ReadyForPickupOrders from "@/src/components/Dashboard/Orders/ReadyForPickup/ReadyForPickup";
import { TMeta, TResponse } from "@/src/types";
import { TOrder } from "@/src/types/order.type";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function ReadyForPickupOrdersPage({
  searchParams,
}: IProps) {
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
        orderStatus: "READY_FOR_PICKUP",
      },
    })) as unknown as TResponse<TOrder[]>;

    if (result?.success) {
      initialData.data = result.data || [];
      initialData.meta = result.meta;
    }
  } catch (err) {
    console.error("Server fetch error:", err);
  }

  return <ReadyForPickupOrders ordersResult={initialData} />;
}
