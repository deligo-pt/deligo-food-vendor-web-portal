"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TConversation, TMessage } from "@/src/types/chat.type";
import { catchAsync } from "@/src/utils/catchAsync";

export const openConversationReq = async () => {
  return catchAsync<TConversation>(async () => {
    return await serverRequest.post("/support/conversation");
  });
};

export const getAllAdminConversationsReq = async () => {
  return catchAsync<TConversation[]>(async () => {
    return await serverRequest.get("/support/conversations", {
      params: { type: "VENDOR_CHAT" },
    });
  });
};

export const getMessagesByRoomReq = async (room: string, limit = 50) => {
  return catchAsync<TMessage[]>(async () => {
    return await serverRequest.get(`/support/conversations/${room}/messages`, {
      params: { limit },
    });
  });
};

export const getUnreadCountReq = async () => {
  return catchAsync<number>(async () => {
    return await serverRequest.get("/support/unread-count");
  });
};
