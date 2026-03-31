"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TMeta } from "@/src/types";
import {
  TIngredient,
  TIngredientOrder,
  TIngredientOrderPayload,
  TIngredientPaymentIntentPayload,
} from "@/src/types/ingredient.type";
import { catchAsync } from "@/src/utils/catchAsync";

/* ==================
  INGREDIENTS
  ================== */

export const getSingleIngredientReq = async (id: string) => {
  const result = await catchAsync<TIngredient>(async () => {
    return await serverRequest.get(`/ingredients/${id}`);
  });

  if (result?.success) return result.data;

  return {};
};

export const getAllIngredientsReq = async (
  queries: Record<string, string | undefined>,
) => {
  const limit = Number(queries?.limit || 10);
  const page = Number(queries.page || 1);
  const searchTerm = queries.searchTerm || "";
  const sortBy = queries.sortBy || "-createdAt";

  const params = {
    limit,
    page,
    sortBy,
    ...(searchTerm ? { searchTerm: searchTerm } : {}),
  };

  const result = await catchAsync<{ data: TIngredient[]; meta: TMeta }>(
    async () => {
      return await serverRequest.get("/ingredients", {
        params,
      });
    },
  );

  if (result?.success)
    return {
      data: result.data,
      meta: result.meta,
    };

  return {
    data: [],
  };
};

/* ==================
  INGREDIENT ORDERS
  ================== */

export const createIngredientPaymentIntentReq = async (
  data: TIngredientPaymentIntentPayload,
) => {
  return await catchAsync<{ paymentToken: string; redirectUrl: string }>(
    async () => {
      return await serverRequest.post(
        "/payment/ingredient/create-payment-intent",
        { data },
      );
    },
  );
};

export const createIngredientOrderReq = async (
  data: TIngredientOrderPayload,
) => {
  return await catchAsync<TIngredient>(async () => {
    return await serverRequest.post("/ingredients-order", { data });
  });
};

export const getSingleIngredientOrderReq = async (id: string) => {
  const result = await catchAsync<TIngredientOrder>(async () => {
    return await serverRequest.get(`/ingredients-order/${id}`);
  });

  if (result?.success) return result.data;

  return {};
};

export const getMyIngredientOrdersReq = async (
  queries: Record<string, string | undefined>,
) => {
  const limit = Number(queries?.limit || 10);
  const page = Number(queries.page || 1);
  const searchTerm = queries.searchTerm || "";
  const sortBy = queries.sortBy || "-createdAt";

  const params = {
    limit,
    page,
    sortBy,
    ...(searchTerm ? { searchTerm: searchTerm } : {}),
  };

  const result = await catchAsync<{ data: TIngredientOrder[]; meta: TMeta }>(
    async () => {
      return await serverRequest.get("/ingredients-order/vendor/my-orders", {
        params,
      });
    },
  );

  if (result?.success)
    return {
      data: result.data,
      meta: result.meta,
    };

  return {
    data: [],
  };
};
