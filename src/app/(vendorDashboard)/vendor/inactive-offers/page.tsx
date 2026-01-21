export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import ActiveOffers from "@/src/components/Dashboard/Offers/ActiveOffers/ActiveOffers";
import { TMeta, TResponse } from "@/src/types";
import { TOffer } from "@/src/types/offer.type";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function InactiveOffersPage({ searchParams }: IProps) {
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
    isActive: false,
    isDeleted: false,
  };

  const initialData: { data: TOffer[]; meta?: TMeta } = { data: [] };

  try {
    const result = (await serverRequest.get("/offers", {
      params: query,
    })) as unknown as TResponse<{ data: TOffer[]; meta?: TMeta }>;

    if (result?.success) {
      initialData.data = result.data?.data || [];
      initialData.meta = result.data?.meta;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  return <ActiveOffers offersResult={initialData} title="Inactive" />;
}
