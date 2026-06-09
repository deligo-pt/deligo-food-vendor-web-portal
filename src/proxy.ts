
import { USER_ROLE, USER_STATUS } from "@/src/consts/user.const";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { TJwtPayload } from "@/src/types";

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
  const { pathname } = req.nextUrl;

  // Skip Server Actions & POST requests (critical for forms)
  if (
    req.headers.get("next-action") ||
    req.headers.get("content-type")?.includes("text/x-component") ||
    req.method === "POST"
  ) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken")?.value;
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("redirect", pathname);

  // === No Token Logic ===
  if (!accessToken) {
    if (PUBLIC_AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(path))) {
      return NextResponse.next();
    }

    // Protect vendor routes
    if (pathname.startsWith("/vendor") || PROTECTED_REGISTRATION_PATHS.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // === Decode JWT (Fast, no network call) ===
  let decoded: TJwtPayload | null = null;
  try {
    decoded = jwtDecode<TJwtPayload>(accessToken);
  } catch (error) {
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  const { role, status } = decoded;

  // Wrong role → logout
  if (role !== USER_ROLE.VENDOR) {
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  // === Redirect Logic for Logged-in Users ===
  if (PUBLIC_AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(path))) {
    if (status === USER_STATUS.APPROVED) {
      return NextResponse.redirect(new URL("/vendor/dashboard", req.url));
    }
    // Still in registration flow
    return NextResponse.next();
  }

  // Block non-approved users from vendor dashboard
  if (pathname.startsWith("/vendor") && status !== USER_STATUS.APPROVED) {
    return NextResponse.redirect(new URL("/become-vendor/registration-status", req.url));
  }

  // Protected registration paths
  if (PROTECTED_REGISTRATION_PATHS.some((p) => pathname.startsWith(p))) {
    if (status === USER_STATUS.APPROVED) {
      return NextResponse.redirect(new URL("/vendor/dashboard", req.url));
    } else if (status === USER_STATUS.PENDING) {
      return NextResponse.next();
    } else {
      if (pathname === "/become-vendor/registration-status") {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/become-vendor/registration-status", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/become-vendor/:path*",
    "/vendor/:path*",
  ],
};