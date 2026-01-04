"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TResponse } from "@/src/types";
import { TAddonGroup } from "@/src/types/add-ons.type";

export const createAddOnsGroup = async (payload: Partial<TAddonGroup>) => {
  try {
    const result = (await serverRequest.post("/add-ons/create-group", {
      data: payload,
    })) as TResponse<TAddonGroup>;

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
      message:
        error?.response?.data?.message || "Add-ons group creation failed",
    };
  }
};

export const updateAddOnsGroup = async (
  id: string,
  payload: Partial<TAddonGroup>
) => {
  try {
    const result = (await serverRequest.patch(`/add-ons/${id}`, {
      data: payload,
    })) as TResponse<TAddonGroup>;

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
      message: error?.response?.data?.message || "Add-ons group update failed",
    };
  }
};

export const addOptionInGroup = async (
  groupId: string,
  data: { name: string; price: number }
) => {
  try {
    const result = (await serverRequest.patch(`/add-ons/${groupId}/add-option`, {
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
      message: error?.response?.data?.message || "Add-ons option add failed",
    };
  }
};

export const deleteOptionFromGroup = async (
  groupId: string,
  optionName: string
) => {
  try {
    const result = (await serverRequest.delete(
      `/add-ons/${groupId}/delete-option`,
      {
        params: { optionName },
      }
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
      message: error?.response?.data?.message || "Add-ons option delete failed",
    };
  }
};
