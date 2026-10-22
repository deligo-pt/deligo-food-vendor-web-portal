"use server";

import { serverFetch } from "@/lib/serverFetch";
import { TProductCategory, TProductCategoryReorder } from "@/src/types/category.type";
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
// With no query, every category: the API's default page is 10, and a vendor
// with 11 lost the 11th from All Items and from the product forms' picker. The
// category management page passes its own paging.
// Inactive categories are left out unless `includeInactive` is set: All Items,
// the product forms and the bulk price pages must not offer a category the
// vendor has switched off. Only the management page needs them, to switch one
// back on.
// `fresh` skips the cache. "Arrange order" sends a move as a place in this
// list, so it must be the order the API has now: an admin, or the vendor in
// another tab, may have changed it since the cache was filled.
export const getAllProductCategoriesReq = async (
  query?: string,
  options?: { includeInactive?: boolean; fresh?: boolean },
) => {
  const result = await catchAsync(async () => {
    const response = await serverFetch.get(
      `/product-categories?${query || "limit=500"}`,
      options?.fresh
        ? { cache: "no-store" }
        : {
          next: {
            revalidate: CACHE_SECONDS.lists,
            tags: [CACHE_TAGS.productCategories]
          }
        },
    );

    return await response.json();
  });

  // The API still lists soft-deleted categories to their vendor; a soft delete
  // takes one out of the dashboard, so it is dropped here for every consumer
  // (the list page and the product forms' picker).
  if (result.success && Array.isArray(result.data)) {
    result.data = result.data.filter(
      (c: TProductCategory) => !c.isDeleted && (options?.includeInactive || c.isActive),
    );
  }

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

// move one category to a new place in the vendor's order
// `newOrder` is 1-based and counts the categories that aren't deleted, inactive
// ones included: the list the management page shows. The API shifts the rest
// itself, so only the moved category is sent. It caps `newOrder` at the number
// of *active* categories (backend bug, 22 Oct 2026), so the answer's
// `displayOrder` can be smaller than what was asked.
export const reorderProductCategoryReq = async (categoryId: string, newOrder: number) => {
  const result = await catchAsync<TProductCategoryReorder>(async () => {
    const response = await serverFetch.patch("/product-categories/reorder", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoryId, newOrder }),
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
