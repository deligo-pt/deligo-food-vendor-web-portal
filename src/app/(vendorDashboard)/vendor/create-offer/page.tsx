import { serverRequest } from "@/lib/serverFetch";
import VendorCreateOffer from "@/src/components/Dashboard/Offers/CreateOffer/CreateOffer";
import { TMeta, TResponse } from "@/src/types";
import { TProduct, TProductsQueryParams } from "@/src/types/product.type";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

/**
 * Enough for one request in every real case; `meta.total` covers the rest.
 *
 * Matches the ceiling `EditOffer` already passes to `getAllProductsReq`, so the
 * create and edit forms offer the same catalogue.
 */
const FIRST_PAGE_LIMIT = 100;

export default async function CreateOfferPage({ searchParams }: IProps) {
  const queries = (await searchParams) || {};
  const searchTerm = queries.searchTerm || "";
  const sortBy = queries.sortBy || "-createdAt";
  const availability = queries.status || "";

  const query: Partial<TProductsQueryParams> = {
    // 🔴 This page had no `limit`, so the backend's default page size — 10 —
    // decided the catalogue. A vendor with 11 products was offered 10 of them,
    // and the missing one was the oldest, because `sortBy` is `-createdAt`.
    //
    // Nothing about the screen said so: the picker is a selector, not a list,
    // so it has no pager and no "10 of 11" to give the cut away. The dessert
    // heading simply read "2 items" for a category holding three.
    //
    // The pages that *do* omit a limit are paginated lists (`all-items`,
    // `stock`, `variation-management`) where a page of 10 is the point. This
    // one has to carry the whole catalogue, because a product it does not show
    // is a product that cannot be put in an offer.
    limit: FIRST_PAGE_LIMIT,
    page: 1,
    sortBy,
    ...(searchTerm ? { searchTerm: searchTerm } : {}),
    ...(availability ? { "stock.availabilityStatus": availability } : {}),
  };

  const initialData: { data: TProduct[]; meta?: TMeta } = { data: [] };

  try {
    let result = (await serverRequest.get("/products", {
      params: query,
    })) as unknown as TResponse<TProduct[]>;

    // "All products" has to mean all of them, not the first hundred. A second
    // request only happens for a vendor past `FIRST_PAGE_LIMIT`, so the common
    // case stays one round trip — and `meta.total` is what says which case
    // this is, rather than a ceiling picked in advance.
    if (result?.success) {
      const total = result.meta?.total ?? 0;
      if (total > (result.data?.length ?? 0)) {
        result = (await serverRequest.get("/products", {
          params: { ...query, limit: total },
        })) as unknown as TResponse<TProduct[]>;
      }
    }

    if (result?.success) {
      initialData.data = result.data;
      initialData.meta = result.meta;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
    if (isRedirectError(err)) throw err;
  }
  return <VendorCreateOffer itemsResult={initialData} />;
}
