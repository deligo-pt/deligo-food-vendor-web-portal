"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TNotification } from "@/src/types/notification.type";
import { catchAsync } from "@/src/utils/catchAsync";

export const getAllNotificationsReq = async ({ limit = 10 }) => {
  return catchAsync<TNotification[]>(async () => {
    return await serverRequest.get("/notifications/my-notifications", {
      params: { limit },
    });
  });
};

export const singleMarkReadReq = async (id: string) => {
  return catchAsync<null>(async () => {
    return await serverRequest.patch(`/notifications/${id}/read`);
  });
};

export const allMarkReadReq = async () => {
  return catchAsync<null>(async () => {
    return await serverRequest.patch("/notifications/mark-all-as-read");
  });
};
