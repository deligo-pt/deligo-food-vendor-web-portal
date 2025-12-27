"use server";

import { serverRequest } from "@/lib/serverFetch";
import { ORDER_STATUS } from "@/src/consts/order.const";
import { TResponse } from "@/src/types";

export const updateOrderStatusReq = async (
  id: string,
  type: keyof typeof ORDER_STATUS,
  reason?: string
) => {
  try {
    const result = (await serverRequest.patch(`/orders/${id}/status`, {
      data: { type, reason },
    })) as TResponse<null>;

    if (result.success) {
      return {
        success: true,
        data: result.data,
        message: result.message || "Status updated successfully",
      };
    }
    return { success: false, data: result.error, message: result.message };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      data: error?.response?.data || null,
      message: error?.response?.data?.message || "Status update failed",
    };
  }
};
