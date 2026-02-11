import { USER_ROLE, USER_STATUS } from "@/src/consts/user.const";
import { getVendorInfo } from "@/src/utils/getVendorInfo";
import { verifyTokens } from "@/src/utils/verifyTokens";
import { NextRequest, NextResponse } from "next/server";

const AUTH_PATHS = [
  "/login",
  "/become-vendor",
  // "/forgot-password",
  // "/reset-password",
];

export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  if (searchParams.has("tokenRefreshed")) {
    const url = req.nextUrl.clone();
    url.searchParams.delete("tokenRefreshed");
    return NextResponse.redirect(url);
  }

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("redirect", pathname);

  const tokenWasRefreshed = await verifyTokens();

  if (tokenWasRefreshed) {
    const url = req.nextUrl.clone();
    url.searchParams.set("tokenRefreshed", "true");
    return NextResponse.redirect(url);
  }

  const vendorResult = await getVendorInfo();

  if (vendorResult) {
    const vendorInfo = vendorResult?.vendor;
    if (vendorInfo.role === USER_ROLE.VENDOR) {
      if (
        AUTH_PATHS.some(
          (path) => pathname === path || pathname.startsWith(`${path}`),
        )
      ) {
        if (
          pathname === "/login" ||
          pathname === "/become-vendor" ||
          pathname === "/become-vendor/verify-otp"
        ) {
          if (vendorInfo.status === USER_STATUS.APPROVED) {
            return NextResponse.redirect(new URL("/vendor/dashboard", req.url));
          }
          return NextResponse.redirect(
            new URL("/become-vendor/registration-status", req.url),
          );
        } else if (
          pathname === "/become-vendor/personal-details" ||
          pathname === "/become-vendor/business-details" ||
          pathname === "/become-vendor/business-location" ||
          pathname === "/become-vendor/bank-details" ||
          pathname === "/become-vendor/document-image-details"
        ) {
          if (
            vendorInfo.status === USER_STATUS.APPROVED ||
            vendorInfo.status === USER_STATUS.SUBMITTED
          ) {
            return NextResponse.redirect(
              new URL("/become-vendor/registration-status", req.url),
            );
          }
        }
      }
    } else {
      req.cookies.delete("accessToken");
      req.cookies.delete("refreshToken");
      return NextResponse.redirect(loginUrl);
    }
  } else {
    if (
      pathname === "/become-vendor/personal-details" ||
      pathname === "/become-vendor/business-details" ||
      pathname === "/become-vendor/business-location" ||
      pathname === "/become-vendor/bank-details" ||
      pathname === "/become-vendor/document-image-details" ||
      pathname === "/become-vendor/registration-status" ||
      pathname.startsWith("/vendor")
    ) {
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/become-vendor/:path*", "/vendor/:path*"],
};
