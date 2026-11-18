import { jwtDecode } from "jwt-decode";

/**
 * Where the panel keeps the session's refresh token, and how it gets there.
 *
 * Since the backend's security update (17 Nov 2026) a web sign-in no longer
 * returns `refreshToken` in the JSON body — the backend sends it only as an
 * httpOnly `Set-Cookie` (path `/api/v1/auth`, sameSite strict). Login and
 * OTP verification run in server actions here, so that cookie lands on the
 * Next server, never in the browser. Before this, the panel saved the body's
 * token from the browser; after the update it would have saved nothing, the
 * proxy's silent refresh would have failed, and every vendor would have been
 * sent to the login page as soon as their access token expired.
 *
 * So the server action reads the token from the backend's `Set-Cookie` and
 * keeps it as the panel's own `refreshToken` cookie — httpOnly now, which
 * page script could read before. `proxy.ts` and `getNewAccessToken` read it
 * server-side exactly as they always did.
 *
 * Server-only (it is imported by server actions and the proxy); no
 * `"use server"` because it exports plain helpers.
 */

export const REFRESH_TOKEN_COOKIE = "refreshToken";

const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * The refresh token from a backend answer: the body's, if an older backend
 * still sends it, otherwise the `refreshToken` in its `Set-Cookie` headers.
 */
export function refreshTokenFrom(response: Response, body: unknown): string | undefined {
  const fromBody = (body as { data?: { refreshToken?: unknown } } | null)?.data?.refreshToken;
  if (typeof fromBody === "string" && fromBody) return fromBody;

  for (const header of response.headers.getSetCookie?.() ?? []) {
    const match = header.match(/^\s*refreshToken=([^;]*)/);
    if (match?.[1]) {
      try {
        return decodeURIComponent(match[1]);
      } catch {
        return match[1];
      }
    }
  }
  return undefined;
}

/** Cookie options for the refresh token: httpOnly, until the token expires. */
export function refreshTokenCookieOptions(token: string) {
  let expires = new Date(Date.now() + YEAR_MS);
  try {
    const { exp } = jwtDecode<{ exp?: number }>(token);
    if (typeof exp === "number") expires = new Date(exp * 1000);
  } catch {}
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires,
  };
}

/** The role in an access token, or `undefined`. */
export function roleOf(accessToken: unknown): string | undefined {
  if (typeof accessToken !== "string") return undefined;
  try {
    return jwtDecode<{ role?: string }>(accessToken).role;
  } catch {
    return undefined;
  }
}

/** Drops `refreshToken` from a response body before it goes to the browser. */
export function withoutRefreshToken<T>(body: T): T {
  const data = (body as { data?: Record<string, unknown> } | null)?.data;
  if (data && typeof data === "object" && "refreshToken" in data) {
    const { refreshToken: _dropped, ...rest } = data;
    void _dropped;
    return { ...(body as object), data: rest } as T;
  }
  return body;
}
