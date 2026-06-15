"use server";

import { serverRequest } from "@/lib/serverFetch";
import { DEVICE_KEY } from "@/src/consts/device.const";
import { TResponse } from "@/src/types";
import { catchAsync } from "@/src/utils/catchAsync";
import { cookies } from "next/headers";

type TDeviceDetails = {
  deviceId: string;
  deviceType: string;
  deviceName: string;
  userAgent: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1"

export const loginReq = async (data: {
  email: string;
  password: string;
  forceLogin?: boolean;
  deviceDetails: TDeviceDetails;
}) => {
  return catchAsync<{ accessToken: string; refreshToken: string }>(async () => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Failed to login");
    }

    return result;
  });
};

export const resendOtpReq = async (data: { email: string; role: "VENDOR" }) => {
  return catchAsync<null>(async () => {
    const response = await fetch(`${BASE_URL}/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Resend otp failed!");
    }
    return result as TResponse<null>;
  });
};

export const verifyOtpReq = async (data: {
  email: string;
  otp: string;
  role: "VENDOR";
  deviceDetails: TDeviceDetails;
}) => {
  return catchAsync<{ accessToken: string; refreshToken: string }>(async () => {
    const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Verify otp failed!");
    }

    return result;
  });
};

// export const logoutReq = async () => {
//   const deviceId = (await cookies()).get(DEVICE_KEY)?.value || "";
//   // const deviceId = "aksjdofiajsdoifa";
//   return catchAsync<null>(async () => {
//     const result = await serverRequest.post("/auth/logout", {
//       data: { deviceId },
//     });
//     console.log("logut service console", result);
//     return result;
//   });
// };

export const logoutReq = async () => {
  const cookieStore = await cookies();
  const deviceId = cookieStore.get(DEVICE_KEY)?.value || "";

  const cookieStr = cookieStore.toString();
  const accessToken = cookieStore.get("accessToken")?.value || "";

  return catchAsync<null>(async () => {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { authorization: `Bearer ${accessToken}` }),
        ...(cookieStr && { cookie: cookieStr }),
      },
      body: JSON.stringify({
        deviceId
      }
      ),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Logout failed!");
    }

    return result;
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
