import { serverRequest } from "@/lib/serverFetch";
import ProductDetails from "@/src/components/Dashboard/Products/ProductDetails";
import { getAllBranches } from "@/src/services/dashboard/branch/branch.service";
import { getProfileData } from "@/src/services/dashboard/profile/profile.service";
import { TResponse } from "@/src/types";
import { TProduct } from "@/src/types/product.type";
import { TVendor } from "@/src/types/vendor.type";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default async function ProductDetailsPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const { lang } = await searchParams;

  let initialData: TProduct = {} as TProduct;

  try {
    const result = (await serverRequest.get(
      `/products/${id}`, {
      headers: { "Accept-Language": lang }
    }
    )) as TResponse<TProduct>;

    if (result?.success) {
      initialData = result.data;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
    if (isRedirectError(err)) throw err;
  }

  const vendorData: TVendor = await getProfileData();
  const branchResults = await getAllBranches(vendorData?.userId);

  return (
    <ProductDetails
      product={initialData}
      businessTypeSlug={vendorData?.businessDetails?.businessTypeSlug as string}
      branches={branchResults.data}
    />
  );
}
