import { serverRequest } from "@/lib/serverFetch";
import EarningsSummary from "@/src/components/Dashboard/Payments/EarningsSummary/EarningsSummary";
import { TEarningsAnalytics } from "@/src/types/analytics.type";

export default async function EarningsSummaryPage() {
  let analyticsData: TEarningsAnalytics = {} as TEarningsAnalytics;

  try {
    const result = await serverRequest.get(
      "/analytics/vendor-earnings-analytics",
    );

    if (result?.success) {
      analyticsData = result?.data;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  return <EarningsSummary analyticsData={analyticsData} />;
}
