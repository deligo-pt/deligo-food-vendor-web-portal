"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TResponse } from "@/src/types";
import { TVendor } from "@/src/types/vendor.type";

export const updateVendorData = async (id: string, data: Partial<TVendor>) => {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    const result = (await serverRequest.patch(`/vendors/${id}`, {
      data: formData,
    })) as TResponse<TVendor>;

    return result;
  } catch (err) {
    console.error("Server fetch error:", err);
    return false;
  }
};
