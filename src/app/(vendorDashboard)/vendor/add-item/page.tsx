export const dynamic = "force-dynamic";

import { serverRequest } from "@/lib/serverFetch";
import { ProductForm } from "@/src/components/Dashboard/Products/ProductForm";
import { TResponse } from "@/src/types";
import { TProductCategory } from "@/src/types/category.type";

export default async function AddItemPage() {
  let initialData: TProductCategory[] = [] as TProductCategory[];

  try {
    const result = (await serverRequest.get(
      "categories/productCategory"
    )) as unknown as TResponse<{ data: TProductCategory[] }>;

    if (result?.success) {
      initialData = result?.data?.data || [];
    }
  } catch (err) {
    console.error("Server fetch error:", err);
  }

  return <ProductForm productCategories={initialData} />;
}
