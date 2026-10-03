import { serverRequest } from "@/lib/serverFetch";
import Dashboard from "@/src/components/Dashboard/Dashboard/Dashboard";
import PageLoadError from "@/src/components/PageLoadError/PageLoadError";
import { TAnalytics } from "@/src/types/analytics.type";
import { logServerError, TPageLoadFailure } from "@/src/utils/serverError";
import { jwtDecode } from "jwt-decode";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  let analyticsData: TAnalytics = {} as TAnalytics;
  let decoded = {} as { name: { firstName: string; lastName: string } };
  let failure: TPageLoadFailure | null = null;

  try {
    const result = await serverRequest.get(
      "/analytics/vendor/dashboard-analytics",
    );

    if (result?.success) {
      const accessToken = (await cookies()).get("accessToken")?.value || "";
      analyticsData = result?.data;
      decoded = jwtDecode(accessToken);
    }
  } catch (err) {
    if (isRedirectError(err)) throw err;
    failure = logServerError("Dashboard analytics", err);
  }

  // Zeros everywhere would read as a real, empty dashboard.
  if (failure) return <PageLoadError busy={failure.busy} />;

  return (
    <Dashboard
      vendorName={`${decoded.name?.firstName} ${decoded.name?.lastName}`}
      analyticsData={analyticsData}
    />
  );
}
