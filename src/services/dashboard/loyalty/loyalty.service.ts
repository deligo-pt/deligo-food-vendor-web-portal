"use server";

import { serverRequest } from "@/lib/serverFetch";
import { CACHE_TAGS } from "@/src/consts/cache.const";
import type {
  TClaimRewardPayload,
  TMyPoints,
  TMyReferrals,
  TPointsHistoryItem,
  TReward,
  TRewardClaim,
} from "@/src/types/loyalty.type";
import { catchAsync } from "@/src/utils/catchAsync";
import { updateTag } from "next/cache";

/**
 * Referral, points and rewards (`POINTS_AND_REWARDS_API_GUIDE`).
 *
 * Not cached: the balance drops at claim time and when the nightly job expires
 * old points, and the guide asks for a fresh read on every visit. The tag is
 * still expired after a claim, for any page that later caches these.
 *
 * Failures come back as `catchAsync` does it — `success: false`, the backend's
 * error body in `data` — and are turned into copy by `src/utils/loyalty.ts`.
 */

/** `GET /referrals/my-referrals`. VENDOR only — a branch gets 403. */
export const getMyReferrals = async () => {
  return catchAsync<TMyReferrals>(async () => {
    return await serverRequest.get("/referrals/my-referrals");
  });
};

/** `GET /points/my-points`. */
export const getMyPoints = async () => {
  return catchAsync<TMyPoints>(async () => {
    return await serverRequest.get("/points/my-points");
  });
};

/** `GET /points/my-history` — last 18 months, newest first, paginated. */
export const getMyPointsHistory = async (params: { page?: number; limit?: number } = {}) => {
  return catchAsync<TPointsHistoryItem[]>(async () => {
    return await serverRequest.get("/points/my-history", {
      params: { page: params.page ?? 1, limit: params.limit ?? 10 },
    });
  });
};

/** `GET /rewards` — the Vendor catalog, active only, cheapest first. */
export const getRewards = async () => {
  return catchAsync<TReward[]>(async () => {
    return await serverRequest.get("/rewards");
  });
};

/**
 * `POST /rewards/claim`. Spends points. The body is rebuilt here from the two
 * allowed fields, because the server rejects any extra key.
 */
export const claimRewardReq = async (payload: TClaimRewardPayload) => {
  const result = await catchAsync<TRewardClaim>(async () => {
    return await serverRequest.post("/rewards/claim", {
      data: {
        productId: payload.productId,
        scheduledPickupDate: payload.scheduledPickupDate,
      },
    });
  });
  if (result.success) updateTag(CACHE_TAGS.loyalty);
  return result;
};
