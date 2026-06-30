import { serverRequest } from "@/lib/serverFetch";
import Categories from "@/src/components/Dashboard/Categories/Categories";
import { TMeta } from "@/src/types";
import { TProductCategoryResponse } from "@/src/types/category.type";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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

  const initialData: { data: TProductCategoryResponse[]; meta?: TMeta } = { data: [] };

  try {
    const result = (await serverRequest.get("/categories/productCategory", {
      params: query,
    }));

    if (result?.success) {
      initialData.data = result?.data;
      initialData.meta = result?.meta;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
    if (isRedirectError(err)) throw err;
  }

  return <Categories categoriesResult={initialData} />;
}
