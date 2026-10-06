"use server";

import { serverFetch, serverRequest } from "@/lib/serverFetch";
import {
  TCopyProductsInput,
  TProduct,
  TProductCopyResult,
} from "@/src/types/product.type";
import { buildCopyPayload } from "@/src/utils/productCopy";
import { catchAsync } from "@/src/utils/catchAsync";
import {
  CATALOGUE_PAGE_SIZE,
  catalogueQuery,
  isOrphan,
  type TCatalogueFilters,
} from "@/src/utils/catalogueSections";
import { revalidatePath, revalidateTag } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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

/**
 * Copy products to approved branches.
 *
 * Replaces `copyProductToBranchReq`, which posted to
 * `/products/:productId/copy-to-branch` — a route that does not exist and
 * answered 404 on every attempt, which is why the dialog never worked.
 *
 * The body is built by `buildCopyPayload` so the endpoint's exclusive pairs
 * cannot both be sent; see `src/utils/productCopy.ts` for which id belongs in
 * which field.
 */
export const copyProductsToBranchesReq = async (input: TCopyProductsInput) => {
  const payload = buildCopyPayload(input);

  const result = await catchAsync<TProductCopyResult>(async () => {
    const response = await serverFetch.post(`/products/copy-to-sub-vendors`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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

/**
 * Every product matching `query`, across all pages.
 *
 * `/products` answers 10 per page when no `limit` is given. The price pages
 * asked without one, so a vendor with 13 products saw 10, and the rest weren't
 * shown or mentioned anywhere (Tasca, 3 Oct 2026: `meta.total: 13`,
 * `totalPage: 2`). This reads 100 at a time until `meta.totalPage`. A page that
 * fails ends the read with what was fetched so far, rather than throwing the
 * whole list away.
 */
export const getEveryProduct = async (query: Record<string, string> = {}) => {
  const PAGE_SIZE = 100;
  const products: TProduct[] = [];

  for (let page = 1; ; page++) {
    const params = new URLSearchParams({ ...query, limit: String(PAGE_SIZE), page: String(page) });
    const result = await catchAsync<TProduct[]>(async () => {
      const response = await serverFetch.get(`/products?${params.toString()}`, {
        next: { tags: ["products"] },
      });
      return await response.json();
    });

    if (!result.success) return { success: page > 1, data: products };
    products.push(...((result.data as TProduct[]) || []));

    const totalPage = Number(result.meta?.totalPage) || 1;
    if (page >= totalPage) return { success: true, data: products };
  }
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


// ---------------------------------------------------------------------------
// All Items, a category at a time (see `utils/catalogueSections.ts`).
//
// Server actions rather than browser requests: after `proxy.ts` refreshes it,
// the access token is httpOnly, so the browser can't send it, and the client
// axios would get a 401 and log the vendor out. These run with the server's
// cookies.
// ---------------------------------------------------------------------------

type TPageResult =
  | { success: true; data: TProduct[]; total: number }
  | { success: false; message: string; busy: boolean };

const failure = (error: unknown): { success: false; message: string; busy: boolean } => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const e = error as any;
  return {
    success: false,
    message: e?.response?.data?.message || e?.message || "Request failed",
    busy: e?.response?.status === 429,
  };
};

/** Count requests sent together. */
const COUNT_BATCH = 6;

/** One page of one category's products, with the page's filters. */
export const getCategoryProductsPage = async (
  categoryId: string,
  page: number,
  filters: TCatalogueFilters,
): Promise<TPageResult> => {
  try {
    const result = await serverRequest.get("/products", {
      params: catalogueQuery(filters, { category: categoryId, page, limit: CATALOGUE_PAGE_SIZE }),
      headers: { "Accept-Language": filters.lang || "en" },
    });
    return { success: true, data: result?.data ?? [], total: Number(result?.meta?.total) || 0 };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return failure(error);
  }
};

/**
 * How many products each category has, and the catalogue's total, for the
 * current filters: the category box needs them before anything is loaded.
 * One `limit=1` request per category, `COUNT_BATCH` at a time (the total
 * alongside the first batch), so a vendor with many categories doesn't trip
 * the rate limit. A count that fails is `undefined`
 * and its category is left out.
 */
export const getCatalogueCounts = async (
  categoryIds: string[],
  filters: TCatalogueFilters,
): Promise<{ total: number | undefined; counts: Record<string, number | undefined> }> => {
  const countOf = async (extra: Record<string, string | number>) => {
    try {
      const result = await serverRequest.get("/products", {
        params: catalogueQuery(filters, { ...extra, page: 1, limit: 1 }),
        headers: { "Accept-Language": filters.lang || "en" },
      });
      return Number(result?.meta?.total) || 0;
    } catch (error) {
      if (isRedirectError(error)) throw error;
      return undefined;
    }
  };

  const counts: Record<string, number | undefined> = {};
  const totalPromise = countOf({});
  for (let i = 0; i < categoryIds.length; i += COUNT_BATCH) {
    const batch = categoryIds.slice(i, i + COUNT_BATCH);
    const values = await Promise.all(batch.map((id) => countOf({ category: id })));
    batch.forEach((id, index) => (counts[id] = values[index]));
  }
  return { total: await totalPromise, counts };
};

/**
 * Products in none of the vendor's own categories, for the trailing "Other"
 * section. The API can't ask for "not in these", so the catalogue is scanned
 * with a small projection, 100 at a time, and only the leftovers are fetched
 * in full.
 */
export const getOtherProducts = async (
  ownedCategoryIds: string[],
  filters: TCatalogueFilters,
): Promise<TPageResult> => {
  try {
    const owned = new Set(ownedCategoryIds);
    const orphans: string[] = [];
    for (let page = 1; ; page++) {
      const result = await serverRequest.get("/products", {
        params: catalogueQuery(filters, {
          page,
          limit: 100,
          fields: "_id,productId,category,additionalCategories",
        }),
      });
      for (const product of (result?.data ?? []) as TProduct[]) {
        if (isOrphan(product, owned) && product.productId) orphans.push(product.productId);
      }
      if (page >= (Number(result?.meta?.totalPage) || 1)) break;
    }

    const data: TProduct[] = [];
    for (const productId of orphans) {
      const result = await serverRequest.get(`/products/${productId}`, {
        headers: { "Accept-Language": filters.lang || "en" },
      });
      if (result?.data) data.push(result.data as TProduct);
    }
    return { success: true, data, total: data.length };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return failure(error);
  }
};
