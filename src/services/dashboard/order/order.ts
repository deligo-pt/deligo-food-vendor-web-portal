"use server";

import { serverRequest } from "@/lib/serverFetch";
import { ORDER_STATUS } from "@/src/consts/order.const";
import { catchAsync } from "@/src/utils/catchAsync";

export const updateOrderStatusReq = async (
  id: string,
  type: keyof typeof ORDER_STATUS,
  reason?: string
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
