export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import AddOns from "@/src/components/Dashboard/AddOns/AddOns";
import { TMeta, TResponse } from "@/src/types";
import { TAddonGroup } from "@/src/types/add-ons.type";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function AddOnsPage({ searchParams }: IProps) {
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

  const initialData: { data: TAddonGroup[]; meta?: TMeta } = { data: [] };

  try {
    const result = (await serverRequest.get("/add-ons", {
      params: query,
    })) as unknown as TResponse<{ data: TAddonGroup[]; meta?: TMeta }>;

    if (result?.success) {
      initialData.data = result.data?.data || [];
      initialData.meta = result.data?.meta;
    }
  } catch (err) {
    console.error("Server fetch error:", err);
  }

  return <AddOns addOnsResult={initialData} />;
}
