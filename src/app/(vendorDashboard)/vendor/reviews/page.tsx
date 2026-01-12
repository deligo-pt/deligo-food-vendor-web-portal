export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import CustomerReviews from "@/src/components/Dashboard/Reviews/CustomerReviews";
import { TMeta, TResponse } from "@/src/types";
import { TReview } from "@/src/types/review.type";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function CustomerReviewsPage({ searchParams }: IProps) {
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

  const initialData: { data: TReview[]; meta?: TMeta } = { data: [] };

  try {
    const result = (await serverRequest.get("/ratings/get-all-ratings", {
      params: query,
    })) as unknown as TResponse<TReview[]>;

    if (result?.success) {
      initialData.data = result.data || [];
      initialData.meta = result.meta;
    }
  } catch (err) {
    console.error("Server fetch error:", err);
  }

  return <CustomerReviews reviewsResult={initialData} />;
}
