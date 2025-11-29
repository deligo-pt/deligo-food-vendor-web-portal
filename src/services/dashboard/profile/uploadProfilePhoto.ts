"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TResponse } from "@/src/types";
import { TVendor } from "@/src/types/vendor.type";

export const uploadProfilePhoto = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const result = (await serverRequest.patch("/profile", {
    data: formData,
  })) as TResponse<TVendor>;

  return result;
};
