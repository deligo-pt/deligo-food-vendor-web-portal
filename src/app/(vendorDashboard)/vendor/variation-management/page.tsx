import { serverRequest } from "@/lib/serverFetch";
import VariationManagement from "@/src/components/Dashboard/Products/VariationManagement/VariationManagement";
import { TMeta, TResponse } from "@/src/types";
import { TProduct } from "@/src/types/product.type";
import { TVendor } from "@/src/types/vendor.type";
import { getVendorInfo } from "@/src/utils/getVendorInfo";
import { isRedirectError } from "next/dist/client/components/redirect-error";

interface IProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VariationManagementPage({
  searchParams,
}: IProps) {
  const vendorInfo = await getVendorInfo();
  const queries = (await searchParams) || {};
  const limit = Number(queries?.limit || 10);
  const page = Number(queries.page || 1);
  const searchTerm = queries.searchTerm || "";
  const sortBy = queries.sortBy || "-createdAt";
  const availability = queries.status || "";
  const lang = queries.lang || "en";

  const query = {
    limit,
    page,
    sortBy,
    ...(searchTerm ? { searchTerm: searchTerm } : {}),
    ...(availability ? { "stock.availabilityStatus": availability } : {}),
  };

  const initialData: { data: TProduct[]; meta?: TMeta } = { data: [] };

  try {
    const result = (await serverRequest.get("/products", {
      params: query,
      headers: {
        "Accept-Language": lang
      }
    })) as unknown as TResponse<TProduct[]>;

    if (result?.success) {
      initialData.data = result?.data;
      initialData.meta = result?.meta;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
    if (isRedirectError(err)) throw err;
  }

  return <VariationManagement productsData={initialData} vendor={(vendorInfo?.vendor as TVendor) || {}} />;
}
