"use server";

import { serverFetch, serverRequest } from "@/lib/serverFetch";
import { CACHE_TAGS } from "@/src/consts/cache.const";
import type { TVendor, TWeeklyDaySchedule } from "@/src/types/vendor.type";
import { catchAsync } from "@/src/utils/catchAsync";
import { scheduleSaveBody } from "@/src/utils/weeklySchedule";
import { revalidatePath, updateTag } from "next/cache";

/**
 * Saves a store's weekly opening schedule (FRONTEND_VENDOR_SCHEDULE_GUIDE §4).
 *
 * `userId` is the store's `V-…` / `SV-…` id: the signed-in store itself, or one
 * of a parent vendor's branches. The body carries only `weeklySchedule`, all
 * seven days (the array replaces the whole week); the legacy hours are never
 * sent with it. The first save switches the store to the weekly format for good.
 */
export const updateWeeklyScheduleReq = async (userId: string, week: TWeeklyDaySchedule[]) => {
  const result = await catchAsync<TVendor>(async () => {
    return await serverRequest.patch(`/vendors/${userId}`, { data: scheduleSaveBody(week) });
  });
  if (result.success) {
    // The dashboard caches the signed-in store's record and the branch list.
    updateTag(CACHE_TAGS.profile);
    updateTag(CACHE_TAGS.branches);
    revalidatePath("/vendor/profile");
    revalidatePath(`/vendor/branches/${userId}`);
  }
  return result;
};

/** A fresh read of a store, for reloading the editor after a 409. Not cached. */
export const getStoreForScheduleReq = async (userId: string) => {
  return catchAsync<TVendor>(async () => {
    const response = await serverFetch.get(`/vendors/${userId}`);
    return await response.json();
  });
};
