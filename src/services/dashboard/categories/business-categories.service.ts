"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TBusinessCategory } from "@/src/types/category.type";
import { catchAsync } from "@/src/utils/catchAsync";

export const getAllBusinessCategories = async () => {
    return catchAsync<TBusinessCategory[]>(async () => {
        return await serverRequest.get("/categories/businessCategory");
    });
};
