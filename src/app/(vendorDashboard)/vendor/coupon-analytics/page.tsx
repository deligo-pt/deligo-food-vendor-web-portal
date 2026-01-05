export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import CouponAnalytics from "@/src/components/Dashboard/Coupon/CouponAnalytics/CouponAnalytics";
import { TResponse } from "@/src/types";
import { TCouponAnalytics } from "@/src/types/coupon.type";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function CouponAnalyticsPage({ searchParams }: IProps) {
  const queries = (await searchParams) || {};
  const limit = Number(queries?.limit || 10);
  const page = Number(queries.page || 1);
  const searchTerm = queries.searchTerm || "";
  const sortBy = queries.sortBy || "-createdAt";

  const query = {
    limit,
    page,
    sortBy,
    ...(searchTerm ? { searchTerm: searchTerm } : {}),
  };

  let initialData = {} as TCouponAnalytics;

  try {
    const result = (await serverRequest.get("/coupons/analytics", {
      params: query,
    })) as unknown as TResponse<TCouponAnalytics>;
    console.log(result);

    if (result?.success) {
      initialData = result.data;
    }
  } catch (err) {
    console.error("Server fetch error:", err);
  }

  return <CouponAnalytics couponsAnalyticsResult={initialData} />;
}
