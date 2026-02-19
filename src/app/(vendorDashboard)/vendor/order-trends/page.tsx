import { serverRequest } from "@/lib/serverFetch";
import OrderTrends from "@/src/components/Dashboard/Analytics/OrderTrends/OrderTrends";
import { TOrderTrends } from "@/src/types/analytics.type";

export default async function OrderTrendsPage() {
  let data: TOrderTrends = {} as TOrderTrends;

  try {
    const result = await serverRequest.get("/analytics/order-trend-insights");

    if (result?.success) {
      data = result?.data;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  return <OrderTrends orderTrends={data} />;
}
