import { serverRequest } from "@/lib/serverFetch";
import NewOrders from "@/src/components/Dashboard/Orders/NewOrders/NewOrders";
import { TResponse } from "@/src/types";
import { TOrder } from "@/src/types/order.type";

export default async function NewOrdersPage() {
  let initialData: TOrder[] = [] as TOrder[];

  try {
    const result = (await serverRequest.get(
      "orders/new"
    )) as unknown as TResponse<TOrder[]>;

    if (result?.success) {
      initialData = result?.data || [];
    }
  } catch (err) {
    console.error("Server fetch error:", err);
  }

  console.log(initialData);

  return <NewOrders />;
}
