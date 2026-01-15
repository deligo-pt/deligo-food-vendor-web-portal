"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TOffer } from "@/src/types/offer.type";
import { catchAsync } from "@/src/utils/catchAsync";

export const createOfferReq = async (data: Partial<TOffer>) => {
  return catchAsync<null>(async () => {
    return await serverRequest.post("/offers/create-offer", {
      data,
    });
  });
};

export const toggleOfferStatusReq = async (id: string) => {
  return catchAsync<null>(async () => {
    return await serverRequest.patch(`/offers/toggle-status/${id}`);
  });
};

export const updateOfferReq = async (id: string, data: Partial<TOffer>) => {
  return catchAsync<null>(async () => {
    return await serverRequest.patch(`/offers/${id}`, {
      data,
    });
  });
};

export const deleteOfferReq = async (id: string) => {
  return catchAsync<null>(async () => {
    return await serverRequest.delete(`/offers/soft-delete/${id}`);
  });
};
