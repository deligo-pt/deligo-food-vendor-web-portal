"use server";

import { serverFetch } from "@/lib/serverFetch";
import { TProductCategory } from "@/src/types/category.type";
import { catchAsync } from "@/src/utils/catchAsync";
import { CACHE_SECONDS, CACHE_TAGS } from "@/src/consts/cache.const";
import { revalidatePath, updateTag } from "next/cache";

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
    updateTag(CACHE_TAGS.productCategories);
    revalidatePath("/vendor/product-categories/all");
  }

  return result;
};

// get all categories
// Cached per vendor and language (see `cache.const.ts`). Every action in this
// file that changes a category expires it with `updateTag`.
export const getAllProductCategoriesReq = async (query?: string) => {
  const result = await catchAsync(async () => {
    const response = await serverFetch.get(`/product-categories${query ? `?${query}` : ""}`, {
      next: {
        revalidate: CACHE_SECONDS.lists,
        tags: [CACHE_TAGS.productCategories]
      }
    });

    return await response.json();
  });

  return result;
};

// get single menu
export const getSingleProductCategory = async (categoryId: string) => {
  const result = await catchAsync(async () => {
    const response = await serverFetch.get(`/product-categories/${categoryId}`, {
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
    updateTag(CACHE_TAGS.productCategories);
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

  if (result.success) {
    updateTag(CACHE_TAGS.productCategories);
  }

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

  if (result.success) {
    updateTag(CACHE_TAGS.productCategories);
  }

  return result;
};
