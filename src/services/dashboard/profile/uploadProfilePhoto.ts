"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TVendor } from "@/src/types/vendor.type";
import { catchAsync } from "@/src/utils/catchAsync";

export const uploadProfilePhoto = async (file: File) => {
  return catchAsync<TVendor>(async () => {
    const formData = new FormData();
    formData.append("file", file);
    return await serverRequest.patch("/profile", {
      data: formData,
    });
  });
};
