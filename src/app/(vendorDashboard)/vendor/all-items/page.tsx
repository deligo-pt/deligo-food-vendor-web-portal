import { serverRequest } from "@/lib/serverFetch";
import Products from "@/src/components/Dashboard/Products/Products";
import { TMeta, TResponse } from "@/src/types";
import { TProduct, TProductsQueryParams } from "@/src/types/product.type";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function ProductsPage({ searchParams }: IProps) {
  const queries = (await searchParams) || {};
  const limit = Number(queries?.limit || 10);
  const page = Number(queries.page || 1);
  const searchTerm = queries.searchTerm || "";
  const sortBy = queries.sortBy || "-createdAt";
  const availability = queries.status || "";

  const query: Partial<TProductsQueryParams> = {
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
      initialData.data = result.data;
      initialData.meta = result.meta;
    }
  } catch (err) {
    console.error("Server fetchProducts error:", err);
  }

  return <Products initialData={initialData} />;
}
