"use server";

import { verifyJWT } from "@/src/utils/verifyJWT";
import { cookies } from "next/headers";
import { refreshTokenFrom } from "@/src/utils/refreshTokenCookie";

const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export const getNewAccessToken = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value || "";

  const decoded = await verifyJWT(refreshToken, true);

  if (!decoded?.success || decoded?.data?.role !== "VENDOR") {
    return null;
  };

  try {
    const response = await fetch(
      `${backendUrl}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          cookie: `refreshToken=${refreshToken}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    return {
      accessToken: result?.data?.accessToken,
      // A new refresh token, if the backend rotated it — in the body or, since
      // 17 Nov 2026, its httpOnly Set-Cookie. The proxy keeps it.
      refreshToken: refreshTokenFrom(response, result),
    };
  } catch {
    return null;
  }
};
