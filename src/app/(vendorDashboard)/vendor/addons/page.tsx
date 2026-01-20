export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import AddOns from "@/src/components/Dashboard/AddOns/AddOns";
import { TMeta, TResponse } from "@/src/types";
import { TAddonGroup } from "@/src/types/add-ons.type";
import { TTax } from "@/src/types/tax.type";

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

  let taxData = [] as TTax[];
  const addOnsData: { data: TAddonGroup[]; meta?: TMeta } = { data: [] };

  try {
    const taxResult = (await serverRequest.get("/taxes")) as TResponse<{
      data: TTax[];
    }>;

    if (taxResult) {
      taxData = taxResult.data?.data || [];
    }

    const addonsResult = (await serverRequest.get("/add-ons", {
      params: query,
    })) as TResponse<TAddonGroup[]>;

    if (addonsResult?.success) {
      addOnsData.data = addonsResult.data || [];
      addOnsData.meta = addonsResult.meta;
    }
  } catch (err) {
    console.error("Server fetch error:", err);
  }

  return <AddOns addOnsResult={addOnsData} taxes={taxData} />;
}
