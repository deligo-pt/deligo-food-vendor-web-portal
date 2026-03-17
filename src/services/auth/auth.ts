"use server";

import { serverRequest } from "@/lib/serverFetch";
import { catchAsync } from "@/src/utils/catchAsync";
import { cookies } from "next/headers";

type TDeviceDetails = {
  deviceId: string;
  deviceType: string;
  deviceName: string;
  userAgent: string;
};

export const loginReq = async (data: {
  email: string;
  password: string;
  forceLogin?: boolean;
  deviceDetails: TDeviceDetails;
}) => {
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

export const verifyOtpReq = async (data: {
  email: string;
  otp: string;
  deviceDetails: TDeviceDetails;
}) => {
  return catchAsync<{ accessToken: string; refreshToken: string }>(async () => {
    return await serverRequest.post("/auth/verify-otp", {
      data,
    });
  });
};

export const logoutReq = async (data: { email: string; token: string }) => {
  const deviceId =
    (await cookies()).get("deligo-food-vendor-deviceId")?.value || "";
  return catchAsync<null>(async () => {
    return await serverRequest.post("/auth/logout", {
      data: { ...data, deviceId },
    });
  });
};
