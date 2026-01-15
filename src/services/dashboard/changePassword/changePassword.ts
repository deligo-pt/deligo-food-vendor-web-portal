"use server";

import { serverRequest } from "@/lib/serverFetch";
import { catchAsync } from "@/src/utils/catchAsync";

export const changePasswordReq = async (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  return catchAsync<null>(async () => {
    return await serverRequest.post("/auth/change-password", {
      data,
    });
  });
};
