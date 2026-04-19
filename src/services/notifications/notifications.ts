"use server";

import { serverRequest } from "@/lib/serverFetch";
import { catchAsync } from "@/src/utils/catchAsync";

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
