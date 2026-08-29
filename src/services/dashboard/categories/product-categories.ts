"use server";

import { serverFetch } from "@/lib/serverFetch";
import { TProductCategory } from "@/src/types/category.type";
import { catchAsync } from "@/src/utils/catchAsync";
import { revalidatePath, revalidateTag } from "next/cache";

// create product categories
export const addProductCategoryReq = async (payload: Partial<TProductCategory>) => {
  const result = await catchAsync(async () => {
    const response = await serverFetch.post("/product-categories", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await response.json();
  });

  if (result.success) {
    revalidateTag("product-categories", {});
    revalidatePath("/vendor/product-categories/all");
  }

  return result;
};

// get all categories
export const getAllProductCategoriesReq = async (query?: string) => {
  const result = await catchAsync(async () => {
    const response = await serverFetch.get(`/product-categories${query ? `?${query}` : ""}`, {
      next: {
        tags: ["product-categories"]
      }
    });

    return await response.json();
  });

  return result;
};

// update category
export const updateProductCategory = async (payload: Partial<TProductCategory>, categoryId: string) => {
  const result = await catchAsync(async () => {
    const response = await serverFetch.patch(`/product-categories/${categoryId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await response.json();
  });

  if (result.success) {
    revalidateTag("product-categories", {});
    revalidatePath("/vendor/product-categories/all");
  }

  return result;
};


// soft delete category
export const softDeleteProductCategory = async (id: string) => {
  const result = await catchAsync(async () => {
    const response = await serverFetch.delete(`/product-categories/soft-delete/${id}`, {
      next: {
        tags: ["product-categories"]
      }
    });

    return await response.json();
  });

  return result;
};

// permanent delete category
export const permanentDeleteProductCategory = async (id: string) => {
  const result = await catchAsync(async () => {
    const response = await serverFetch.delete(`/product-categories/permanent-delete/${id}`, {
      next: {
        tags: ["product-categories"]
      }
    });

    return await response.json();
  });

  return result;
};
