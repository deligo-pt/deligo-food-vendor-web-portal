export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import ProductImport from "@/src/components/Dashboard/Products/Import/ProductImport";
import { getAllProductCategoriesReq } from "@/src/services/dashboard/categories/product-categories";
import { getProfileData } from "@/src/services/dashboard/profile/profile.service";
import { TProductCategory } from "@/src/types/category.type";
import { TTax } from "@/src/types/tax.type";
import { TVendor } from "@/src/types/vendor.type";
import { isRedirectError } from "next/dist/client/components/redirect-error";

/** Import Items: add many products from a CSV / XLSX file (guide §3). */
export default async function ImportItemsPage() {
  const loadTaxes = async (): Promise<TTax[]> => {
    try {
      const result = await serverRequest.get("/taxes");
      if (result?.success) return result?.data || [];
    } catch (err) {
      console.log("Server fetch error:", err);
      if (isRedirectError(err)) throw err;
    }
    return [];
  };

  const [categories, vendor, taxes] = await Promise.all([
    getAllProductCategoriesReq(),
    getProfileData() as Promise<TVendor>,
    loadTaxes(),
  ]);

  return (
    <ProductImport
      vendorKey={vendor?.userId ?? "vendor"}
      isRestaurant={vendor?.businessDetails?.businessTypeSlug === "restaurant"}
      categories={((categories?.data ?? []) as TProductCategory[])
        .filter((c) => c?.isActive !== false && (c?.name?.en || c?.name?.pt))
        .map((c) => ({ nameEn: c.name?.en ?? "", namePt: c.name?.pt ?? "" }))}
      taxRates={Array.from(
        new Set(taxes.filter((tax) => tax.isActive !== false).map((tax) => Number(tax.taxRate))),
      ).sort((a, b) => b - a)}
    />
  );
}
