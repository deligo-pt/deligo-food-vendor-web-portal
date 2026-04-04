"use server";

import { serverRequest } from "@/lib/serverFetch";
import { ORDER_STATUS } from "@/src/consts/order.const";
import { TOrder } from "@/src/types/order.type";
import { catchAsync } from "@/src/utils/catchAsync";

export const updateOrderStatusReq = async (
  id: string,
  type: keyof typeof ORDER_STATUS,
  reason?: string,
) => {
  return catchAsync<null>(async () => {
    return await serverRequest.patch(`/orders/${id}/status`, {
      data: { type, reason },
    });
  });
};

export const orderDispatchReq = async (id: string) => {
  return catchAsync<null>(async () => {
    return await serverRequest.patch(`/orders/${id}/broadcast-order`, {
      data: null,
    });
  });
};

export const getAllOrdersReq = async (
  queries: Record<string, string | undefined>,
) => {
  const limit = Number(queries?.limit || 10);
  const page = Number(queries.page || 1);
  const searchTerm = queries.searchTerm || "";
  const sortBy = queries.sortBy || "-createdAt";
  const orderStatus = queries.orderStatus || "";
  const customerId = queries.customerId || "";

  const params = {
    limit,
    page,
    sortBy,
    ...(searchTerm ? { searchTerm } : {}),
    ...(orderStatus ? { orderStatus } : {}),
    ...(customerId ? { customerId } : {}),
  };

  const result = await catchAsync<TOrder[]>(async () => {
    return await serverRequest.get("/orders", {
      params,
    });
  });

  if (result?.success)
    return {
      data: result.data,
      meta: result.meta,
    };

  return {
    data: [],
  };
};
