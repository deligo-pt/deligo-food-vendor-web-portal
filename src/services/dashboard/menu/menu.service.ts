'use server';

import { serverFetch } from "@/lib/serverFetch";
import { CreateMenuFormValues } from "@/src/components/Dashboard/Menu/CreateMenu";
import { AddItemToSectionSchema } from "@/src/components/Dashboard/Menu/Section/AddItemToSection";
import { CreateMenuSectionFormValues } from "@/src/components/Dashboard/Menu/Section/AddSection";
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

// update menu
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

// soft delete menu
export const softDeleteMenu = async (id: string) => {
    const result = await catchAsync(async () => {
        const response = await serverFetch.delete(`/menus/soft-delete/${id}`, {
            next: {
                tags: ["menus"]
            }
        });

        return await response.json();
    });

    return result;
};

// soft delete menu
export const permanentDeleteMenu = async (id: string) => {
    const result = await catchAsync(async () => {
        const response = await serverFetch.delete(`/menus/permanent-delete/${id}`, {
            next: {
                tags: ["menus"]
            }
        });

        return await response.json();
    });

    return result;
};


// ---> menu apis
// create section in menu
export const addMenuSection = async (payload: CreateMenuSectionFormValues, menuId: string) => {
    const result = await catchAsync(async () => {
        const response = await serverFetch.post(`/menus/${menuId}/sections`, {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        return await response.json();
    });

    if (result.success) {
        revalidateTag("menu-section", {});
        revalidatePath(`/vendor/menu/${menuId}`);
    }

    return result;
};

// get all sections under menu
export const getAllMenuSection = async (menuId: string) => {
    const result = await catchAsync(async () => {
        const response = await serverFetch.get(`/menus/${menuId}/sections`, {
            next: {
                tags: ["menu-section"]
            }
        });

        return await response.json();
    });

    return result;
};

// update section in menu
export const updateMenuSection = async (payload: Partial<CreateMenuSectionFormValues>, sectionId: string, menuId: string) => {
    const result = await catchAsync(async () => {
        const response = await serverFetch.patch(`/menus/sections/${sectionId}`, {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        return await response.json();
    });

    if (result.success) {
        revalidateTag("menu-section", {});
        revalidatePath(`/vendor/menu/${menuId}`);
    }

    return result;
};

// delete menu section
export const deleteMenuSection = async (sectionId: string) => {
    const result = await catchAsync(async () => {
        const response = await serverFetch.delete(`/menus/sections/${sectionId}`);

        return await response.json();
    });

    if (result.success) {
        revalidateTag("menu-section", {});
    }

    return result;
};

// remove section item
export const removeSectionItem = async (sectionId: string, productId: string) => {
    const result = await catchAsync(async () => {
        const response = await serverFetch.delete(`/menus/sections/${sectionId}/items/${productId}`);

        return await response.json();
    });

    if (result.success) {
        revalidateTag("menu-section", {});
    }

    return result;
};

// add item to section
export const addItemToSection = async (payload: AddItemToSectionSchema, sectionId: string) => {
    const result = await catchAsync(async () => {
        const response = await serverFetch.post(`/menus/sections/${sectionId}/items`, {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        return await response.json();
    });

    if (result.success) {
        revalidateTag("menus", {});
        revalidateTag("menu-section", {});
    }

    return result;
};