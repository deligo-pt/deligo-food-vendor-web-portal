"use server";

import { serverRequest } from "@/lib/serverFetch";
import { catchAsync } from "@/src/utils/catchAsync";

export const updateDocumentsReq = async (
  id: string,
  data: { docImageTitle: string; docImageUrls: string[] },
) => {
  return catchAsync<null>(async () => {
    return await serverRequest.patch(`/vendors/${id}/docImage`, {
      data,
    });
  });
};

export const deleteDocumentReq = async (
  id: string,
  data: { docImageTitle: string; imageUrl: string },
) => {
  return catchAsync<null>(async () => {
    return await serverRequest.delete(`/vendors/${id}/docImage`, {
      data,
    });
  });
};
