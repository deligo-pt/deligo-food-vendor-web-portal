"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TVendor } from "@/src/types/vendor.type";
import { catchAsync } from "@/src/utils/catchAsync";

export const getProfileData = async () => {
  const result = await catchAsync<TVendor>(async () => {
    return await serverRequest.get("/profile");
  });

  if (result?.success) return result.data;

  return {};
};
