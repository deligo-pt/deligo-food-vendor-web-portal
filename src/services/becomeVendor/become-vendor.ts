"use server";

import { serverFetch, serverRequest } from "@/lib/serverFetch";
import { TVendor } from "@/src/types/vendor.type";
import { catchAsync } from "@/src/utils/catchAsync";
import { TVendorAgreementForm } from "@/src/validations/become-vendor/agreement.validation";
import { CACHE_TAGS } from "@/src/consts/cache.const";
import { revalidatePath, revalidateTag, updateTag } from "next/cache";

export const registerVendorReq = async (data: Partial<TVendor>) => {
  return catchAsync<TVendor>(async () => {
    return await serverRequest.post("/auth/register", {
      data,
    });
  });
};

// These change the vendor's own record, which the dashboard caches
// (`getProfileData`), so each expires that cache on success.
export const updateVendorReq = async (id: string, data: Partial<TVendor>) => {
  const result = await catchAsync<null>(async () => {
    return await serverRequest.patch(`/vendors/${id}`, {
      data,
    });
  });
  if (result.success) updateTag(CACHE_TAGS.profile);
  return result;
};

export const submitForApprovalReq = async (id: string) => {
  const result = await catchAsync<null>(async () => {
    return await serverRequest.patch(`/auth/${id}/submitForApproval`);
  });
  if (result.success) updateTag(CACHE_TAGS.profile);
  return result;
};


// ---> agreement related apis
// create agreement
export const createAgreement = async (id: string, data: Partial<TVendorAgreementForm>) => {
  const result = await catchAsync(async () => {
    const res = await serverFetch.post(`/agreements/party/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  });

  if (result.success) {
    revalidateTag("agreements", {});
    revalidatePath("/become-vendor/agreement-sign");
  };


  return result;
};


// sign agreement
export const signAgreement = async (id: string, data: Record<string, string>) => {
  const result = await catchAsync(async () => {
    const res = await serverFetch.post(`/agreements/${id}/sign`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  });

  if (result.success) {
    revalidateTag("agreements", {});
    updateTag(CACHE_TAGS.profile);
    revalidatePath("/become-vendor/agreement-sign");
  };

  return result;

};


// get single agreement
export const getSingleAgreement = async (id: string) => {
  const result = await catchAsync(async () => {
    const response = await serverFetch.get(`/agreements/${id}`, {
      next: {
        tags: ["agreements"]
      }
    });

    return await response.json();
  });

  return result;
};

// get vendor agreement history
export const getAgreementHistory = async (vendorId: string, query?: string) => {
  const result = await catchAsync(async () => {
    const response = await serverFetch.get(`/agreements/party/${vendorId}${query ? `?${query}` : ""}`, {
      next: {
        tags: ["agreements"]
      }
    });

    return await response.json();
  });

  return result;
};

// get vendor current agreement
export const getCurrentAgreementVersion = async () => {
  const result = await catchAsync(async () => {
    const response = await serverFetch.get(`/agreements/current`, {
      next: {
        tags: ["agreements"]
      }
    });

    return await response.json();
  });

  return result;
};