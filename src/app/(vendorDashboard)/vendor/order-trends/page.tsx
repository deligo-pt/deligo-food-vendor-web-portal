import { serverRequest } from "@/lib/serverFetch";
import OrderTrends from "@/src/components/Dashboard/Analytics/OrderTrends/OrderTrends";
import { TOrderTrends } from "@/src/types/analytics.type";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default async function OrderTrendsPage() {
  let data: TOrderTrends = {} as TOrderTrends;

  try {
    const result = await serverRequest.get("/analytics/order-trend-insights");

    if (result?.success) {
      data = result?.data;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
    if (isRedirectError(err)) throw err;
  }

  return <OrderTrends orderTrends={data} />;
}
