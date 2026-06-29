"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TAddonGroup } from "@/src/types/add-ons.type";
import { catchAsync } from "@/src/utils/catchAsync";

export const getAddOnsGroupReq = async ({ limit = 10 }) => {
  return catchAsync<TAddonGroup>(async () => {
    return await serverRequest.get("/add-ons", { params: { limit } });
  });
};

export const createAddOnsGroup = async (data: Partial<TAddonGroup>) => {
  return catchAsync<TAddonGroup>(async () => {
    return await serverRequest.post("/add-ons/create-group", {
      data,
    });
  });
};

export const updateAddOnsGroup = async (
  id: string,
  data: Partial<TAddonGroup>,
) => {
  return catchAsync<TAddonGroup>(async () => {
    return await serverRequest.patch(`/add-ons/${id}`, {
      data,
    });
  });
};

export const addOptionInGroup = async (
  groupId: string,
  data: { name: { en?: string; pt?: string }; price: number, tax: string },
) => {
  return catchAsync<null>(async () => {
    return await serverRequest.patch(`/add-ons/${groupId}/add-option`, {
      data,
    });
  });
};

export const deleteOptionFromGroup = async (
  groupId: string,
  optionSku: string,
) => {
  return catchAsync<null>(async () => {
    return await serverRequest.delete(`/add-ons/${groupId}/delete-option`, {
      data: { optionSku },
    });
  });
};
