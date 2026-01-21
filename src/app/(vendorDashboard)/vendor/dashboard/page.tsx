import { serverRequest } from "@/lib/serverFetch";
import Dashboard from "@/src/components/Dashboard/Dashboard/Dashboard";
import { TAnalytics } from "@/src/types/analytics.type";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  let analyticsData: TAnalytics = {} as TAnalytics;
  let decoded = {} as { name: { firstName: string; lastName: string } };

  try {
    const result = await serverRequest.get(
      "/analytics/vendor-dashboard-analytics",
    );

    if (result?.success) {
      const accessToken = (await cookies()).get("accessToken")?.value || "";
      analyticsData = result?.data;
      decoded = jwtDecode(accessToken);
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  return (
    <Dashboard
      vendorName={`${decoded.name?.firstName} ${decoded.name?.lastName}`}
      analyticsData={analyticsData}
    />
  );
}
