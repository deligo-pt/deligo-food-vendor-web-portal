import { serverRequest } from "@/lib/serverFetch";
import TopPerformingItems from "@/src/components/Dashboard/Analytics/TopPerformingItems/TopPerformingItems";
import { TTopPerformingItems } from "@/src/types/analytics.type";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default async function TopPerformingItemsPage() {
  let data: TTopPerformingItems = {} as TTopPerformingItems;

  try {
    const result = await serverRequest.get("/analytics/top-selling-analytics");

    if (result?.success) {
      data = result?.data;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
    if (isRedirectError(err)) throw err;
  }

  return <TopPerformingItems topPerformingItemsData={data} />;
}
