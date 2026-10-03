export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import { ProductForm } from "@/src/components/Dashboard/Products/ProductForm";
import { getAllProductCategoriesReq } from "@/src/services/dashboard/categories/product-categories";
// import { getAllMenus } from "@/src/services/dashboard/menu/menu.service";
import { getProfileData } from "@/src/services/dashboard/profile/profile.service";
import { TResponse } from "@/src/types";
import { TAddonGroup } from "@/src/types/add-ons.type";
import { TTax } from "@/src/types/tax.type";
import { TVendor } from "@/src/types/vendor.type";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default async function AddItemPage() {
  // const {data} = await getAllMenus();

  const loadAddons = async (): Promise<TAddonGroup[]> => {
    try {
      const result = (await serverRequest.get("/add-ons")) as TResponse<
        TAddonGroup[]
      >;

      if (result?.success) return result?.data || [];
    } catch (err) {
      console.log("Server fetch error:", err);
      if (isRedirectError(err)) throw err;
    }
    return [];
  };

  const loadTaxes = async (): Promise<TTax[]> => {
    try {
      const result = (await serverRequest.get("/taxes"));

      if (result?.success) return result?.data || [];
    } catch (err) {
      console.log("Server fetch error:", err);
      if (isRedirectError(err)) throw err;
    }
    return [];
  };

  // All four are independent, so they load side by side, not one after
  // another. The vendor comes from the request cache the layout filled.
  const [productCategoriesData, vendorData, addonGroupsData, taxesData] = await Promise.all([
    getAllProductCategoriesReq(),
    getProfileData() as Promise<TVendor>,
    loadAddons(),
    loadTaxes(),
  ]);

  return (
    <ProductForm
      productCategories={productCategoriesData?.data}
      addonGroupsData={addonGroupsData}
      taxesData={taxesData}
      businessTypeSlug={vendorData?.businessDetails?.businessTypeSlug as string}
    // menus={data}
    />
  );
}
