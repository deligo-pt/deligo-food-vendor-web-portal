"use server";

import { serverRequest } from "@/lib/serverFetch";
import { catchAsync } from "@/src/utils/catchAsync";

export const loginReq = async (data: { email: string; password: string }) => {
  return catchAsync<{ accessToken: string; refreshToken: string }>(async () => {
    return await serverRequest.post("/auth/login", {
      data,
    });
  });
};

export const resendOtpReq = async (data: { email: string }) => {
  return catchAsync<null>(async () => {
    return await serverRequest.post("/auth/resend-otp", {
      data,
    });
  });
};

export const verifyOtpReq = async (data: { email: string; otp: string }) => {
  return catchAsync<{ accessToken: string; refreshToken: string }>(async () => {
    return await serverRequest.post("/auth/verify-otp", {
      data,
    });
  });
};
