"use server";

import { serverFetch, serverRequest } from "@/lib/serverFetch";
import { TVendor } from "@/src/types/vendor.type";
import { catchAsync } from "@/src/utils/catchAsync";

export const getProfileData = async () => {
  const result = await catchAsync<TVendor>(async () => {
    return await serverRequest.get("/profile");
  });

  if (result?.success) return result.data;

  return {};
};


export const getVendorDetails = async (userId: string) => {
  const result = await catchAsync(async () => {
    const response = await serverFetch.get(`/vendors/${userId}`);

    return await response.json();
  });

  return result;
};