export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import CustomerReviews from "@/src/components/Dashboard/Reviews/CustomerReviews";
import { TMeta, TResponse } from "@/src/types";
import { TReview } from "@/src/types/review.type";

export default async function CustomerReviewsPage() {
  const initialData: { data: TReview[]; meta?: TMeta } = { data: [] };

  try {
    const result = (await serverRequest.get("/ratings/get-all-ratings", {
      params: { sortBy: "-createdAt" },
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
