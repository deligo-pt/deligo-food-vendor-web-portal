import { serverRequest } from "@/lib/serverFetch";
import OrderDetails from "@/src/components/Dashboard/Orders/OrderDetails/OrderDetails";
import { TResponse } from "@/src/types";
import { TOrderDetails } from "@/src/types/order.type";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let initialData: TOrderDetails = {} as TOrderDetails;

  try {
    const result = (await serverRequest.get(
      `/orders/${id}`,
    )) as TResponse<TOrderDetails>;

    if (result?.success) {
      initialData = result.data;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
    if (isRedirectError(err)) throw err;
  }

  return <OrderDetails order={initialData} />;
}
