import { serverRequest } from "@/lib/serverFetch";
import Categories from "@/src/components/Dashboard/Categories/Categories";
import { TMeta, TResponse } from "@/src/types";
import { TProductCategory } from "@/src/types/category.type";

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

  const initialData: { data: TProductCategory[]; meta?: TMeta } = { data: [] };

  try {
    const result = (await serverRequest.get("/categories/productCategory", {
      params: query,
    })) as unknown as TResponse<{ data: TProductCategory[]; meta?: TMeta }>;

    if (result?.success) {
      initialData.data = result?.data?.data;
      initialData.meta = result?.data?.meta;
    }
  } catch (err) {
    console.error("Server fetch error:", err);
  }

  return <Categories categoriesResult={initialData} />;
}
