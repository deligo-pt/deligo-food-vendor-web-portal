"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TOffer } from "@/src/types/offer.type";
import { catchAsync } from "@/src/utils/catchAsync";
import { type TTwoForOneState, twoForOneOfferPayload, twoForOneState } from "@/src/utils/twoForOne";

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

/* ---------- "2×1" on a product (plan.md §10.2) ---------- */

/**
 * The product's 2×1 state, from the store's offers (every page). Never
 * throws: `null` when the offers could not be read, so the form can say so
 * instead of guessing "off".
 */
export const getTwoForOneStateReq = async (productMongoId: string): Promise<TTwoForOneState | null> => {
  const offers: TOffer[] = [];
  for (let page = 1; page <= 20; page++) {
    const res = await catchAsync<TOffer[]>(async () =>
      serverRequest.get("/offers", { params: { limit: 100, page, isDeleted: false } }),
    );
    if (!res.success || !Array.isArray(res.data)) return null;
    offers.push(...res.data);
    const totalPage = Number(res.meta?.totalPage ?? 1);
    if (page >= totalPage) break;
  }
  return twoForOneState(offers, productMongoId);
};

/** Creates the product's buy-1-get-1-free offer. */
export const createTwoForOneReq = async (productMongoId: string, name: { en: string; pt: string }) => {
  return catchAsync<TOffer>(async () =>
    serverRequest.post("/offers/create-offer", { data: twoForOneOfferPayload(productMongoId, name) }),
  );
};

/**
 * Ends the product's 2×1. The API deletes only inactive offers ("An active
 * offer must be deactivated before it can be deleted"), so it is switched
 * off first, then deleted.
 */
export const removeTwoForOneReq = async (offerId: string) => {
  const off = await catchAsync<null>(async () => serverRequest.patch(`/offers/toggle-status/${offerId}`));
  if (!off.success) return off;
  return catchAsync<null>(async () => serverRequest.delete(`/offers/soft-delete/${offerId}`));
};
