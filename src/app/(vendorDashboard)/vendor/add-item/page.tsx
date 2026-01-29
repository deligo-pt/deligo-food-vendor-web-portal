export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import { ProductForm } from "@/src/components/Dashboard/Products/ProductForm";
import { TResponse } from "@/src/types";
import { TAddonGroup } from "@/src/types/add-ons.type";
import { TProductCategory } from "@/src/types/category.type";
import { TTax } from "@/src/types/tax.type";

export default async function AddItemPage() {
  let productCategoriesData: TProductCategory[] = [];
  let addonGroupsData: TAddonGroup[] = [];
  let taxesData: TTax[] = [];

  try {
    const result = (await serverRequest.get(
      "/categories/productCategory",
    )) as TResponse<{ data: TProductCategory[] }>;

    if (result?.success) {
      productCategoriesData = result?.data?.data || [];
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  try {
    const result = (await serverRequest.get("/add-ons")) as TResponse<{
      data: TAddonGroup[];
    }>;

    if (result?.success) {
      addonGroupsData = result?.data?.data || [];
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  try {
    const result = (await serverRequest.get("/taxes")) as TResponse<{
      data: TTax[];
    }>;

    if (result?.success) {
      taxesData = result?.data?.data || [];
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  return (
    <ProductForm
      productCategories={productCategoriesData}
      addonGroupsData={addonGroupsData}
      taxesData={taxesData}
    />
  );
}
