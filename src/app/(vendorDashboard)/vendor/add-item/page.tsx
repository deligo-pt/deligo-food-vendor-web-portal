export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import { ProductForm } from "@/src/components/Dashboard/Products/ProductForm";
import { getProfileData } from "@/src/services/dashboard/profile/profile.service";
import { TResponse } from "@/src/types";
import { TAddonGroup } from "@/src/types/add-ons.type";
import { TProductCategory } from "@/src/types/category.type";
import { TTax } from "@/src/types/tax.type";
import { TVendor } from "@/src/types/vendor.type";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default async function AddItemPage() {
  let productCategoriesData: TProductCategory[] = [];
  let addonGroupsData: TAddonGroup[] = [];
  let taxesData: TTax[] = [];
  const vendorData: TVendor = await getProfileData();

  try {
    const result = (await serverRequest.get(
      "/categories/productCategory",
    ));

    if (result?.success) {
      productCategoriesData = result?.data || [];
    }
  } catch (err) {
    console.log("Server fetch error:", err);
    if (isRedirectError(err)) throw err;
  }

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
      productCategories={productCategoriesData}
      addonGroupsData={addonGroupsData}
      taxesData={taxesData}
      businessType={vendorData?.businessDetails?.businessType as string}
    />
  );
}
