import { serverRequest } from "@/lib/serverFetch";
import Stocks from "@/src/components/Dashboard/StockManagement/Stocks";
import { TMeta, TResponse } from "@/src/types";
import { TProduct } from "@/src/types/product.type";

interface IProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function page({ searchParams }: IProps) {
  const queries = (await searchParams) || {};
  const limit = Number(queries?.limit || 10);
  const page = Number(queries.page || 1);
  const searchTerm = queries.searchTerm || "";
  const sortBy = queries.sortBy || "-createdAt";
  const availability = queries.status || "";

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
    })) as unknown as TResponse<TProduct[]>;

    if (result?.success) {
      initialData.data = result?.data;
      initialData.meta = result?.meta;
    }
  } catch (err) {
    console.error("Server fetch error:", err);
  }

  return <Stocks productsResult={initialData} />;
}
