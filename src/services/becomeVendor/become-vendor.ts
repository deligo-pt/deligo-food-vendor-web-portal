"use server";

import { serverFetch, serverRequest } from "@/lib/serverFetch";
import { TVendor } from "@/src/types/vendor.type";
import { catchAsync } from "@/src/utils/catchAsync";
import { TVendorAgreementForm } from "@/src/validations/become-vendor/agreement.validation";
import { revalidatePath, revalidateTag } from "next/cache";

export const registerVendorReq = async (data: Partial<TVendor>) => {
  return catchAsync<TVendor>(async () => {
    return await serverRequest.post("/auth/register", {
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