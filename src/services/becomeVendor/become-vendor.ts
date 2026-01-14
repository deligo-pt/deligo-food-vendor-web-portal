"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TVendor } from "@/src/types/vendor.type";
import { catchAsync } from "@/src/utils/catchAsync";

export const registerVendorReq = async (data: Partial<TVendor>) => {
  return catchAsync<TVendor>(async () => {
    return await serverRequest.post("/auth/register/create-vendor", {
      data,
    });
  });
};

export const updateVendorReq = async (id: string, data: Partial<TVendor>) => {
  return catchAsync<null>(async () => {
    return await serverRequest.patch(`/vendors/${id}`, {
      data,
    });
  });
};

export const submitForApprovalReq = async (id: string) => {
  return catchAsync<null>(async () => {
    return await serverRequest.patch(`/auth/${id}/submitForApproval`);
  });
};
