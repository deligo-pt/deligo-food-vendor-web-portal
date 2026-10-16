"use server";

import { serverCachedGet } from "@/lib/serverFetch";
import { CACHE_SECONDS, CACHE_TAGS } from "@/src/consts/cache.const";
import { TSdrEffective } from "@/src/types/product.type";

/**
 * The SDR (container deposit) amount in force — `GET /sdr-deposits/effective`.
 *
 * Read-only for vendors: the admin schedules the amount, the vendor only
 * decides which products carry it (`sdr.applicable`). Cached like the other
 * lists; the amount changes on a schedule, not per request.
 *
 * Any failure answers "not active", so the product form still works — the
 * switch is the vendor's choice whether or not the amount could be read.
 */
export const getEffectiveSdrDeposit = async (): Promise<TSdrEffective> => {
  const inactive: TSdrEffective = { isActive: false, depositAmount: 0, currency: "EUR" };
  try {
    const body = await serverCachedGet("/sdr-deposits/effective", {
      revalidate: CACHE_SECONDS.lists,
      tags: [CACHE_TAGS.sdr],
    });
    const data = body?.success ? body.data : null;
    if (!data || typeof data.depositAmount !== "number") return inactive;
    return {
      isActive: data.isActive === true && data.depositAmount > 0,
      depositAmount: data.depositAmount,
      currency: data.currency || "EUR",
      effectiveFrom: data.effectiveFrom,
    };
  } catch {
    return inactive;
  }
};
