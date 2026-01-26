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

export const updateStockReq = async (
  id: string,
  stock: {
    quantity: number;
    availabilityStatus: string;
  },
) => {
  return catchAsync<null>(async () => {
    const updatedData = { stock };
    const formData = new FormData();
    formData.append("data", JSON.stringify(updatedData));

    return await serverRequest.patch(`/products/${id}`, {
      data: formData,
    });
  });
};
