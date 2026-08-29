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
  const productCategoriesData = await getAllProductCategoriesReq();
  let addonGroupsData: TAddonGroup[] = [];
  let taxesData: TTax[] = [];
  const vendorData: TVendor = await getProfileData();
  // const {data} = await getAllMenus();


  try {
    const result = (await serverRequest.get("/add-ons")) as TResponse<
      TAddonGroup[]
    >;

    if (result?.success) {
      addonGroupsData = result?.data || [];
    }
  } catch (err) {
    console.log("Server fetch error:", err);
    if (isRedirectError(err)) throw err;
  }

  try {
    const result = (await serverRequest.get("/taxes"));

    if (result?.success) {
      taxesData = result?.data || [];
    }
  } catch (err) {
    console.log("Server fetch error:", err);
    if (isRedirectError(err)) throw err;
  }

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
