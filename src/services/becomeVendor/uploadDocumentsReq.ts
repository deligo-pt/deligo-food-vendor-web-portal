"use server";

import { serverRequest } from "@/lib/serverFetch";
import { catchAsync } from "@/src/utils/catchAsync";

export const uploadDocumentsReq = async (
  id: string,
  key: string,
  file: Blob
) => {
  return catchAsync<null>(async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("data", JSON.stringify({ docImageTitle: key }));

    return await serverRequest.patch(`/vendors/${id}/docImage`, {
      data: formData,
    });
  });
};
