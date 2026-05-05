import { TResponse } from "@/src/types";
import { catchAsync } from "@/src/utils/catchAsync";
import { postData } from "@/src/utils/requests";

export const uploadImagesReq = async (images: File[]) => {
  const formData = new FormData();
  images.forEach((image) => {
    formData.append("files", image);
  });

  return catchAsync<string[]>(async () => {
    return (await postData("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })) as unknown as TResponse<string[]>;
  });
};
