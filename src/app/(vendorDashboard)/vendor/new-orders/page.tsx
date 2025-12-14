export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import NewOrders from "@/src/components/Dashboard/Orders/NewOrders/NewOrders";
import { TMeta, TResponse } from "@/src/types";
import { TOrder } from "@/src/types/order.type";

export default async function NewOrdersPage() {
  const initialData: { data: TOrder[]; meta?: TMeta } = { data: [] };

  try {
    const result = (await serverRequest.get("/orders", {
      params: { isPaid: true },
    })) as unknown as TResponse<TOrder[]>;

    if (result?.success) {
      initialData.data = result.data || [];
      initialData.meta = result.meta;
    }
  } catch (err) {
    console.error("Server fetch error:", err);
  }

  return <NewOrders ordersResult={initialData} />;
}
