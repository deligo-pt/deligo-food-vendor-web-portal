import { USER_STATUS } from "@/src/consts/user.const";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const AUTH_PATHS = ["/login", "/become-vendor"];
const JWT_ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || "Secret"
);

async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_ACCESS_SECRET);
    return payload as { role?: string; status?: string };
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("redirect", pathname);

  if (
    AUTH_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}`)
    )
  ) {
    if (accessToken) {
      const decoded = await verifyJWT(accessToken);
      if (decoded && decoded?.role === "VENDOR") {
        if (
          pathname === "/login" ||
          pathname === "/become-vendor" ||
          pathname === "/become-vendor/verify-otp"
        ) {
          if (decoded.status !== USER_STATUS.REJECTED) {
            return NextResponse.redirect(
              new URL("/become-vendor/registration-status", req.url)
            );
          }
        } else if (
          pathname === "/become-vendor/personal-details" ||
          pathname === "/become-vendor/business-details" ||
          pathname === "/become-vendor/business-location" ||
          pathname === "/become-vendor/bank-details" ||
          pathname === "/become-vendor/document-image-details"
        ) {
          if (
            decoded.status === USER_STATUS.APPROVED ||
            decoded.status === USER_STATUS.SUBMITTED
          ) {
            return NextResponse.redirect(
              new URL("/become-vendor/registration-status", req.url)
            );
          }
        }
      } else if (
        pathname === "/become-vendor/personal-details" ||
        pathname === "/become-vendor/business-details" ||
        pathname === "/become-vendor/business-location" ||
        pathname === "/become-vendor/bank-details" ||
        pathname === "/become-vendor/document-image-details" ||
        pathname === "/become-vendor/registration-status"
      ) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } else if (
      pathname === "/become-vendor/personal-details" ||
      pathname === "/become-vendor/business-details" ||
      pathname === "/become-vendor/business-location" ||
      pathname === "/become-vendor/bank-details" ||
      pathname === "/become-vendor/document-image-details" ||
      pathname === "/become-vendor/registration-status"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/vendor")) {
    if (!accessToken) {
      return NextResponse.redirect(loginUrl);
    }

    const decoded = await verifyJWT(accessToken);
    if (!decoded) {
      return NextResponse.redirect(loginUrl);
    }

    if (decoded.role !== "VENDOR") {
      return NextResponse.redirect(loginUrl);
    } else if (
      decoded.status === USER_STATUS.PENDING ||
      decoded.status === USER_STATUS.SUBMITTED ||
      decoded.status === USER_STATUS.REJECTED
    ) {
      return NextResponse.redirect(
        new URL("/become-vendor/registration-status", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/become-vendor/:path*", "/vendor/:path*"],
};
