"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TResponse } from "@/src/types";
import { TConversation } from "@/src/types/chat.type";

export const openConversationReq = async (room: string) => {
  try {
    const result = (await serverRequest.post(
      "/support/conversation"
    )) as TResponse<TConversation>;

    if (result.success) {
      return { success: true, data: result.data, message: result.message };
    }
    return { success: false, data: result.error, message: result.message };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      data: error?.response?.data || null,
      message: error?.response?.data?.message || "Offer creation failed",
    };
  }
};
