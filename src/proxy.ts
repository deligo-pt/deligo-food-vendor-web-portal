import { USER_ROLE, USER_STATUS } from "@/src/consts/user.const";
import { NextRequest, NextResponse } from "next/server";
import { getNewAccessToken } from "./utils/getNewAccessToken";
import { verifyJWT } from "./utils/verifyJWT";

const PUBLIC_AUTH_PATHS = [
  "/login",
  "/become-vendor",
  "/become-vendor/verify-otp",
];

const PROTECTED_REGISTRATION_PATHS = [
  "/become-vendor/personal-details",
  "/become-vendor/business-details",
  "/become-vendor/business-location",
  "/become-vendor/bank-details",
  "/become-vendor/document-image-details",
  "/become-vendor/registration-status",
];

export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Skip Server Actions & POST requests (critical for forms)
  if (
    req.headers.get("next-action") ||
    req.headers.get("content-type")?.includes("text/x-component") ||
    req.method === "POST"
  ) {
    return NextResponse.next();
  }

  // 1. Handle the explicit clear session flag safely
  if (pathname === "/login" && searchParams.get("clearSession") === "true") {
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("redirect", pathname);

  let decodedData = null;
  let isTokenRefreshed = false;
  let newAccessTokenValue = "";

  // === Token Verification & Silent Refresh ===
  if (accessToken) {
    const decoded = await verifyJWT(accessToken);

    if (decoded.success) {
      decodedData = decoded.data;
    } else if (decoded?.reason === "jwt expired" && refreshToken) {
      // Attempt to retrieve a new token if the old one expired
      const newAccessTokenResponse = await getNewAccessToken();
      const newAccessToken =
        typeof newAccessTokenResponse === "string"
          ? newAccessTokenResponse
          : newAccessTokenResponse?.accessToken;

      if (newAccessToken) {
        const verified = await verifyJWT(newAccessToken);
        if (verified.success) {
          decodedData = verified.data;
          newAccessTokenValue = newAccessToken;
          isTokenRefreshed = true;
        }
      }
    }
  }

  // === Case 1: No Token (or Refresh Failed / Invalid Token) ===
  if (!decodedData) {
    if (PUBLIC_AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(path))) {
      return NextResponse.next();
    }

    // Protect vendor and registration routes
    if (pathname.startsWith("/vendor") || PROTECTED_REGISTRATION_PATHS.some((p) => pathname.startsWith(p))) {
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
    return NextResponse.next();
  }

  // === Case 2: Token Exists / Decoded Successfully ===
  const { role, status } = decodedData;

  // Helper helper to create responses that preserve the refreshed cookie state if needed
  const createResponse = (redirectUrl?: URL) => {
    const res = redirectUrl ? NextResponse.redirect(redirectUrl) : NextResponse.next();
    if (isTokenRefreshed && newAccessTokenValue) {
      res.cookies.set({
        name: "accessToken",
        value: newAccessTokenValue,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }
    return res;
  };

  // Enforce correct role
  if (role !== USER_ROLE.VENDOR) {
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  // Redirect Logged-in Users from Public Auth Paths
  if (PUBLIC_AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(path))) {
    if (status === USER_STATUS.APPROVED) {
      return createResponse(new URL("/vendor/dashboard", req.url));
    }
    // Still in registration flow, let them continue to setup
    return createResponse();
  }

  // Block non-approved users from dashboard
  if (pathname.startsWith("/vendor") && status !== USER_STATUS.APPROVED) {
    return createResponse(new URL("/become-vendor/registration-status", req.url));
  }

  // Handle protected registration path flows
  if (PROTECTED_REGISTRATION_PATHS.some((p) => pathname.startsWith(p))) {
    if (status === USER_STATUS.APPROVED) {
      return createResponse(new URL("/vendor/dashboard", req.url));
    } else if (status === USER_STATUS.PENDING) {
      return createResponse();
    } else {
      if (pathname === "/become-vendor/registration-status") {
        return createResponse();
      } else {
        return createResponse(new URL("/become-vendor/registration-status", req.url));
      }
    }
  }

  return createResponse();
}

export const config = {
  matcher: [
    "/login",
    "/become-vendor/:path*",
    "/vendor/:path*",
  ],
};