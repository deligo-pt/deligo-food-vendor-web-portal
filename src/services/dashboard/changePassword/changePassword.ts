"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TResponse } from "@/src/types";

export const changePasswordReq = async (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  const result = (await serverRequest.post("/auth/change-password", {
    data,
  })) as TResponse<null>;

  return result;
};
