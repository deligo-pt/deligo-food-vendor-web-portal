'use server';

import { serverFetch } from "@/lib/serverFetch";
import { catchAsync } from "@/src/utils/catchAsync";
import { CACHE_SECONDS, CACHE_TAGS } from "@/src/consts/cache.const";
import { revalidatePath, updateTag } from "next/cache";



export const addNewBranch = async (payload: { email: string; password: string }) => {

    const data = {
        ...payload,
        role: "SUB_VENDOR",
    };

    const result = await catchAsync(async () => {
        const response = await serverFetch.post("/auth/register/onboard", {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return await response.json();
    });

    if (result.success) {
        updateTag(CACHE_TAGS.branches);
        revalidatePath("/vendor/branches");
    }

    return result;
};


/**
 * `cached`: for the copy-to-branch targets on the item pages, which need the
 * list but not up-to-the-second status (see `cache.const.ts`). The Branch
 * Management page leaves it off, because an admin approving a branch must show
 * there straight away.
 */
export const getAllBranches = async (id: string, query?: string, { cached = false }: { cached?: boolean } = {}) => {
    const result = await catchAsync(async () => {
        const response = await serverFetch.get(
            `/vendors/${id}/branches${query ? `?${query}` : ""}`,
            cached ? { next: { revalidate: CACHE_SECONDS.lists, tags: [CACHE_TAGS.branches] } } : {},
        );

        return await response.json();
    });

    return result;
};