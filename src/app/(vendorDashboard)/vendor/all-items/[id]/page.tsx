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

  const loadProduct = async (): Promise<TProduct> => {
    try {
      const result = (await serverRequest.get(
        `/products/${id}`, {
        headers: { "Accept-Language": lang }
      }
      )) as TResponse<TProduct>;

      if (result?.success) return result.data;
    } catch (err) {
      console.log("Server fetch error:", err);
      if (isRedirectError(err)) throw err;
    }
    return {} as TProduct;
  };

  // Side by side rather than one after another: the product doesn't depend on
  // the vendor, and the branches need only its id. The vendor itself comes from
  // the request cache the layout filled.
  const loadBranches = async () => {
    const vendorData: TVendor = await getProfileData();
    return { vendorData, branchResults: await getAllBranches(vendorData?.userId, undefined, { cached: true }) };
  };

  const [{ vendorData, branchResults }, initialData] = await Promise.all([loadBranches(), loadProduct()]);

  return (
    <ProductDetails
      product={initialData}
      businessTypeSlug={vendorData?.businessDetails?.businessTypeSlug as string}
      branches={branchResults.data}
    />
  );
}
