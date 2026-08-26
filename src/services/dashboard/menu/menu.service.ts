'use server';

import { serverFetch } from "@/lib/serverFetch";
import { CreateMenuFormValues } from "@/src/components/Dashboard/Menu/CreateMenu";
import { catchAsync } from "@/src/utils/catchAsync";
import { revalidatePath, revalidateTag } from "next/cache";

// create menu
export const createMenu = async (payload: CreateMenuFormValues) => {
    const result = await catchAsync(async () => {
        const response = await serverFetch.post("/menus", {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        return await response.json();
    });

    if (result.success) {
        revalidateTag("menus", {});
        revalidatePath("/vendor/menu/all");
    }

    return result;
};

// get all menus
export const getAllMenus = async () => {
    const result = await catchAsync(async () => {
        const response = await serverFetch.get(`/menus`, {
            next: {
                tags: ["menus"]
            }
        });

        return await response.json();
    });

    return result;
};

// get single menu
export const getSingleMenu = async (id: string) => {
    const result = await catchAsync(async () => {
        const response = await serverFetch.get(`/menus/${id}`, {
            next: {
                tags: ["menus"]
            }
        });

        return await response.json();
    });

    return result;
};

// create menu
export const updateMenu = async (payload: Partial<CreateMenuFormValues>, menuId: string) => {
    const result = await catchAsync(async () => {
        const response = await serverFetch.patch(`/menus/${menuId}`, {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        return await response.json();
    });

    if (result.success) {
        revalidateTag("menus", {});
        revalidatePath("/vendor/menu/all");
    }

    return result;
};