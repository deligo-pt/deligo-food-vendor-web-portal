import { serverRequest } from "@/lib/serverFetch";
import TopPerformingItems from "@/src/components/Dashboard/Analytics/TopPerformingItems/TopPerformingItems";
import { TTopPerformingItems } from "@/src/types/analytics.type";

export default async function TopPerformingItemsPage() {
  let data: TTopPerformingItems = {} as TTopPerformingItems;

  try {
    const result = await serverRequest.get("/analytics/top-selling-analytics");

    if (result?.success) {
      data = result?.data;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  return <TopPerformingItems topPerformingItemsData={data} />;
}
