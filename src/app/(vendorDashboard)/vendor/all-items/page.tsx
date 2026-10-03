import { serverRequest } from "@/lib/serverFetch";
import Products from "@/src/components/Dashboard/Products/Products";
import PageLoadError from "@/src/components/PageLoadError/PageLoadError";
import { getAllBranches } from "@/src/services/dashboard/branch/branch.service";
import { getAllProductCategoriesReq } from "@/src/services/dashboard/categories/product-categories";
import { getProfileData } from "@/src/services/dashboard/profile/profile.service";
import { TMeta } from "@/src/types";
import { TProduct, TProductsQueryParams } from "@/src/types/product.type";
import { TVendor } from "@/src/types/vendor.type";
import { logServerError, TPageLoadFailure } from "@/src/utils/serverError";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function ProductsPage({ searchParams }: IProps) {
  const queries = (await searchParams) || {};
  const limit = Number(queries?.limit || 20);
  const page = Number(queries.page || 1);
  const searchTerm = queries.searchTerm || "";
  const sortBy = queries.sortBy || "-createdAt";
  const lang = queries.lang || "en";

  const productsData: { data: TProduct[]; meta?: TMeta } = { data: [] };

  // Requests run side by side; this page used to make them one after another
  // (~4.6s). Categories don't depend on anything, so they start right away.
  // The vendor comes from the request cache the layout has already filled. Then
  // products and branches load together. `/taxes` was fetched here too but
  // never used, so it's gone.
  const categoriesPromise = getAllProductCategoriesReq();
  const vendorData = (await getProfileData()) as TVendor;

  const availability =
    (vendorData?.businessDetails?.businessType === "RESTAURANT" &&
      queries.status) ||
    "";

  const query: Partial<TProductsQueryParams> = {
    limit,
    page,
    sortBy,
    ...(searchTerm ? { searchTerm } : {}),
    ...(availability ? { "stock.availabilityStatus": availability } : {}),
  };

  const loadProducts = async (): Promise<TPageLoadFailure | null> => {
    try {
      const productsResult = await serverRequest.get("/products", {
        params: query,
        headers: { "Accept-Language": lang },
      });

      if (productsResult?.success) {
        productsData.data = productsResult.data;
        productsData.meta = productsResult.meta;
      }
    } catch (err) {
      if (isRedirectError(err)) {
        throw err;
      }
      return logServerError("All items", err);
    }
    return null;
  };

  // The copy targets. Fetched here as well as on the product page, because the
  // catalogue can now copy a whole selection; an empty list hides the feature
  // rather than offering a copy with nowhere to go.
  const [{ data }, branchResults, failure] = await Promise.all([
    categoriesPromise,
    vendorData?.userId ? getAllBranches(vendorData.userId, undefined, { cached: true }) : null,
    loadProducts(),
  ]);

  // "No products" would read as a real, empty catalogue.
  if (failure) return <PageLoadError busy={failure.busy} />;

  return (
    <Products
      productsData={productsData}
      businessTypeSlug={vendorData?.businessDetails?.businessTypeSlug as string}
      productCategories={data}
      branches={branchResults?.data ?? []}
    />
  );
}