"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TCuisine } from "@/src/types/cuisine.type";
import { catchAsync } from "@/src/utils/catchAsync";

export const getAllCuisines = async () => {
    return catchAsync<TCuisine[]>(async () => {
        return await serverRequest.get("/categories/cuisine");
    });
};
