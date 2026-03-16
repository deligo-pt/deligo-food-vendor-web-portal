"use server";

import { serverRequest } from "@/lib/serverFetch";
import { catchAsync } from "@/src/utils/catchAsync";
import { getDeviceInfo } from "@/src/utils/getDeviceInfo";

export const loginReq = async ({
  email,
  password,
  forceLogin = false,
}: {
  email: string;
  password: string;
  forceLogin?: boolean;
}) => {
  const deviceDetails = await getDeviceInfo();

  console.log("device", deviceDetails);

  const data = {
    email,
    password,
    deviceDetails,
    forceLogin,
  };

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
