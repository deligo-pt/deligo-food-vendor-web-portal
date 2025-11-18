"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TResponse } from "@/src/types";

export const forgotPasswordReq = async (data: { email: string }) => {
  try {
    const result = (await serverRequest.post("auth/forgot-password", {
      data,
    })) as TResponse<null>;

    return result;
  } catch (err) {
    console.error("Server fetch error:", err);
    return false;
  }
};

export const resetPasswordReq = async (data: {
  email: string;
  newPassword: string;
  token: string;
}) => {
  try {
    const result = (await serverRequest.post("auth/reset-password", {
      data,
    })) as TResponse<null>;

    return result;
  } catch (err) {
    console.error("Server fetch error:", err);
    return false;
  }
};
