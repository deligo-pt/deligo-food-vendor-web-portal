"use server";

import { serverRequest } from "@/lib/serverFetch";
import { CACHE_TAGS } from "@/src/consts/cache.const";
import { catchAsync } from "@/src/utils/catchAsync";
import { updateTag } from "next/cache";

export const updateDocumentsReq = async (
  id: string,
  data: { docImageTitle: string; docImageUrls: string[] },
) => {
  const result = await catchAsync<null>(async () => {
    return await serverRequest.patch(`/vendors/${id}/docImage`, {
      data,
    });
  });
  // The vendor's record is cached by the dashboard (\`getProfileData\`).
  if (result.success) updateTag(CACHE_TAGS.profile);
  return result;
};

export const deleteDocumentReq = async (
  id: string,
  data: { docImageTitle: string; imageUrl: string },
) => {
  const result = await catchAsync<null>(async () => {
    return await serverRequest.delete(`/vendors/${id}/docImage`, {
      data,
    });
  });
  // The vendor's record is cached by the dashboard (\`getProfileData\`).
  if (result.success) updateTag(CACHE_TAGS.profile);
  return result;
};
