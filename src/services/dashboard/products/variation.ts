"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TResponse } from "@/src/types";
import { TProduct } from "@/src/types/product.type";
import { catchAsync } from "@/src/utils/catchAsync";

type LocalizedType = {
  en?: string;
  pt?: string;
};
interface IVariation {
  name: {
    en?: string | undefined;
    pt?: string | undefined;
  };
  options: {
    label: {
      en?: string | undefined;
      pt?: string | undefined;
    };
    price: number;
    stockQuantity: number;
  }[];
}

export const addVariationReq = async (
  productId: string,
  data: Partial<IVariation>,
) => {
  return catchAsync<TProduct>(async () => {
    return await serverRequest.patch(
      `/products/manage-product-variations/${productId}`,
      { data },
    );
  });
};

export const renameVariationReq = async (
  productId: string,
  data: {
    oldName: string;
    newName?: LocalizedType;
    oldLabel?: string;
    newLabel?: LocalizedType;
  },
) => {
  return catchAsync<null>(async () => {
    return await serverRequest.patch(
      `/products/rename-product-variations/${productId}`,
      { data },
    );
  });
};

export const updateVariationPrice = async (
  productId: string,
  data: {
    variationSku: string;
    newPrice: number;
  },
) => {
  return catchAsync<null>(async () => {
    return await serverRequest.patch(
      `/products/update-inventory-and-pricing/${productId}`,
      { data },
    );
  });
};

export const removeVariationReq = async (
  productId: string,
  data: {
    name: string;
    labelToRemove?: string;
  },
) => {
  return catchAsync<null>(async () => {
    return await serverRequest.patch(
      `/products/remove-product-variations/${productId}`,
      { data },
    );
  });
};

/**
 * The vendor's whole catalogue, just what the "Clone variations" picker
 * needs: 500 a page, every page.
 */
export const getProductsForVariationCloneReq = async (lang: "en" | "pt") => {
  return catchAsync<TProduct[]>(async () => {
    const all: TProduct[] = [];
    for (let page = 1; page <= 20; page++) {
      const result = (await serverRequest.get("/products", {
        params: { limit: 500, page, fields: "productId,name,variations,category,image" },
        headers: { "Accept-Language": lang },
      })) as TResponse<TProduct[]>;
      if (!result?.success) return result;
      all.push(...(result.data ?? []));
      if (page >= (result.meta?.totalPage ?? 1) || !result.data?.length) break;
    }
    return { success: true, message: "", data: all } as TResponse<TProduct[]>;
  });
};
