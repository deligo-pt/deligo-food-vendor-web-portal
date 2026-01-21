export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import RatingSummary from "@/src/components/Dashboard/Reviews/RatingSummary";
import { TResponse } from "@/src/types";
import { TRatingSummary } from "@/src/types/review.type";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function RatingSummaryPage({ searchParams }: IProps) {
  const queries = (await searchParams) || {};
  const limit = Number(queries?.limit || 10);
  const page = Number(queries.page || 1);
  const sentiment = queries.sentiment || "";

  const query = {
    limit,
    page,
    sortBy: "-createdAt",
    ...(sentiment ? { sentiment } : {}),
  };

  let initialData: TRatingSummary = {} as TRatingSummary;

  try {
    const result = (await serverRequest.get("/ratings/get-rating-summary", {
      params: query,
    })) as unknown as TResponse<TRatingSummary>;

    if (result?.success) {
      initialData = result.data;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  return <RatingSummary summaryResult={initialData} />;
}
