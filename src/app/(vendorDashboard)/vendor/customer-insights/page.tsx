import { serverRequest } from "@/lib/serverFetch";
import CustomerInsights from "@/src/components/Dashboard/Analytics/CustomerInsights/CustomerInsights";
import { TCustomerInsights } from "@/src/types/analytics.type";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default async function CustomerInsightsPage() {
  let data: TCustomerInsights = {} as TCustomerInsights;

  try {
    const result = await serverRequest.get("/analytics/customer-insights");

    if (result?.success) {
      data = result?.data;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
    if (isRedirectError(err)) throw err;
  }

  return <CustomerInsights insights={data} />;
}
