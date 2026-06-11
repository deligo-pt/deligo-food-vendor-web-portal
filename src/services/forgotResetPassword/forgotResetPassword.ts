"use server";

import { serverRequest } from "@/lib/serverFetch";
import { catchAsync } from "@/src/utils/catchAsync";

export const forgotPasswordReq = async (data: { email: string, role: string }) => {
  return catchAsync<null>(async () => {
    return await serverRequest.post("/auth/forgot-password", {
      data,
    });
  });
};

export const resetPasswordReq = async (data: {
  email: string;
  newPassword: string;
  role: string;
  token: string;
}) => {
  return catchAsync<null>(async () => {
    return await serverRequest.post("/auth/reset-password", {
      data,
    });
  });
};
