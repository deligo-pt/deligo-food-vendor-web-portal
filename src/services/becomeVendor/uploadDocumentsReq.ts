"use server";

import { serverRequest } from "@/lib/serverFetch";

export const uploadDocumentsReq = async (
  id: string,
  key: string,
  file: Blob
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("data", JSON.stringify({ docImageTitle: key }));

    const result = await serverRequest.patch(`/vendors/${id}/docImage`, {
      data: formData,
    });

    return result;
  } catch (err) {
    console.error("Server fetch error:", err);
    return false;
  }
};
