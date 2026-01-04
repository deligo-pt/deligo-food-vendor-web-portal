export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import CouponAnalytics from "@/src/components/Dashboard/Coupon/CouponAnalytics/CouponAnalytics";
import { TMeta, TResponse } from "@/src/types";
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

  const initialData: { data: TCouponAnalytics[]; meta?: TMeta } = { data: [] };

  try {
    const result = (await serverRequest.get("/coupons/analytics", {
      params: query,
    })) as unknown as TResponse<{ data: TCouponAnalytics[]; meta?: TMeta }>;
    console.log(result);

    if (result?.success) {
      initialData.data = result.data?.data || [];
      initialData.meta = result.data?.meta;
    }
  } catch (err) {
    console.error("Server fetch error:", err);
  }

  return <CouponAnalytics couponsAnalyticsResult={initialData} />;
}
