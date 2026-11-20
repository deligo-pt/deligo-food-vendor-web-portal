"use server";

import { serverRequest } from "@/lib/serverFetch";
import { catchAsync } from "@/src/utils/catchAsync";
import { REFRESH_TOKEN_COOKIE } from "@/src/utils/refreshTokenCookie";
import { cookies } from "next/headers";

export const changePasswordReq = async (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  const result = await catchAsync<null>(async () => {
    return await serverRequest.post("/auth/change-password", {
      data,
    });
  });
  // The backend ends every session when the password changes; the panel's
  // own cookies go too (the refresh token's is httpOnly — only the server
  // can remove it).
  if (result.success) {
    const cookieStore = await cookies();
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
    cookieStore.delete("accessToken");
  }
  return result;
};
