import { serverRequest } from "@/lib/serverFetch";
import Products from "@/src/components/Dashboard/Products/Products";
import { getProfileData } from "@/src/services/dashboard/profile/profile.service";
import { TMeta } from "@/src/types";
import { TProduct, TProductsQueryParams } from "@/src/types/product.type";
import { TTax } from "@/src/types/tax.type";
import { TVendor } from "@/src/types/vendor.type";
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

  let vendorData: TVendor | null = null;
  const productsData: { data: TProduct[]; meta?: TMeta } = { data: [] };
  const taxesData: { data: TTax[]; meta?: TMeta } = { data: [] };

  try {
    vendorData = await getProfileData();

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

    const [productsResult, taxesResult] = await Promise.all([
      serverRequest.get("/products", { params: query }),
      serverRequest.get("/taxes"),
    ]);


    if (productsResult?.success) {
      productsData.data = productsResult.data;
      productsData.meta = productsResult.meta;
    }

    if (taxesResult?.success) {
      taxesData.data = taxesResult?.data || [];
      taxesData.meta = taxesResult?.meta;
    }

  } catch (err) {
    console.log("Server Page Data Fetch Error:", err);

    if (isRedirectError(err)) {
      throw err;
    }
  }

  return (
    <Products
      productsData={productsData}
      businessType={(vendorData?.businessDetails?.businessType as string) || ""}
    />
  );
}