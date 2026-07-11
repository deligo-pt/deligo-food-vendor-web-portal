export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import AddOns from "@/src/components/Dashboard/AddOns/AddOns";
import { TMeta, TResponse } from "@/src/types";
import { TAddonGroup } from "@/src/types/add-ons.type";
import { TTax } from "@/src/types/tax.type";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function AddOnsPage({ searchParams }: IProps) {
  const queries = (await searchParams) || {};
  const limit = Number(queries?.limit || 10);
  const page = Number(queries.page || 1);
  const searchTerm = queries.searchTerm || "";
  const sortBy = queries.sortBy || "-createdAt";
  const lang = queries.lang || "en";

  const query = {
    limit,
    page,
    sortBy,
    ...(searchTerm ? { searchTerm: searchTerm } : {}),
  };

  let taxData = [] as TTax[];
  const addOnsData: { data: TAddonGroup[]; meta?: TMeta } = { data: [] };

  try {
    const taxResult = (await serverRequest.get("/taxes"));

    if (taxResult) {
      taxData = taxResult.data || [];
    }

    const addonsResult = (await serverRequest.get("/add-ons", {
      params: query,
      headers: {
        "Accept-Language": lang
      }
    })) as TResponse<TAddonGroup[]>;

    if (addonsResult?.success) {
      addOnsData.data = addonsResult.data || [];
      addOnsData.meta = addonsResult.meta;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
    if (isRedirectError(err)) throw err;
  }

  return <AddOns addOnsResult={addOnsData} taxes={taxData} />;
}
