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

// export const logoutReq = async () => {
//   const deviceId = (await cookies()).get(DEVICE_KEY)?.value || "";
//   return catchAsync<null>(async () => {
//     return await serverRequest.post("/auth/logout", {
//       data: { deviceId },
//     });
//   });
// };

export const logoutReq = async () => {
  // 1. Get cookies on the server
  const cookieStore = await cookies();
  const deviceId = cookieStore.get(DEVICE_KEY)?.value || "";
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const cookieStr = cookieStore.toString();

  return catchAsync<null>(async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Pass the access token in headers
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        // Pass cookie strings if required by your backend session manager
        ...(cookieStr && { Cookie: cookieStr }),
      },
      body: JSON.stringify({ deviceId }),
    });

    // 3. Parse JSON payload
    const data = await response.json();

    // Native fetch doesn't throw on 4xx/5xx errors, so we append the status 
    // to the data object so catchAsync can read it correctly.
    if (!response.ok) {
      return {
        success: false,
        statusCode: response.status,
        ...data,
      };
    }

    return {
      success: true,
      statusCode: response.status,
      ...data,
    };
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
