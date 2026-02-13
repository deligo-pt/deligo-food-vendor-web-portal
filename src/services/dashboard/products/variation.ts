"use server";

import { serverRequest } from "@/lib/serverFetch";
import { catchAsync } from "@/src/utils/catchAsync";
import { variationValidation } from "@/src/validations/product/product.validation";
import z from "zod";

type TVariationForm = z.infer<typeof variationValidation>;

export const addVariationReq = async (
  productId: string,
  data: TVariationForm,
) => {
  return catchAsync<null>(async () => {
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
    newName?: string;
    oldLabel?: string;
    newLabel?: string;
  },
) => {
  return catchAsync<null>(async () => {
    return await serverRequest.patch(
      `/products/rename-product-variations/${productId}`,
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
