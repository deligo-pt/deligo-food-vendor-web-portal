'use server';

import { serverFetch } from "@/lib/serverFetch";
import { catchAsync } from "@/src/utils/catchAsync";
import { revalidatePath, revalidateTag } from "next/cache";



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
        revalidateTag("branches", {});
        revalidatePath("/vendor/branches");
    }

    return result;
};