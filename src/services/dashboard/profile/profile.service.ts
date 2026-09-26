"use server";

import { serverFetch, serverRequest } from "@/lib/serverFetch";
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
 */
export const getProfileData = async () => {
  const result = await catchAsync<TVendor>(async () => {
    return await serverRequest.get("/profile");
  });

  if (result?.success) return result.data;

  const decoded = await getDecodedToken();
  if (!decoded?.userId) return {};

  const fallback = await catchAsync<TVendor>(async () => {
    return await serverRequest.get(`/vendors/${decoded.userId}`);
  });

  if (fallback?.success) return fallback.data;

  return {};
};


export const getVendorDetails = async (userId: string) => {
  const result = await catchAsync(async () => {
    const response = await serverFetch.get(`/vendors/${userId}`);

    return await response.json();
  });

  return result;
};