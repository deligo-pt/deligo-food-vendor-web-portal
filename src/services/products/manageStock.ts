"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TResponse } from "@/src/types";

export const updateStock = async (
  id: string,
  stock: {
    quantity: number;
    availabilityStatus: string;
  }
) => {
  try {
    const updatedData = { stock };
    const formData = new FormData();
    formData.append("data", JSON.stringify(updatedData));

    const result = (await serverRequest.patch(`/products/${id}`, {
      data: formData,
    })) as TResponse<null>;

    return result;
  } catch (error) {
    console.log(error);
  }
};
