"use server";

import { serverCachedGet, serverFetch } from "@/lib/serverFetch";
import { CACHE_SECONDS, CACHE_TAGS } from "@/src/consts/cache.const";
import { USER_ROLE } from "@/src/consts/user.const";
import { cache } from "react";
import { TVendor } from "@/src/types/vendor.type";
import { catchAsync } from "@/src/utils/catchAsync";
import { getDecodedToken } from "@/src/utils/getDecodedToken";

/**
 * The signed-in account's own record.
 *
 * `/profile` answers **403** for a `SUB_VENDOR` — "Access denied. You do not
 * have permission to view this section." — so every branch account used to run
 * the whole dashboard on `{}`: no role, no `businessTypeSlug`, nothing. That is
 * not visible as an error anywhere; it just makes each feature that reads the
 * vendor quietly behave as though it were a fresh main vendor. The Branch
 * Management menu showing to branches was one symptom of it.
 *
 * `/vendors/{userId}` is not restricted and returns the same shape — including
 * `role`, `parentVendorId` and `businessDetails` — so it is the fallback.
 * Verified 26 Sep 2026 against `SV-BJQPVEMB`.
 *
 * Cached two ways:
 * - **Per request**, with React `cache()`. The dashboard layout and the page
 *   under it both ask for the vendor, and without it each request made two to
 *   four of these calls.
 * - **Across requests** for `CACHE_SECONDS.profile`, per session and language
 *   (`serverCachedGet`; see `cache.const.ts`). Pages that need the vendor before
 *   their own data, such as all-items, otherwise wait one extra round trip on
 *   every navigation.
 * It is wrapped rather than exported directly, because a `"use server"` file
 * may only export plain async functions.
 *
 * A branch goes straight to `/vendors/{userId}`. `/profile` would only answer
 * 403, and a 403 is never cached, so it would cost a wasted call every time.
 */
const PROFILE_CACHE = { revalidate: CACHE_SECONDS.profile, tags: [CACHE_TAGS.profile] };

const loadProfile = cache(async () => {
  const decoded = await getDecodedToken();

  if (decoded?.role !== USER_ROLE.SUB_VENDOR) {
    const result = await catchAsync<TVendor>(async () => {
      return await serverCachedGet("/profile", PROFILE_CACHE);
    });

    if (result?.success) return result.data;
  }

  if (!decoded?.userId) return {};

  const fallback = await catchAsync<TVendor>(async () => {
    return await serverCachedGet(`/vendors/${decoded.userId}`, PROFILE_CACHE);
  });

  if (fallback?.success) return fallback.data;

  return {};
});

export const getProfileData = async () => loadProfile();


export const getVendorDetails = async (userId: string) => {
  const result = await catchAsync(async () => {
    const response = await serverFetch.get(`/vendors/${userId}`);

    return await response.json();
  });

  return result;
};