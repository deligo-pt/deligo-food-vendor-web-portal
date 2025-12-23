import { serverRequest } from "@/lib/serverFetch";
import Dashboard from "@/src/components/Dashboard/Dashboard/Dashboard";
import { TAnalytics } from "@/src/types/analytics.type";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const accessToken = (await cookies()).get("accessToken")?.value || "";
  const decoded = jwtDecode(accessToken) as { name: string };

  let analyticsData: TAnalytics = {} as TAnalytics;

  try {
    const result = await serverRequest.get(
      "/analytics/vendor-dashboard-analytics"
    );

    if (result?.success) {
      analyticsData = result?.data;
    }
  } catch (err) {
    console.error("Server fetch error:", err);
  }

  return <Dashboard vendorName={decoded.name} analyticsData={analyticsData} />;
}
