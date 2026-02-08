"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TProduct } from "@/src/types/product.type";
import { catchAsync } from "@/src/utils/catchAsync";

export const getAllProductsReq = async ({ limit = 10 }) => {
  return catchAsync<TProduct[]>(async () => {
    return await serverRequest.get("/products", {
      params: { limit },
    });
  });
};

export const deleteProductReq = async (id: string) => {
  return catchAsync<null>(async () => {
    return await serverRequest.delete(`/products/soft-delete/${id}`);
  });
};

export const updateStockPriceReq = async (
  id: string,
  stock: {
    addedQuantity?: number;
    reduceQuantity?: number;
    newPrice?: number;
    variationSku?: string;
  },
) => {
  return catchAsync<null>(async () => {
    return await serverRequest.patch(
      `/products/update-inventory-and-pricing/${id}`,
      {
        data: stock,
      },
    );
  });
};
