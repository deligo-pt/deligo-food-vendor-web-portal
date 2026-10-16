import Products from "@/src/components/Dashboard/Products/Products";
import PageLoadError from "@/src/components/PageLoadError/PageLoadError";
import { getAllBranches } from "@/src/services/dashboard/branch/branch.service";
import { getAllProductCategoriesReq } from "@/src/services/dashboard/categories/product-categories";
import {
  getCatalogueCounts,
  getCategoryProductsPage,
} from "@/src/services/dashboard/products/products";
import { getProfileData } from "@/src/services/dashboard/profile/profile.service";
import { TProductCategory } from "@/src/types/category.type";
import { TVendor } from "@/src/types/vendor.type";
import { orderCategories, type TCatalogueFilters } from "@/src/utils/catalogueSections";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

/**
 * All Items: every category in the box, products loaded a category at a time
 * as the vendor scrolls (see `utils/catalogueSections.ts`). This used to load
 * the first 20 products and stop.
 *
 * The server does what the first screen needs: the categories, the
 * catalogue's total, and the first page of the first category. Everything
 * else, each category's count included, is loaded by `Products` as it comes
 * into view.
 */
export default async function ProductsPage({ searchParams }: IProps) {
  const queries = (await searchParams) || {};
  const lang = queries.lang === "pt" ? "pt" : "en";

  // Categories don't depend on anything, so they start right away. The vendor
  // comes from the request cache the layout has already filled.
  const categoriesPromise = getAllProductCategoriesReq();
  const vendorData = (await getProfileData()) as TVendor;

  const availability =
    (vendorData?.businessDetails?.businessType === "RESTAURANT" && queries.status) || "";

  const filters: TCatalogueFilters = {
    lang,
    sortBy: queries.sortBy || "-createdAt",
    ...(queries.searchTerm ? { searchTerm: queries.searchTerm } : {}),
    ...(availability ? { availability } : {}),
    ...(queries.sdr === "only" ? { sdrOnly: true } : {}),
  };

  const [{ data }, branchResults] = await Promise.all([
    categoriesPromise,
    vendorData?.userId ? getAllBranches(vendorData.userId, undefined, { cached: true }) : null,
  ]);
  const categories: TProductCategory[] = data ?? [];

  // Only the catalogue's total up front, for "Select all products". Each
  // category's own count arrives with its first page, as the vendor scrolls to
  // it; the 11-odd count requests this used to make were most of the wait.
  const sections = orderCategories(categories, lang);
  const firstId = sections[0]?._id;
  const [{ total }, firstPage] = await Promise.all([
    getCatalogueCounts([], filters),
    firstId ? getCategoryProductsPage(firstId, 1, filters) : null,
  ]);
  // The catalogue's own count failing means the backend is not answering (a
  // 429, most likely); a page of empty categories would read as real.
  if (total === undefined) return <PageLoadError busy />;

  return (
    <Products
      // A new search, sort or filter starts the list again from the top.
      key={JSON.stringify(filters)}
      businessTypeSlug={vendorData?.businessDetails?.businessTypeSlug as string}
      productCategories={categories}
      branches={branchResults?.data ?? []}
      filters={filters}
      catalogue={{
        total,
        categoryIds: sections.map((category) => category._id),
        first:
          firstId && firstPage?.success
            ? { categoryId: firstId, data: firstPage.data, total: firstPage.total }
            : null,
      }}
    />
  );
}
