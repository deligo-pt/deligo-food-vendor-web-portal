"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TResponse } from "@/src/types";
import { TProduct } from "@/src/types/product.type";

export const getAllProductsReq = async ({ limit = 10 }) => {
  try {
    const result = (await serverRequest.get("/products", {
      params: { limit },
    })) as TResponse<TProduct[]>;
    if (result.success) {
      return {
        success: true,
        data: result.data,
        message: result.message,
        meta: result.meta,
      };
    }

    return { success: false, data: result.error, message: result.message };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Server fetch error:", err);
    return {
      success: false,
      data: err?.response?.data || err,
      message: err?.response?.data?.message || "Products retrieve failed",
    };
  }
};
