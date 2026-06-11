"use server";

import { serverRequest } from "@/lib/serverFetch";
import { DEVICE_KEY } from "@/src/consts/device.const";
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

export const resendOtpReq = async (data: { email: string, role: "VENDOR", }) => {
  return catchAsync<null>(async () => {
    return await serverRequest.post("/auth/resend-otp", {
      data,
    });
  });
};

export const verifyOtpReq = async (data: {
  email: string;
  otp: string;
  role: "VENDOR";
  deviceDetails: TDeviceDetails;
}) => {
  return catchAsync<{ accessToken: string; refreshToken: string }>(async () => {
    return await serverRequest.post("/auth/verify-otp", {
      data,
    });
  });
};

export const logoutReq = async () => {
  const deviceId = (await cookies()).get(DEVICE_KEY)?.value || "";
  return catchAsync<null>(async () => {
    return await serverRequest.post("/auth/logout", {
      data: { deviceId },
    });
  });
};

export const updateFcmTockenReq = async (data: {
  token: string;
  deviceId: string;
}) => {
  return catchAsync<{ accessToken: string; refreshToken: string }>(async () => {
    return await serverRequest.post("/auth/update-fcm-token", {
      data,
    });
  });
};
