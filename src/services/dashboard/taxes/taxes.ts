"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TTax } from "@/src/types/tax.type";
import { catchAsync } from "@/src/utils/catchAsync";

export const getAllTaxesReq = async ({ limit = 10 }) => {
  return catchAsync<TTax[]>(async () => {
    return await serverRequest.get("/taxes", {
      params: { limit },
    });
  });
};
