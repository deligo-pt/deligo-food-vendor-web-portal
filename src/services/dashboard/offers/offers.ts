"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TResponse } from "@/src/types";
import { TOffer } from "@/src/types/offer.type";

export const createOffer = async (payload: Partial<TOffer>) => {
  try {
    const result = (await serverRequest.post("/offers/create-offer", {
      data: payload,
    })) as TResponse<null>;

    if (result.success) {
      return { success: true, data: result.data, message: result.message };
    }
    return { success: false, data: result.error, message: result.message };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      data: error?.response?.data || null,
      message: error?.response?.data?.message || "Offer creation failed",
    };
  }
};

export const toggleOfferStatusReq = async (id: string) => {
  try {
    const result = (await serverRequest.patch(
      `/offers/toggle-status/${id}`
    )) as TResponse<null>;

    if (result.success) {
      return { success: true, data: result.data, message: result.message };
    }
    return { success: false, data: result.error, message: result.message };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      data: error?.response?.data || null,
      message: error?.response?.data?.message || "Offer status toggle failed",
    };
  }
};

export const updateOfferReq = async (id: string, data: Partial<TOffer>) => {
  try {
    const result = (await serverRequest.patch(`/offers/${id}`, {
      data,
    })) as TResponse<null>;

    if (result.success) {
      return { success: true, data: result.data, message: result.message };
    }
    return { success: false, data: result.error, message: result.message };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      data: error?.response?.data || null,
      message: error?.response?.data?.message || "Offer update failed",
    };
  }
};

export const deleteOfferReq = async (id: string) => {
  try {
    const result = (await serverRequest.delete(
      `/offers/soft-delete/${id}`
    )) as TResponse<null>;

    if (result.success) {
      return { success: true, data: result.data, message: result.message };
    }
    return { success: false, data: result.error, message: result.message };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      data: error?.response?.data || null,
      message: error?.response?.data?.message || "Offer delete failed",
    };
  }
};
