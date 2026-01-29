"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TProductCategory } from "@/src/types/category.type";
import { catchAsync } from "@/src/utils/catchAsync";

export const getAllProductCategoriesReq = async ({ limit = 10 }) => {
  return catchAsync<TProductCategory[]>(async () => {
    return await serverRequest.get("/categories/productCategory", {
      params: { limit },
    });
  });
};
