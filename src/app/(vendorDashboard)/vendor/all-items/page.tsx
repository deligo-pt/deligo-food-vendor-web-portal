import { serverRequest } from "@/lib/serverFetch";
import Products from "@/src/components/Dashboard/Products/Products";
import { getProfileData } from "@/src/services/dashboard/profile/profile.service";
import { TMeta, TResponse } from "@/src/types";
import { TProduct, TProductsQueryParams } from "@/src/types/product.type";
import { TTax } from "@/src/types/tax.type";
import { TVendor } from "@/src/types/vendor.type";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function ProductsPage({ searchParams }: IProps) {
  const vendorData: TVendor = await getProfileData();

  const queries = (await searchParams) || {};
  const limit = Number(queries?.limit || 20);
  const page = Number(queries.page || 1);
  const searchTerm = queries.searchTerm || "";
  const sortBy = queries.sortBy || "-createdAt";
  const availability =
    (vendorData?.businessDetails?.businessType === "RESTAURANT" &&
      queries.status) ||
    "";

  const query: Partial<TProductsQueryParams> = {
    limit,
    page,
    sortBy,
    ...(searchTerm ? { searchTerm: searchTerm } : {}),
    ...(availability ? { "stock.availabilityStatus": availability } : {}),
  };

  const productsData: { data: TProduct[]; meta?: TMeta } = { data: [] };
  const taxesData: { data: TTax[]; meta?: TMeta } = { data: [] };

  try {
    const result = (await serverRequest.get("/products", {
      params: query,
    })) as TResponse<TProduct[]>;

    if (result?.success) {
      productsData.data = result.data;
      productsData.meta = result.meta;
    }
  } catch (err) {
    console.log("Server fetchProducts error:", err);
    if (isRedirectError(err)) throw err;
  }

  try {
    const result = (await serverRequest.get("/taxes")) as TResponse<{
      data: TTax[];
      meta?: TMeta;
    }>;

    if (result?.success) {
      taxesData.data = result.data?.data;
      taxesData.meta = result.data?.meta;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
    if (isRedirectError(err)) throw err;
  }

  return (
    <Products
      productsData={productsData}
      businessType={vendorData?.businessDetails?.businessType as string}
    />
  );
}
