"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TConversation } from "@/src/types/chat.type";
import { catchAsync } from "@/src/utils/catchAsync";

export const openConversationReq = async () => {
  return catchAsync<TConversation>(async () => {
    return await serverRequest.post("/support/conversation");
  });
};
