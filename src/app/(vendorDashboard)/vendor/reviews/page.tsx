export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import CustomerReviews from "@/src/components/Dashboard/Reviews/CustomerReviews";
import { TMeta, TResponse } from "@/src/types";
import { TReview } from "@/src/types/review.type";
import { TVendor } from "@/src/types/vendor.type";

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
  const vendorRating = { average: 0, totalReviews: 0 };

  try {
    const result = (await serverRequest.get("/ratings/get-all-ratings", {
      params: query,
    })) as TResponse<TReview[]>;

    if (result?.success) {
      initialData.data = result.data || [];
      initialData.meta = result.meta;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  try {
    const result = (await serverRequest.get("/profile")) as TResponse<TVendor>;

    if (result?.success) {
      vendorRating.average = result.data?.rating?.average || 0;
      vendorRating.totalReviews = result.data?.rating?.totalReviews || 0;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  return (
    <CustomerReviews reviewsResult={initialData} vendorRating={vendorRating} />
  );
}
