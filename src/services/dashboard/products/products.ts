"use server";

import { serverFetch, serverRequest } from "@/lib/serverFetch";
import { TProduct } from "@/src/types/product.type";
import { catchAsync } from "@/src/utils/catchAsync";
import { revalidatePath, revalidateTag } from "next/cache";

export const getAllProducts = async (query?: string) => {
  const result = await catchAsync(async () => {
    const response = await serverFetch.get(`/products${query ? `?${query}` : ""}`, {
      next: {
        tags: ["products"]
      }
    });

    return await response.json();
  });

  return result;
};

export const applyIncreaseDecrease = async (
  payload: {
    type: "INCREASE" | "DECREASE",
    percentage: number,
    productIds: string[],
  },
) => {
  const result = await catchAsync(async () => {
    const response = await serverFetch.patch(`/products/adjust-price`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await response.json();
  });

  if (result.success) {
    revalidateTag("products", {});
    revalidatePath("/vendor/items/apply-decrease");
    revalidatePath("/vendor/items/apply-increase");
  }

  return result;
};

export const copyProductToBranchReq = async (targetVendorId: string, productId: string) => {
  const result = await catchAsync(async () => {
    const response = await serverFetch.post(`/products/${productId}/copy-to-branch`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetVendorId }),
    });

    return await response.json();
  });

  if (result.success) {
    revalidateTag("products", {});
  }

  return result;
};

export const updateProduct = async (
  productId: string,
  data: Record<string, unknown>
) => {
  const result = await catchAsync(async () => {
    const response = await serverFetch.patch(`/products/${productId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  });

  if (result.success) {
    revalidateTag("products", {});
    revalidatePath("/vendor/items/apply-discount");
  }

  return result;
};

export const getAllProductsReq = async (limit?: number) => {
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

export const generateProductDescriptionReq = async (data: {
  productName: string;
  productCategory: string;
  productImageUrl: string;
  language: string;
}) => {
  return catchAsync<{ description: string }>(async () => {
    return await serverRequest.post("/ai/generate-product-description", {
      data,
    });
  });
};

export const deleteProductImage = async (productId: string, payload: { images: string[] }) => {
  return catchAsync<null>(async () => {
    return await serverRequest.delete(`/products/${productId}/images`, {
      data: payload
    });
  });
};
